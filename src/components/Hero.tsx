"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { heroPortraitTrio } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { Magnetic } from "./Magnetic";

type Look = keyof typeof heroPortraitTrio;

const LOOK_ORDER: Look[] = ["left", "middle", "right"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [look, setLook] = useState<Look>("middle");
  const lookRef = useRef<Look>("middle");
  const pointerX = useMotionValue(0.5);

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

  // the portrait turns to follow the cursor: pointer left third -> looks
  // left, right third -> looks right, center -> facing straight ahead.
  const tiltY = useSpring(
    useTransform(pointerX, [0, 1], reduce ? [0, 0] : [7, -7]),
    { stiffness: 130, damping: 18 },
  );

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    pointerX.set(rel);
    const next: Look = rel < 0.35 ? "left" : rel > 0.65 ? "right" : "middle";
    if (next !== lookRef.current) {
      lookRef.current = next;
      setLook(next);
    }
  }

  function onPointerLeave() {
    if (reduce) return;
    pointerX.set(0.5);
    lookRef.current = "middle";
    setLook("middle");
  }

  useMotionValueEvent(pointerX, "change", (v) => {
    if (reduce) return;
    const next: Look = v < 0.35 ? "left" : v > 0.65 ? "right" : "middle";
    if (next !== lookRef.current) {
      lookRef.current = next;
      setLook(next);
    }
  });

  const word = "BAHAA";

  return (
    <section
      className="hero"
      ref={ref}
      id="home"
      data-od-id="hero"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="container" style={{ perspective: 1200 }}>
        <motion.h1
          className="display display--hero hero__title"
          style={{ y: yTitle, rotate: rotateTitle, opacity: fadeTitle }}
          aria-label={word}
        >
          {word.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="hero__letter"
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
            style={{ y: yImg }}
            initial={{ opacity: 0, rotateY: 14, rotateX: 10, y: reduce ? 0 : 44, scale: 0.94 }}
            animate={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
          >
            <motion.div
              className="hero__portrait"
              data-od-id="hero-portrait"
              style={{ rotateY: tiltY }}
            >
              {/* headline badge */}
              <motion.div
                className="hero__accent"
                aria-hidden="true"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.85 }}
              />
              <motion.div
                className="hero__headline"
                aria-hidden="true"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 1.05 }}
              >
                Full-stack · React · Spring Boot
              </motion.div>

              <div className="hero__visor" data-od-id="hero-portrait-looks">
                {LOOK_ORDER.map((k) => (
                  <img
                    key={k}
                    src={heroPortraitTrio[k]}
                    alt={k === "middle" ? "Portrait of Bahaa Eddine Bouzid" : ""}
                    width={852}
                    height={1102}
                    aria-hidden={k !== "middle"}
                    className={`hero__portrait-img hero__portrait-img--${k}${look === k ? " is-active" : ""}`}
                  />
                ))}
              </div>
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