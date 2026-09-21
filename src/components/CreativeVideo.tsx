"use client";

import { useRef } from "react";
import type { CreativePiece } from "@/lib/creative";

export default function CreativeVideo({ piece }: { piece: CreativePiece }) {
  const ref = useRef<HTMLVideoElement>(null);

  function hover() {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.volume = 0.9;
    const t = v.play();
    if (t) t.catch(() => {});
  }

  function leave() {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.volume = 1;
  }

  return (
    <div
      className="cvwrap"
      data-od-id="cvwrap"
      onMouseEnter={hover}
      onMouseLeave={leave}
    >
      <video
        ref={ref}
        src={piece.video}
        poster={piece.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="cvwrap__video"
      />
      <span className="cvwrap__badge text-muted" aria-hidden="true">
        Sound on hover
      </span>
    </div>
  );
}

