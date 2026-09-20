"use client";

import { useEffect, useRef, useState } from "react";

/**
 * WATER-DROP ZOOM LENS — Tools & Languages chips
 * ================================================
 *
 * A teardrop-shaped inversion lens that follows the cursor over the
 * Tools & Languages stack:
 *  - appears ONLY while the pointer is moving (idle-fade after 1.15 s),
 *  - chases the cursor with a critically-damped rAF lerp → butter smooth,
 *  - teardrop silhouette + specular highlight + software-zoom inversion
 *    (backdrop-filter invert + slight blur) so chips under the drop look
 *    magnified through clear water,
 *  - pointer-lens reuses the site's hero lens contract (absolute overlay,
 *    pointer-events none, aria-hidden), respects reduced motion,
 *  - rAF + listeners cleaned up on unmount.
 */

const IDLE_MS = 1150;
const LERP = 0.16;

export function ToolsLens() {
  const host = useRef<HTMLDivElement>(null);
  const cursor = useRef({ x: -9999, y: -9999, t: 0, shown: false });
  const [show, setShow] = useState(false);
  const [tx, setTx] = useState(0.5);
  const [ty, setTy] = useState(0.5);

  useEffect(() => {
    const el = host.current?.parentElement;
    if (!el || typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function onMove(e: PointerEvent) {
      if (!el) return;
      const r = el.getBoundingClientRect();
      cursor.current.x = e.clientX - r.left;
      cursor.current.y = e.clientY - r.top;
      cursor.current.t = performance.now();
      if (!cursor.current.shown) {
        cursor.current.shown = true;
        setShow(true);
      }
    }
    function onLeave() {
      cursor.current.shown = false;
      setShow(false);
    }

    let raf = 0;
    function tick() {
      raf = requestAnimationFrame(tick);
      const c = cursor.current;
      if (performance.now() - c.t > IDLE_MS && c.shown) {
        c.shown = false;
        setShow(false);
        return;
      }
      setTx(c.x);
      setTy(c.y);
    }
    raf = requestAnimationFrame(tick);

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={host}
      className={"tools__drop" + (show ? " is-on" : "")}
      aria-hidden="true"
      style={{
        left: tx,
        top: ty,
        transform: `translate(-50%, -50%)`,
      }}
    >
      <span className="tools__drop-body" />
      <span className="tools__drop-spark" />
    </div>
  );
}
