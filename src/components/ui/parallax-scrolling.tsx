"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector(
      "[data-parallax-layers]"
    );

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0,
        },
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 },
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(
            `[data-parallax-layer="${layerObj.layer}"]`
          ),
          {
            yPercent: layerObj.yPercent,
            ease: "none",
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={parallaxRef}>
      <section className="relative h-[100vh] w-full overflow-hidden bg-neutral-900">
        <div
          data-parallax-layers
          className="relative h-full w-full overflow-hidden"
        >
          <img
            src="/Bearings2.jpg"
            data-parallax-layer="1"
            alt=""
            className="absolute inset-0 h-[120%] w-full scale-110 object-cover opacity-60"
          />
          <img
            src="/Bearings3.jpg"
            data-parallax-layer="2"
            alt=""
            className="absolute inset-0 h-[120%] w-full object-cover opacity-80 mix-blend-luminosity"
          />
          <div
            data-parallax-layer="3"
            className="absolute inset-0 flex items-center justify-center"
          >
            <h2 className="text-[clamp(3rem,10vw,9rem)] font-bold tracking-tight text-white">
              תנועה חלקה
            </h2>
          </div>
          <img
            src="/Bearings4.jpg"
            data-parallax-layer="4"
            alt=""
            className="absolute inset-x-0 bottom-0 h-1/2 w-full object-cover"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 25%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 25%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neutral-900 to-transparent" />
        </div>
      </section>
    </div>
  );
}
