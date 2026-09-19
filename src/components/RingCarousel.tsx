"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data";
import { projects } from "@/lib/data";
import { EASE } from "@/lib/motion";

const N = projects.length;
const STEP = (Math.PI * 2) / N;
const RING_CARD_RATIO = 0.68;

export function RingCarousel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const moved = useRef(0);
  const lastX = useRef(0);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const scrollSmooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
  });
  const spin = useMotionValue(0);
  const spinSmooth = useSpring(spin, { stiffness: 170, damping: 26, mass: 0.4 });

  // Magnetic ring: the stage tilts toward the cursor while it moves across
  // the carousel (spring-smoothed, zeroed on leave).
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const ringTiltY = useSpring(
    useTransform(cursorX, [-1, 1], [-7, 7]),
    { stiffness: 120, damping: 18 },
  );
  const ringTiltX = useSpring(
    useTransform(cursorY, [-1, 1], [6, -6]),
    { stiffness: 120, damping: 18 },
  );

  const onStageMove = (e: React.PointerEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    cursorX.set(
      Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)),
    );
    cursorY.set(
      Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)),
    );
  };

  const rot = useTransform(
    () => scrollSmooth.get() * Math.PI * 2 + spinSmooth.get()
  );

  useMotionValueEvent(rot, "change", (v) => {
    const phase = -v % (Math.PI * 2);
    const i = (((Math.round(phase / STEP) % N) + N) % N);
    setActive((prev) => (prev === i ? prev : i));
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const current = projects[active];

  const progressScale = useTransform(scrollYProgress, (v) => v);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = 0;
    lastX.current = e.clientX;
    setGrabbing(true);
  };

  useEffect(() => {
    if (!grabbing) return;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      moved.current += Math.abs(dx);
      spin.set(spin.get() + dx * 0.0042);
    };
    const onUp = () => {
      dragging.current = false;
      setGrabbing(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [grabbing, spin]);

  return (
    <div className="ring" ref={wrapRef} data-od-id="ring-carousel">
      <motion.div
        className={`ring__stage${grabbing ? " is-dragging" : ""}`}
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onStageMove}
        onPointerLeave={() => {
          cursorX.set(0);
          cursorY.set(0);
        }}
        style={{ rotateX: ringTiltX, rotateY: ringTiltY }}
        data-od-id="ring-stage"
      >
        {size.w > 0 &&
          projects.map((p, i) => (
            <RingCard
              key={p.slug}
              project={p}
              index={i}
              rot={rot}
              w={size.w}
              h={size.h}
              movedRef={moved}
            />
          ))}

        <motion.div
          className="ring__progress"
          style={{ scaleX: progressScale }}
          aria-hidden="true"
        />

        <div className="ring__display">
          <Link
            href={`/work/${current.slug}`}
            className="ring__open"
            aria-label={`Open ${current.title} case`}
            data-od-id={`ring-open-${current.slug}`}
            onClick={(e) => {
              if (moved.current > 6) e.preventDefault();
              moved.current = 0;
              setGrabbing(false);
            }}
            onDragStart={(e) => e.preventDefault()}
          >
            <motion.span
              key={current.slug}
              className="ring__thumb"
              style={{ aspectRatio: current.imageRatio }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <img src={current.image} alt={current.imageAlt} width={1200} height={800} />
            </motion.span>

            <span className="ring__meta" aria-hidden="true">
              <span className="ring__count">
                0{active + 1} / 0{N}
              </span>
              <span className="ring__title display">{current.title}</span>
              <span className="ring__sub text-muted">
                {current.category} · {current.year}
              </span>
              <span className="ring__cta">
                View Case
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
              </span>
            </span>
          </Link>

          <span className="ring__hint" aria-hidden="true">
            Scroll or drag to roll
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function RingCard({
  project,
  index,
  rot,
  w,
  h,
  movedRef,
}: {
  project: Project;
  index: number;
  rot: MotionValue<number>;
  w: number;
  h: number;
  movedRef: { current: number };
}) {
  const rx = Math.min(w * 0.4, 620);
  const ry = Math.min(h * 0.42, 240);
  const baseW = Math.min(Math.max(w * 0.18, 118), 250);
  const baseH = baseW * RING_CARD_RATIO;

  const angle = useTransform(rot, (v) => index * STEP + v);
  const sinA = useTransform(angle, Math.sin);
  const cosA = useTransform(angle, Math.cos);
  const x = useTransform(() => sinA.get() * rx);
  const y = useTransform(() => cosA.get() * ry);
  const depth = useTransform(cosA, (c) => (c + 1) * 0.5);
  const scale = useTransform(depth, (d) => 0.3 + 0.7 * d);
  const opacity = useTransform(depth, (d) => 0.18 + 0.82 * d);
  const z = useTransform(depth, (d) => Math.round(d * 20));
  const rotateY = useTransform(sinA, (s) => -s * 52);

  return (
    <motion.div
      className="ring__card"
      style={{
        width: baseW,
        height: baseH,
        marginLeft: -baseW / 2,
        marginTop: -baseH / 2,
        x,
        y,
        scale,
        opacity,
        rotateY,
        zIndex: z,
      }}
    >
      <Link
        href={`/work/${project.slug}`}
        aria-label={`Open ${project.title} case`}
        data-od-id={`ring-card-${project.slug}`}
        onClick={(e) => {
          if (movedRef.current > 6) e.preventDefault();
          movedRef.current = 0;
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        <img src={project.image} alt="" loading="lazy" width={600} height={400} />
      </Link>
    </motion.div>
  );
}