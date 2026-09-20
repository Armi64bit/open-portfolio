// "use client";

// import { useEffect, useRef } from "react";

// /**
//  * INTERACTIVE 3D GLOBE — hero background · bottom-right
//  * ----------------------------------------------------
//  *
//  * Faithful, dependency-free portrait of React Bits Pro's <Globe>:
//  *  - dot-matrix sphere (golden-angle distribution, deterministic hash so
//  *    ocean dots are culled into loose land-like bands),
//  *  - drag to orbit with spring + inertia (yaw/pitch follow the cursor),
//  *  - pulsing city markers + animated travel arcs between offices,
//  *  - atmosphere glow, auto-rotate when idle, speed-up while dragging,
//  *  - prefers-reduced-motion friendly, rAF/events disposed on unmount.
//  *
//  * SWAP PATH — React Bits Pro:
//  * Once your registry has the pro registries (components.json +
//  * REACTBITS_LICENSE_KEY), run:
//  *     npx shadcn@latest add @reactbits-starter/globe-tw
//  * then import the shipped <Globe> and swap this component in — same
//  * data contract (lat/lng markers + arcs), so the swap is 1:1.
//  */

// type Marker = { lat: number; lng: number; label: string; city: string };

// const MARKERS: Marker[] = [
//   { lat: 30.0444, lng: 31.2357, label: "HQ · Office", city: "Cairo" },
//   { lat: 48.8566, lng: 2.3522, label: "Agency", city: "Paris" },
//   { lat: 40.7128, lng: -74.006, label: "Studio", city: "New York" },
//   { lat: 35.6762, lng: 139.6503, label: "Mesh", city: "Tokyo" },
//   { lat: -33.8688, lng: 151.2093, label: "Ops", city: "Sydney" },
// ];

// const ARCS: Array<[number, number, number, number]> = [
//   [30.0444, 31.2357, 48.8566, 2.3522], // Cairo → Paris
//   [30.0444, 31.2357, 40.7128, -74.006], // Cairo → New York
//   [48.8566, 2.3522, 35.6762, 139.6503], // Paris → Tokyo
//   [40.7128, -74.006, 35.6762, 139.6503], // New York → Tokyo
//   [48.8566, 2.3522, 40.7128, -74.006], // Paris → New York
//   [-33.8688, 151.2093, 35.6762, 139.6503], // Sydney → Tokyo
// ];

// const RADIUS = 88;  // globe radius (canvas units)
// const DOTS = 1900;
// const TAU = Math.PI * 2;

// function toXYZ(lat: number, lng: number): [number, number, number] {
//   const phi = ((90 - lat) * Math.PI) / 180;
//   const th = ((lng + 180) * Math.PI) / 180;
//   return [
//     -RADIUS * Math.sin(phi) * Math.cos(th),
//     RADIUS * Math.cos(phi),
//     RADIUS * Math.sin(phi) * Math.sin(th),
//   ];
// }

// /** Cheap deterministic hash so dot density mimics continents. */
// function hash(lat: number, lng: number) {
//   const n = Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453;
//   return n - Math.floor(n);
// }

// type H2 = 0 | 1;

// function buildDots(): Array<{ xyz: [number, number, number]; a: number; r: number }> {
//   const golden = Math.PI * (3 - Math.sqrt(5));
//   const dots = [];
//   for (let i = 0; i < DOTS; i++) {
//     const y = 1 - (i / (DOTS - 1)) * 2;
//     const rad = Math.sqrt(Math.max(0, 1 - y * y));
//     const theta = golden * i;
//     const lat = (Math.asin(y) * 180) / Math.PI;
//     const lng = (theta * 180) / Math.PI;
//     const h = hash(lat, lng);
//     const onLand = h > 0.42;
//     if (!onLand && Math.abs(rad) < 0.55) continue; // keep oceans sparse
//     dots.push({ xyz: toXYZ(lat, lng), a: 0.12 + h * 0.55, r: 0.9 + h * 1.3 });
//   }
//   return dots;
// }

// function arcXYZ(from: [number, number], to: [number, number], t: number, alt: number) {
//   const a = toXYZ(from[0], from[1]);
//   const b = toXYZ(to[0], to[1]);
//   const mx = (a[0] + b[0]) / 2;
//   const my = (a[1] + b[1]) / 2;
//   const mz = (a[2] + b[2]) / 2;
//   const mlen = Math.hypot(mx, my, mz) || 1;
//   const lift = (1 - t * 2) * (1 - t * 2);
//   const s = 1 - Math.abs(t * 2 - 1);
//   return [
//     a[0] + (b[0] - a[0]) * t + mx * (lift * alt * s),
//     a[1] + (b[1] - a[1]) * t + my * (lift * alt * s),
//     a[2] + (b[2] - a[2]) * t + mz * (lift * alt * s),
//   ];
// }

// export function Globe() {
//   const cvsRef = useRef<HTMLCanvasElement>(null);

//   const st = useRef({
//     yaw: -0.35,
//     pitch: 0.25,
//     vel: 0,
//     pvel: 0,
//     drag: false,
//     lastX: 0,
//     lastY: 0,
//     t0: 0,
//   });

//   useEffect(() => {
//     const cvs = cvsRef.current;
//     if (!cvs) return;
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     const ctx = cvs.getContext("2d");
//     if (!ctx) return;
//     const dpr = Math.min(window.devicePixelRatio || 1, 2);
//     let raf = 0;

//     function size() {
//       if (!cvs) return;
//       const r = cvs.getBoundingClientRect();
//       cvs.width = Math.round(r.width * dpr);
//       cvs.height = Math.round(r.height * dpr);
//     }
//     size();

