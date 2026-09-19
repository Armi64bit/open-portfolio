"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef, useState, type ReactNode } from "react";

type LensSectionProps = {
  children: ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "className">;

/**
 * Cursor-following inversion lens. A solid circle chases the pointer across
 * the wrapped section; via mix-blend-mode: difference it flips the colors of
 * exactly the content it crosses — text stays in place, only its colors
 * invert. Wrap any section to get the effect.
 */
export function LensSection({
  children,
  className,
  ...rest
}: LensSectionProps) {
  const reduce = useReducedMotion();
  const host = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 24, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 240, damping: 24, mass: 0.35 });

  function onMove(e: React.PointerEvent<HTMLElement>) {
    if (!host.current) return;
    const r = host.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }

  return (
    <section
      ref={host}
      className={className}
      onPointerMove={onMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      {...rest}
    >
      {!reduce && (
        <motion.div
          className="hover-lens"
          aria-hidden="true"
          style={{ left: sx, top: sy }}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
          transition={{
            opacity: { duration: 0.22 },
            scale: { type: "spring", stiffness: 320, damping: 24 },
          }}
        />
      )}
      {children}
    </section>
  );
}