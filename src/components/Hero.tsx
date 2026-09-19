"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { heroPortraitTrio } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { Magnetic } from "./Magnetic";

type Look = keyof typeof heroPortraitTrio;

const LOOK_ORDER: Look[] = ["left", "middle", "right"];

/** Opacity of the straight-on frame given cursor position v in [-1, 1].
 *  Zones are roughly thirds of the image: cursor clearly left -> left frame,
 *  clearly right -> right frame, with a narrow center band and soft blends at
 *  the boundaries. */
function midOpacity(v: number) {
  return 1 - Math.min(1, Math.max(0, (Math.abs(v) - 0.22) / 0.28));
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const visorRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // parallax layers
  const yImg = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 150]);
  const rotateTitle = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduce ? 0 : -2.2],
  );
  const fadeTitle = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, reduce ? 1 : 0],
  );

  // cursor-follow portrait: hover position is measured against the portrait's
  // own box. Left of the image -> left-looking frame, right -> right-looking
  // frame, wide center -> straight-on frame, and hovering the top/bottom edge
  // of the frame (or leaving it) returns to the straight-on frame. The frames
  // crossfade continuously and the portrait itself drifts and tilts slightly
  // toward the cursor.
  const pointer = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smooth = useSpring(pointer, { stiffness: 150, damping: 22, mass: 0.35 });
  const smoothY = useSpring(pointerY, { stiffness: 150, damping: 22, mass: 0.35 });
  const tiltY = useSpring(
    useTransform(pointer, [-1, 1], [5, -5]),
    { stiffness: 130, damping: 18 },
  );
  const visorX = useTransform(smooth, [-1, 1], [15, -15]);
  const visorY = useTransform(smoothY, [-1, 1], [9, -9]);

  const midOp = useTransform(smooth, (v) => midOpacity(v));
  const leftOp = useTransform(smooth, (v) => (v < 0 ? 1 - midOpacity(v) : 0));
  const rightOp = useTransform(smooth, (v) => (v > 0 ? 1 - midOpacity(v) : 0));

  function onPointerMove(e: React.PointerEvent) {
    const rect = visorRef.current?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) return;
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    if (relY < 0.08 || relY > 0.92) {
      pointer.set(0);
      pointerY.set(0);
      return;
    }
    pointer.set(Math.max(-1, Math.min(1, (relX - 0.5) * 2)));
    pointerY.set(Math.max(-1, Math.min(1, (relY - 0.5) * 2)));
  }

  function onPointerLeave() {
    pointer.set(0);
    pointerY.set(0);
  }

  const word = "BAHAA";

  return (
    <section className="hero" ref={ref} id="home" data-od-id="hero">
      <div className="container" style={{ perspective: 1200 }}>
        <motion.h1
          className="display display--hero hero__title"
          suppressHydrationWarning
          style={{ y: yTitle, rotate: rotateTitle, opacity: fadeTitle }}
          aria-label={word}
        >
          {word.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="hero__letter"
              suppressHydrationWarning
              aria-hidden="true"
              initial={{ y: reduce ? 0 : "112%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.95, ease: EASE, delay: 0.07 * i + 0.1 }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.h1>

        <div className="hero__grid">
          <motion.div className="hero__lede-wrap" style={{ y: yText }}>
            <motion.p
              className="hero__lede"
              suppressHydrationWarning
              initial={{ opacity: 0, y: reduce ? 0 : 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
            >
              I&apos;m Bahaa Eddine Bouzid — a full-stack engineer building
              dependable web products, real-time systems, and cloud-ready
              platforms.
            </motion.p>

            <motion.div
              className="hero__meta-row"
              suppressHydrationWarning
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.85 }}
            >
              <Magnetic>
                <LinkArrow href="/#contact" label="Let's Talk" dataOdId="hero-cta" />
              </Magnetic>
              <span className="hero__meta text-muted">
                Tunis, Tunisia · Open to opportunities
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__portrait-wrap"
            suppressHydrationWarning
            style={{ y: yImg }}
            initial={{ opacity: 0, rotateY: reduce ? 0 : 14, rotateX: reduce ? 0 : 10, y: reduce ? 0 : 44, scale: 0.94 }}
            animate={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
          >
            <motion.div
              className="hero__portrait"
              data-od-id="hero-portrait"
              suppressHydrationWarning
              style={{ rotateY: tiltY }}
            >
              {/* headline badge */}
              <motion.div
                className="hero__accent"
                suppressHydrationWarning
                aria-hidden="true"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.85 }}
              />
              <motion.div
                className="hero__headline"
                suppressHydrationWarning
                aria-hidden="true"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 1.05 }}
              >
                Full-stack · React · Spring Boot
              </motion.div>

              <motion.div
                className="hero__visor"
                data-od-id="hero-portrait-looks"
                ref={visorRef}
                suppressHydrationWarning
                style={{ x: visorX, y: visorY }}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
              >
                {LOOK_ORDER.map((k) => {
                  const op = k === "left" ? leftOp : k === "right" ? rightOp : midOp;
                  return (
                    <motion.img
                      key={k}
                      src={heroPortraitTrio[k]}
                      alt={k === "middle" ? "Portrait of Bahaa Eddine Bouzid" : ""}
                      width={852}
                      height={1102}
                      aria-hidden={k !== "middle"}
                      suppressHydrationWarning
                      className={`hero__portrait-img hero__portrait-img--${k}`}
                      style={{ opacity: op }}
                    />
                  );
                })}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LinkArrow({
  href,
  label,
  dataOdId,
}: {
  href: string;
  label: string;
  dataOdId?: string;
}) {
  return (
    <a className="link" href={href} data-od-id={dataOdId}>
      {label}
      <span className="arr" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}