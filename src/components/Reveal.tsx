"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode, ElementType } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps<E extends ElementType> = {
  as?: E;
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
} & Omit<React.ComponentProps<E>, "as">;

export function Reveal<E extends ElementType = "div">({
  as,
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  ...rest
}: RevealProps<E>) {
  const reduce = useReducedMotion();
  const MotionTag = motion(as ?? "div");
  return (
    <MotionTag
      className={className}
      suppressHydrationWarning
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}