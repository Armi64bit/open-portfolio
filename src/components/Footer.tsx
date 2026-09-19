"use client";

import { useEffect, useState } from "react";
import { blogUrl } from "@/lib/data";

export function Footer() {
  return (
    <footer className="footer" data-od-id="footer">
      <hr className="rule" />
      <div className="container footer__inner">
        <a
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="footer__blog"
          data-od-id="blog-link"
        >
          Blog <span className="arr">↗</span>
        </a>
        <LiveClock />
        <span className="chip">
          <span className="dot" aria-hidden="true" />
          Open to opportunities
        </span>
      </div>
    </footer>
  );
}

function LiveClock() {
  const [time, setTime] = useState<string>("");
  const [meridiem, setMeridiem] = useState<string>("");

  useEffect(() => {
    function tick() {
      const d = new Date();
      let h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, "0");
      const s = String(d.getSeconds()).padStart(2, "0");
      const ap = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setTime(`${String(h).padStart(2, "0")}:${m}:${s}`);
      setMeridiem(ap);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="footer__clock text-muted" data-od-id="clock" aria-label="Current time">
      {time}
      <span className="footer__ap">{meridiem}</span>
    </span>
  );
}