"use client";

import type { NodeShape } from "@/types/canvas";
import { DEFAULT_NODE_SIZES } from "@/types/canvas";

interface ShapeButtonProps {
  shape: NodeShape;
}

function ShapeButton({ shape }: ShapeButtonProps) {
  function handleDragStart(e: React.DragEvent<HTMLButtonElement>) {
    const size = DEFAULT_NODE_SIZES[shape];
    e.dataTransfer.setData(
      "application/ghost-shape",
      JSON.stringify({ shape, width: size.width, height: size.height })
    );
    e.dataTransfer.effectAllowed = "copy";
  }

  function handleClick() {
    const size = DEFAULT_NODE_SIZES[shape];
    window.dispatchEvent(
      new CustomEvent("ghost:insert-shape", {
        detail: { shape, width: size.width, height: size.height },
      })
    );
  }

  return (
    <button
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      aria-label={`Insert ${shape}`}
      className="flex h-9 w-9 cursor-grab items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary active:cursor-grabbing"
    >
      <ShapeIcon shape={shape} />
    </button>
  );
}

function ShapeIcon({ shape }: { shape: NodeShape }) {
  const cls = "h-4 w-4";

  switch (shape) {
    case "rectangle":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <rect x="1" y="4" width="14" height="8" rx="1" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <polygon points="8,1 15,8 8,15 1,8" />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <circle cx="8" cy="8" r="6.25" />
        </svg>
      );
    case "pill":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <rect x="1" y="5" width="14" height="6" rx="3" />
        </svg>
      );
    case "cylinder":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <ellipse cx="8" cy="4" rx="5.5" ry="2" />
          <line x1="2.5" y1="4" x2="2.5" y2="12" />
          <line x1="13.5" y1="4" x2="13.5" y2="12" />
          <ellipse cx="8" cy="12" rx="5.5" ry="2" />
        </svg>
      );
    case "hexagon":
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls}>
          <polygon points="8,1 14.5,4.5 14.5,11.5 8,15 1.5,11.5 1.5,4.5" />
        </svg>
      );
  }
}

const SHAPES: NodeShape[] = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
];

export function ShapePanel() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border-default bg-bg-surface px-3 py-1.5 shadow-lg">
        {SHAPES.map((shape) => (
          <ShapeButton key={shape} shape={shape} />
        ))}
      </div>
    </div>
  );
}
