"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { projects, heroPortraitTrio } from "@/lib/data";
import { EASE } from "@/lib/motion";

type Look = keyof typeof heroPortraitTrio;

type TrailItem = {
  id: number;
  src: string;
  x: number;
  y: number;
  rot: number;
  scale: number;
  size: number;
};

const TRAIL_MAX = 10;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // parallax layers
  const yImg = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
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

  // cursor-follow portrait: the whole page tracks the mouse. The image
  // itself swaps instantly (no fade) to the frame matching the cursor
  // third, while the portrait drifts and tilts toward the cursor.
  const pointer = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const [look, setLook] = useState<Look>("middle");
  const tiltY = useSpring(
    useTransform(pointer, [-1, 1], [5, -5]),
    { stiffness: 130, damping: 18 },
  );
  const tiltX = useSpring(
    useTransform(pointerY, [-1, 1], [-3, 3]),
    { stiffness: 130, damping: 18 },
  );
  const driftX = useSpring(
    useTransform(pointer, [-1, 1], [16, -16]),
    { stiffness: 60, damping: 20 },
  );
  const driftY = useSpring(
    useTransform(pointerY, [-1, 1], [10, -10]),
    { stiffness: 60, damping: 20 },
  );

  // Hero-only inversion lens.
  const [lensOn, setLensOn] = useState(false);
  const lensX = useMotionValue(0);
  const lensY = useMotionValue(0);
  const lensSX = useSpring(lensX, { stiffness: 240, damping: 24, mass: 0.35 });
  const lensSY = useSpring(lensY, { stiffness: 240, damping: 24, mass: 0.35 });

  // Fading trail of project thumbnails following the cursor inside the hero.
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const spawn = useRef({ lastX: -9999, lastY: -9999, lastT: 0, nextId: 0 });

  function spawnTrail(clientX: number, clientY: number) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const s = spawn.current;
    const x = clientX - r.left;
    const y = clientY - r.top;
    const now = performance.now();
    if (Math.hypot(x - s.lastX, y - s.lastY) < 34 || now - s.lastT < 90) return;
    s.lastX = x;
    s.lastY = y;
    s.lastT = now;
    const src = projects[s.nextId % projects.length].image;
    const item: TrailItem = {
      id: s.nextId++,
      src,
      x,
      y,
      rot: (Math.random() - 0.5) * 36,
      scale: 0.9 + Math.random() * 0.25,
      size: Math.round(180 + Math.random() * 90),
    };
    setTrail((prev) => [...prev.slice(-(TRAIL_MAX - 1)), item]);
  }

  function onSectionMove(e: React.PointerEvent<HTMLElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    lensX.set(e.clientX - r.left);
    lensY.set(e.clientY - r.top);
    spawnTrail(e.clientX, e.clientY);
  }

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const nx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth - 0.5) * 2));
      const ny = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight - 0.5) * 2));
      pointer.set(nx);
      pointerY.set(ny);
      setLook(nx < -0.22 ? "left" : nx > 0.22 ? "right" : "middle");
    }
    function onLeave() {
      pointer.set(0);
      pointerY.set(0);
      setLook("middle");
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
    <section
      className="hero"
      ref={ref}
      id="home"
      data-od-id="hero"
      onPointerMove={onSectionMove}
      onPointerEnter={() => setLensOn(true)}
      onPointerLeave={() => setLensOn(false)}
    >
      <div className="container">
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
            style={{ rotateY: tiltY, rotateX: tiltX, x: driftX, y: driftY }}
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

            <div className="hero__visor">
              <img
                src={heroPortraitTrio[look]}
                alt="Portrait of Bahaa Eddine Bouzid"
                width={852}
                height={1102}
                suppressHydrationWarning
                className="hero__portrait-img"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="hero__trail" aria-hidden="true">
        {trail.map((t) => (
          <motion.div
            key={t.id}
            className="hero__trail-item"
            style={{
              left: t.x,
              top: t.y,
              width: t.size,
              height: t.size,
              marginLeft: -t.size / 2,
              marginTop: -t.size / 2,
            }}
            initial={{ opacity: 0, scale: t.scale * 0.45, x: 0, y: 0, rotate: t.rot }}
            animate={{
              opacity: [0, 0.92, 0.9, 0],
              scale: [t.scale * 0.45, t.scale, t.scale * 1.05, t.scale * 1.12],
              x: [0, 46, 104, 168],
              y: [0, -70, -150, -240],
              rotate: [t.rot, t.rot + 12, t.rot + 8, t.rot + 4],
            }}
            transition={{ duration: 1.7, ease: EASE, times: [0, 0.14, 0.52, 1] }}
            onAnimationComplete={() =>
              setTrail((prev) => prev.filter((p) => p.id !== t.id))
            }
          >
            <img src={t.src} alt="" />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="hover-lens"
        aria-hidden="true"
        style={{ left: lensSX, top: lensSY }}
        animate={{ opacity: lensOn ? 1 : 0, scale: lensOn ? 1 : 0.6 }}
        transition={{
          opacity: { duration: 0.22 },
          scale: { type: "spring", stiffness: 320, damping: 24 },
        }}
      />
    </section>
  );
}