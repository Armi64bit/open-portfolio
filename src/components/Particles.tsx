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
  accent: boolean;
};

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

    const rootStyle = () => getComputedStyle(document.documentElement);
    let fg = rootStyle().getPropertyValue("--fg-strong").trim() || "#ffffff";
    let accent = rootStyle().getPropertyValue("--accent").trim() || "#e80000";
    let dark = document.documentElement.classList.contains("dark");

    function readTheme() {
      const rs = rootStyle();
      const nextFg = rs.getPropertyValue("--fg-strong").trim() || "#ffffff";
      const nextAccent = rs.getPropertyValue("--accent").trim() || "#e80000";
      const nextDark = document.documentElement.classList.contains("dark");
      if (nextDark !== dark || nextFg !== fg || nextAccent !== accent) {
        dark = nextDark;
        fg = nextFg;
        accent = nextAccent;
      }
    }

    function build() {
      const count = Math.round(clamp((w * h) / 15000, 42, 150));
      particles = Array.from({ length: count }, () => {
        const accentPick = Math.random() < 0.07;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: accentPick ? 1.2 + Math.random() * 1.6 : 0.6 + Math.random() * 1.8,
          alpha: accentPick ? 0.35 + Math.random() * 0.3 : 0.12 + Math.random() * 0.35,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 4 + 1.2,
          swayA: 6 + Math.random() * 14,
          swayF: 0.15 + Math.random() * 0.5,
          swayP: Math.random() * Math.PI * 2,
          twF: 0.3 + Math.random() * 0.9,
          twP: Math.random() * Math.PI * 2,
          accent: accentPick,
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

      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        const sway = Math.sin(t * p.swayF + p.swayP) * p.swayA;
        const tw = 0.72 + 0.28 * Math.sin(t * p.twF + p.twP);
        let px = p.x + sway;
        let py = ((p.y - offY + margin) % (h + margin * 2)) - margin;

        const alpha = p.alpha * tw;
        if (alpha <= 0.02) continue;
        ct.globalAlpha = alpha;
        ct.fillStyle = p.accent ? accent : fg;
        ct.beginPath();
        ct.arc(px, py, p.r, 0, Math.PI * 2);
        ct.fill();
      }
      ct.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
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
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />;
}