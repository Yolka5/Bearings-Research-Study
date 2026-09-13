"use client";

import { Player } from "@remotion/player";
import { PerspectiveMarquee } from "@/components/ui/remocn-perspective-marquee";

const bearingTypes = [
  "מיסב כדורי חריץ עמוק",
  "מיסב מגע זוויתי",
  "מיסב כדורי מיישר עצמי",
  "מיסב גלילה גלילי",
  "מיסב גלילה קוני",
  "מיסב גלילה כדורי",
  "מיסב מחט",
  "מיסב דחף",
  "מיסב החלקה",
];

// Player only ever renders the fixed-aspect composition, letterboxed to fit —
// but since the composition's own background matches this bar's background,
// the letterbox padding is invisible and the strip reads as full-bleed at
// any viewport width.
export function TopMarquee() {
  return (
    <div dir="ltr" className="relative z-40 h-14 w-full overflow-hidden bg-white">
      <Player
        component={PerspectiveMarquee}
        inputProps={{
          items: bearingTypes,
          fontSize: 22,
          fontWeight: 600,
          color: "#000000",
          background: "#ffffff",
          fadeColor: "#ffffff",
          rotateY: -18,
          rotateX: 4,
          perspective: 900,
          pixelsPerFrame: 3.5,
        }}
        durationInFrames={100000}
        compositionWidth={1600}
        compositionHeight={64}
        fps={30}
        autoPlay
        loop
        controls={false}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
