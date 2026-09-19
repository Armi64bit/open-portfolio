"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { heroPortrait } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);

  const word = "BAHAA";

  return (
    <section className="hero" ref={ref} id="home" data-od-id="hero">
      <div className="container">
        <h1 className="display display--hero hero__title" aria-label={word}>
          {word.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="hero__letter"
              aria-hidden="true"
              initial={{ y: reduce ? 0 : "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.06 * i + 0.15 }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <div className="hero__grid">
          <motion.div
            className="hero__lede-wrap"
            style={{ y: yText }}
          >
            <motion.p
              className="hero__lede"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            >
              I&apos;m Bahaa Eddine Bouzid — a full-stack engineer building
              dependable web products, real-time systems, and cloud-ready
              platforms.
            </motion.p>

            <motion.div
              className="hero__meta-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <LinkArrow href="/#contact" label="Let's Talk" dataOdId="hero-cta" />
              <span className="hero__meta text-muted">
                Tunis, Tunisia · Open to opportunities
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__portrait-wrap"
            style={{ y: yImg }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.35 }}
          >
            <div className="hero__portrait" data-od-id="hero-portrait">
              <div className="hero__portrait-accent" aria-hidden="true" />
              <img
                src={heroPortrait}
                alt="Portrait of Bahaa Eddine Bouzid"
                width={852}
                height={1102}
                className="hero__portrait-img"
              />
            </div>
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