"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";

interface CardProps {
  number: string;
  title: string;
  questions: string[];
  colorTheme?: "orange" | "blue" | "purple";
  className?: string;
  style?: React.CSSProperties;
  rotate?: string;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  questions,
  colorTheme = "blue",
  className,
  style,
  rotate,
  colors: customColors,
}: CardProps) => {
  const defaultBgColors = {
    orange: "bg-orange-50 dark:bg-orange-500/10",
    blue: "bg-blue-50 dark:bg-blue-500/10",
    purple: "bg-purple-50 dark:bg-purple-500/10",
  };
  const defaultTextColors = {
    orange: "text-orange-500 dark:text-orange-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
  };
  const defaultBorderColors = {
    orange: "border-orange-100 dark:border-orange-500/20",
    blue: "border-blue-100 dark:border-blue-500/20",
    purple: "border-purple-100 dark:border-purple-500/20",
  };

  const bgColor = customColors?.bg || defaultBgColors[colorTheme];
  const textColor = customColors?.text || defaultTextColors[colorTheme];
  const borderColor = customColors?.border || defaultBorderColors[colorTheme];

  return (
    <div
      className={`relative w-full md:w-[340px] transition-transform duration-300 hover:z-30 hover:scale-105 ${rotate} ${className}`}
      style={style}
    >
      <div className="bg-white dark:bg-neutral-900 p-2 rounded-[25px] shadow-[0px_10px_20px_0px_#D3D3D3] dark:shadow-none border border-neutral-100 dark:border-neutral-800">
        <Pin className={`w-8 h-8 ${textColor} z-20 mb-6 mx-auto`} />
        <div
          className={`${bgColor} border ${borderColor} rounded-[15px] p-[18px] h-full flex flex-col relative overflow-hidden`}
        >
          <span
            className={`${textColor} text-4xl font-handwriting mb-4`}
            style={{
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            }}
          >
            {number}
          </span>
          <h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 leading-none mb-3">
            {title}
          </h3>
          <ol className="list-decimal ps-5 space-y-2 text-neutral-500 dark:text-neutral-400 text-sm/6 tracking-tight">
            {questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  questions: string[];
  colorTheme?: "orange" | "blue" | "purple";
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

interface CardLayoutSpec {
  side: "left" | "right";
  top: number;
}

export interface HowItWorksProps {
  features: Step[];
  className?: string;
}

export default function HowItWorks({ features, className }: HowItWorksProps) {
  // Long-form question lists need far more vertical breathing room per card
  // than the original short-blurb demo, so the layout + connector path below
  // are generated from a simple {side, top} spec instead of hand-tuned pixels.
  const CARD_VERTICAL_GAP = 460;
  const layout: CardLayoutSpec[] = features.map((_, index) => ({
    side: index % 2 === 0 ? "left" : "right",
    top: index * CARD_VERTICAL_GAP,
  }));

  const height = layout[layout.length - 1].top + 420;
  const viewBoxWidth = 1000;
  const pinPoints = layout.map((spec) => ({
    x: spec.side === "left" ? 260 : viewBoxWidth - 260,
    y: spec.top + 110,
  }));

  const pathD = pinPoints.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = pinPoints[index - 1];
    const midY = (prev.y + point.y) / 2;
    return `${acc} C ${prev.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
  }, "");

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={`bg-white dark:bg-black max-md:pt-10 max-md:pb-25 md:py-20 px-8 relative ${className ?? ""}`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.15]"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px)",
            backgroundSize: "100% 32px",
            marginTop: "4px",
          }}
        ></div>
        <div
          className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-[0.1]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "100% 32px",
            marginTop: "4px",
          }}
        ></div>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className="relative w-full max-w-[1000px] mx-auto flex flex-col space-y-8 md:space-y-0 md:block h-auto md:h-[var(--md-height)]"
            style={{ "--md-height": `${height}px` } as React.CSSProperties}
          >
            {features.length > 1 && (
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block z-0"
                viewBox={`0 0 ${viewBoxWidth} ${height}`}
                preserveAspectRatio="none"
              >
                <m.path
                  d={pathD}
                  stroke="currentColor"
                  className="text-neutral-300 dark:text-neutral-700"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  fill="none"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{
                    strokeDashoffset: -140,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </svg>
            )}

            {features.map((step, index) => {
              const spec = layout[index];
              const anchorClass =
                spec.side === "left" ? "md:left-[8%]" : "md:right-[8%]";
              const rotate = spec.side === "left" ? "rotate-6" : "-rotate-6";

              return (
                <Card
                  key={step.title}
                  number={`0${index + 1}`}
                  title={step.title}
                  questions={step.questions}
                  colorTheme={step.colorTheme || "blue"}
                  colors={step.colors}
                  rotate={rotate}
                  className={`md:absolute ${anchorClass}`}
                  style={{ top: `${spec.top}px` }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
