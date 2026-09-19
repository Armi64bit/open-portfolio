"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { heroPortraitTrio } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { Magnetic } from "./Magnetic";

type Look = keyof typeof heroPortraitTrio;

const LOOK_ORDER: Look[] = ["left", "middle", "right"];

/** Opacity of the straight-on frame given cursor position v in [-1, 1]
 *  across the viewport. Left third -> left frame, right third -> right frame,
 *  with a narrow center band and soft blends at the boundaries. */
function midOpacity(v: number) {
  return 1 - Math.min(1, Math.max(0, (Math.abs(v) - 0.22) / 0.28));
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
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

  // cursor-follow portrait: the whole page tracks the mouse, not just the
  // image itself. Cursor in the left third of the viewport -> left-looking
  // frame, center third -> straight-on frame, right third -> right-looking
  // frame. The frames crossfade continuously and the portrait drifts and
  // tilts slightly toward the cursor wherever it is on the page.
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

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      pointer.set(Math.max(-1, Math.min(1, nx)));
      pointerY.set(Math.max(-1, Math.min(1, ny)));
    }
    function onLeave() {
      pointer.set(0);
      pointerY.set(0);
    }
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [pointer, pointerY]);

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
                suppressHydrationWarning
                style={{ x: visorX, y: visorY }}
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