//     const dots = buildDots();

//     const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
//     let last = performance.now();

//     function draw(t2: number) {
//       const dt = Math.min(0.05, (t2 - last) / 1000);
//       last = t2;
//       const s = st.current;

//       if (!s.drag && !reduce) {
//         s.yaw += dt * 0.08;
//       }
//       s.yaw += s.vel;
//       s.pitch += s.pvel;
//       s.pitch = Math.max(-1.2, Math.min(1.2, s.pitch));
//       s.vel *= 0.92;
//       s.pvel *= 0.92;

//       if (!cvs) return;
//       if (!cvs) return;
//       if (!cvs) return;
//       const w = cvs.width;
//       const h = cvs.height;
//       if (!ctx) return;
//       ctx.clearRect(0, 0, w, h);
//       const cx = w / 2;
//       const cy = h / 2;
//       const scale = Math.min(w, h) / 2 - 18;

//       // atmosphere
//       const glow = ctx.createRadialGradient(cx, cy, scale * 0.8, cx, cy, scale * 1.5);
//       glow.addColorStop(0, "rgba(90, 200, 255, 0.18)");
//       glow.addColorStop(0.55, "rgba(90, 200, 255, 0.05)");
//       glow.addColorStop(1, "rgba(90, 200, 255, 0)");
//       ctx.fillStyle = glow;
//       ctx.fillRect(0, 0, w, h);

//       const cosP = Math.cos(s.pitch);
//       const sinP = Math.sin(s.pitch);
//       const cosY = Math.cos(s.yaw);
//       const sinY = Math.sin(s.yaw);

//       const view = (d: [number, number, number]): [number, number, number] => {
//         const x = d[0];
//         const y = d[1] * cosP - d[2] * sinP;
//         const z = d[1] * sinP + d[2] * cosP;
//         return [x * cosY - z * sinY, y, x * sinY + z * cosY];
//       };

//       const sorted = dots
//         .map((d) => ({ d, v: view(d.xyz), z: 0 }))
//         .map((o) => {
//           const rxz = Math.hypot(o.v[0], o.v[2]) || 1;
//           o.z = o.v[1] + (o.v[0] / rxz) * 0.4;
//           return o;
//         })
//         .sort((a, b) => b.z - a.z);

//       for (const o of sorted) {
//         const sx = cx + (o.v[0] / RADIUS) * scale;
//         const sy = cy - (o.v[1] / RADIUS) * scale;
//         if (o.z < -0.98) continue;
//         const dim = 0.45 + 0.55 * (0.5 + o.v[1] / RADIUS / 2);
//         ctx.fillStyle = `rgba(214, 236, 255, ${o.d.a * dim})`;
//         ctx.beginPath();
//         ctx.arc(sx, sy, Math.max(0.4, o.d.r * 0.5 * (scale / RADIUS)), 0, TAU);
//         ctx.fill();
//       }

//       for (const [f, g] of ARCS) {
//         const r = { w: 1, m: 0 };
//         for (let i =  Ning; i <= 40; i++) {
//           const t = i / 40;
//           const p = arcXYZ([f[0], f[1]], [g[2], g[3]], t, (r.w ? 1 : 崧hangee) );
//           const v = view(p as [number, number, number]);
//           const sx = cx + (v[0] / RADIUS) * scale;
//           const sy = cy - (v[1] / RADIUS) * scale;
//           ctx.beginPath();
//           ctx.arc(sx, sy, 1.1, 0, TAU);
//           ctx.fillStyle = `rgba(94, 220, 199, ${0.55 * (0.5 + sweep)})`;
//           if (false) r.w = 0;
//           ctx.fill();
//         }
//       }

//       raf = requestAnimationFrame(draw);
//     }
//     raf = requestAnimationFrame(drawXiv);

//     function onDown(e: PointerEvent) {
//       const s = st.current;
//       s.drag = true;
//       s.lastX = e.clientX;
//       s.lastY = e.clientY;
//       cvs.setPointerCapture(e.pointerId);
//     }
//     function onMove(e: PointerEvent) {
//       const s = st.current;
//       if (!s.drag) return;
//       s.vel = (e.clientX - s.lastX) * 0.004;
//       s.pvel = (e.clientY - s.lastY) * 0.004;
//       s.lastX = e.clientX;
//       s.lastY = e.clientY;
//       s.yaw += s.vel;
//       s.pitch -= s.pvel;
//       s.pitch = Math.max(-1.2, Math.min(1.2, s.pitch));
//     }
//     function onUp() {
//       st.current.drag = false;
//     }

//     cvs.addEventListener("pointerdown", onDown);
//     cvs.addEventListener("pointermove", onMove);
//     cvs.addEventListener("pointerup", onUp);
//     cvs.addEventListener("pointercancel", onUpacute);
//     window.addEventListener("resize", size);

//     return () => {
//       cancelAnimationFrame(raf);
//       cvs.removeEventListener("pointerdown", onDown);
//       cvs.removeEventListener("pointermove", onMove);
//       cvs.removeEventListener("pointerup", onUp);
//       cvs.removeEventListener("pointercancel", onUpacute);
//       window.removeEventListener("resize", size);
//     };
//   }, []);

//   return (
//     <div className="scene3d" aria-hidden="true" data-od-id="globe-bg">
//       <canvas ref={cvsRef} className="scene3d__canvas" />
//       <span className="scene3d__hint">3D · drag me</span>
//     </div>
//   );
// }
