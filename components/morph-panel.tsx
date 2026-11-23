"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface MorphPanelProps {
  from: Box;
  to: Box;
  fromRadius: number;
  toRadius: number;
  /** Fades out at the end (used when shrinking back into a button) */
  fadeOut?: boolean;
  onDone: () => void;
}

const DURATION = 500;

/**
 * Dark red panel that morphs from one box to another (Web Animations API,
 * so the start and end states are explicit and never depend on paint timing).
 * Used by /send-files for the "how to prepare your files" open/close effect.
 */
export function MorphPanel({ from, to, fromRadius, toRadius, fadeOut, onDone }: MorphPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      doneRef.current();
    };
    const frame = (b: Box, radius: number, opacity: number) => ({
      top: `${b.top}px`,
      left: `${b.left}px`,
      width: `${b.width}px`,
      height: `${b.height}px`,
      borderRadius: `${radius}px`,
      opacity,
    });
    const keyframes = fadeOut
      ? [frame(from, fromRadius, 1), { ...frame(to, toRadius, 1), offset: 0.85 }, frame(to, toRadius, 0)]
      : [frame(from, fromRadius, 1), frame(to, toRadius, 1)];
    const animation = el.animate(keyframes, {
      duration: DURATION,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "forwards",
    });
    animation.onfinish = finish;
    // Safety net if the animation is throttled (background tab)
    const fallback = setTimeout(finish, DURATION + 250);
    return () => {
      clearTimeout(fallback);
      animation.cancel();
    };
    // Runs once per panel instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed z-[100] bg-red-dark pointer-events-none"
      style={{ top: from.top, left: from.left, width: from.width, height: from.height, borderRadius: fromRadius }}
    />,
    document.body,
  );
}
