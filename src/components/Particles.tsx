"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  vx: number;
  vy: number;
  swayA: number;
  swayF: number;
  swayP: number;
  twF: number;
  twP: number;
  red: boolean;
  rise: boolean;
};

const LINK_DIST = 88;
const CURSOR_R = 92;
const PUSH = 170;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cv = canvas;
    const ct = ctx;

    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let t = 0;
    let last = performance.now();
    let smoothScroll = window.scrollY;
    const cursor = { x: -9999, y: -9999 };

    const rootStyle = () => getComputedStyle(document.documentElement);
    let accent = rootStyle().getPropertyValue("--accent").trim() || "#e80000";
    let white = rootStyle().getPropertyValue("--fg").trim() || "#ffffff";
    let dark = document.documentElement.classList.contains("dark");

    function readTheme() {
      const rs = rootStyle();
      const nextAccent = rs.getPropertyValue("--accent").trim() || "#e80000";
      const nextFg = rs.getPropertyValue("--fg").trim() || "#ffffff";
      const nextDark = document.documentElement.classList.contains("dark");
      if (nextDark !== dark || nextFg !== white || nextAccent !== accent) {
        dark = nextDark;
        accent = nextAccent;
        white = nextFg;
      }
    }

    function build() {
      const count = Math.round(clamp((w * h) / 16500, 40, 140));
      particles = Array.from({ length: count }, () => {
        const rise = Math.random() < 0.24;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.7 + Math.random() * 1.9,
          alpha: 0.16 + Math.random() * 0.42,
          vx: (Math.random() - 0.5) * 5,
          vy: rise
            ? -(3 + Math.random() * 6)
            : (Math.random() - 0.5) * 4 + 1.2,
          swayA: 6 + Math.random() * 14,
          swayF: 0.15 + Math.random() * 0.5,
          swayP: Math.random() * Math.PI * 2,
          twF: 0.3 + Math.random() * 0.9,
          twP: Math.random() * Math.PI * 2,
          red: Math.random() < 0.42,
          rise,
        };
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ct.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      readTheme();
      smoothScroll += (window.scrollY - smoothScroll) * 0.055;
      const offY = smoothScroll * 0.12;
      const margin = 90;
      ct.globalCompositeOperation = dark ? "lighter" : "source-over";
      ct.clearRect(0, 0, w, h);

      const positions = new Float64Array(particles.length * 2);
      const alphas = new Float32Array(particles.length);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        // gentle repulsion: push away from the cursor within CURSOR_R
        const dxC = p.x - cursor.x;
        const dyC = p.y - cursor.y;
        const dC = Math.hypot(dxC, dyC);
        if (dC < CURSOR_R && dC > 0.001) {
          const wgt = (1 - dC / CURSOR_R) * PUSH * dt;
          p.x += (dxC / dC) * wgt;
          p.y += (dyC / dC) * wgt;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        const sway = Math.sin(t * p.swayF + p.swayP) * p.swayA;
        const tw = 0.72 + 0.28 * Math.sin(t * p.twF + p.twP);
        const px = p.x + sway;
        const py = ((p.y - offY + margin) % (h + margin * 2)) - margin;
        const alpha = p.alpha * tw;

        positions[i * 2] = px;
        positions[i * 2 + 1] = py;
        alphas[i] = alpha;

        if (alpha <= 0.02) continue;
        ct.globalAlpha = alpha;
        ct.fillStyle = p.red ? accent : white;
        ct.beginPath();
        ct.arc(px, py, p.r, 0, Math.PI * 2);
        ct.fill();
      }

      // constellation lines between nearby particles
      const lineMax = dark ? 0.22 : 0.16;
      const n = particles.length;
      for (let i = 0; i < n; i += 1) {
        if (alphas[i] <= 0.02) continue;
        for (let j = i + 1; j < n; j += 1) {
          if (alphas[j] <= 0.02) continue;
          const dx = positions[i * 2] - positions[j * 2];
          const dy = positions[i * 2 + 1] - positions[j * 2 + 1];
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const a = (1 - Math.sqrt(d2) / LINK_DIST) * lineMax;
          if (a <= 0.01) continue;
          ct.globalAlpha = a;
          ct.strokeStyle = white;
          ct.lineWidth = 1;
          ct.beginPath();
          ct.moveTo(positions[i * 2], positions[i * 2 + 1]);
          ct.lineTo(positions[j * 2], positions[j * 2 + 1]);
          ct.stroke();
        }
      }

      ct.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function onPointerMove(e: PointerEvent) {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    }

    function onPointerLeave() {
      cursor.x = -9999;
      cursor.y = -9999;
    }

    function onVisibility() {
      running = document.visibilityState === "visible";
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    }

    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerleave", onPointerLeave);
    const mo = new MutationObserver(() => readTheme());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />;
}