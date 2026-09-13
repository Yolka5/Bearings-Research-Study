"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BlurReveal } from "@/components/ui/blur-reveal";

// A small studio "softbox" room: bright rectangular panels against a dark
// backdrop. Fed into PMREMGenerator this gives metal crisp, directional
// specular streaks instead of RoomEnvironment's flat, uniform glow — the
// difference between looking like a plastic toy and a photographed part.
function buildStudioEnvironment() {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x8a8a8a);

  const panelGeo = new THREE.PlaneGeometry(1, 1);

  function addPanel(
    position: [number, number, number],
    size: [number, number],
    rotation: [number, number, number],
    intensity: number,
    color = 0xffffff
  ) {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(panelGeo, material);
    mesh.scale.set(size[0], size[1], 1);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    envScene.add(mesh);
  }

  // large soft key light overhead
  addPanel([0, 6, 0], [10, 10], [-Math.PI / 2, 0, 0], 2.6);
  // bright side key, slightly warm
  addPanel([-6, 1, 4], [5, 8], [0, Math.PI / 2.3, 0], 3, 0xfff4e0);
  // cooler rim light on the opposite side for separation
  addPanel([6, 0, -4], [5, 7], [0, -Math.PI / 2.6, 0], 2, 0xdbe8ff);
  // low fill so the underside isn't pure black
  addPanel([0, -5, 2], [8, 6], [Math.PI / 2, 0, 0], 1.2);

  return envScene;
}

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Environment map gives the metal/anodized surfaces something to reflect
    // instead of rendering as flat, unlit color swatches.
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(buildStudioEnvironment(), 0.02).texture;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe0e0e0, 0.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    const shadowGeo = new THREE.PlaneGeometry(4, 4);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.1, 0);
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    let bearingModel: THREE.Object3D | null = null;

    function positionModel(object: THREE.Object3D) {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      object.position.x += object.position.x - center.x;
      object.position.y += object.position.y - center.y;
      object.position.z += object.position.z - center.z;

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.7 / maxDim;
      object.scale.setScalar(scale);
    }

    const loader = new GLTFLoader();
    loader.load(
      "/Bearing.gltf",
      (gltf) => {
        bearingModel = gltf.scene;
        positionModel(bearingModel);

        bearingModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const material = child.material as THREE.MeshStandardMaterial;
            material.metalness = 0.9;
            material.roughness = 0.3;
            material.envMapIntensity = 1.3;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(bearingModel);
      },
      undefined,
      (error) => {
        console.error("Error loading Bearing.gltf:", error);
      }
    );

    function onResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener("resize", onResize);

    // Launch the bearing up and out as soon as the user starts scrolling,
    // well before the hero section itself has scrolled away.
    let scrollTicking = false;
    function onScroll() {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        scrollTicking = false;
        if (!container) return;
        const progress = Math.min(
          1,
          window.scrollY / (window.innerHeight * 0.6)
        );
        container.style.transform = `translate3d(0, ${-progress * 120}vh, 0)`;
        container.style.opacity = String(1 - progress);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let frameId: number;
    function animate() {
      frameId = requestAnimationFrame(animate);
      if (bearingModel) {
        bearingModel.rotation.y += 0.012;
      }
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      pmrem.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, #dcdcdc 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 50% 45%, #cfc8b8 0%, transparent 55%)",
        }}
      />
      <div
        dir="ltr"
        className="absolute inset-x-0 top-[14%] z-20 flex justify-center px-4"
      >
        <BlurReveal
          as="h1"
          trigger
          delay={0.2}
          speedReveal={1.1}
          speedSegment={0.8}
          className="text-center font-normal italic leading-none tracking-tight text-black"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            fontSize: "clamp(2.8rem, 8vw, 7rem)",
          }}
        >
          Just Spin.
        </BlurReveal>
      </div>
      <div
        ref={containerRef}
        className="absolute inset-0 z-10 will-change-transform"
      />
    </section>
  );
}
