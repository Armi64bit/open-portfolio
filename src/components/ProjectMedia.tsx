"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data";

const SLIDE_DURATION = 4500;

export function ProjectMedia({ project }: { project: Project }) {
  const gallery = project.gallery ?? [];
  const [active, setActive] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const progressRef = useRef(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (gallery.length < 2 || isInteracting) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % gallery.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [gallery.length, isInteracting]);

  useEffect(() => {
    progressRef.current = 0;
    setProgress(0);
    setImageLoaded(false);
  }, [active]);

  useEffect(() => {
    if (imageRef.current?.complete) setImageLoaded(true);
  }, [active, gallery]);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 1) {
      setVideoLoaded(true);
    }
  }, [project.videoUrl]);

  useEffect(() => {
    if (gallery.length < 2) return;
    const nextImage = new Image();
    nextImage.src = gallery[(active + 1) % gallery.length].src;
  }, [active, gallery]);

  useEffect(() => {
    if (gallery.length < 2 || isInteracting) return;

    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      progressRef.current = Math.min(
        1,
        progressRef.current + (now - last) / SLIDE_DURATION,
      );
      last = now;
      setProgress(progressRef.current);
    }, 40);

    return () => window.clearInterval(timer);
  }, [active, gallery.length, isInteracting]);

  if (!gallery.length && !project.repoUrl) return null;

  const current = gallery[active];

  return (
    <section className="project-media" aria-label={`${project.title} showcase`}>
      {project.videoUrl ? (
        <div className="project-media__video">
          <div className="project-media__video-copy">
            <span className="kicker">Video showcase</span>
            <h2 className="wd__h2 display">See Tunisia Jobs in motion</h2>
            <p className="text-muted">
              Explore the dashboard workflow, matching tools, and scraping pipeline in the project walkthrough.
            </p>
          </div>
          <div className="project-media__player-wrap">
            <span className="project-media__player-label">Project walkthrough</span>
            {!videoLoaded ? (
              <span className="project-media__loader project-media__loader--video" role="status" aria-label="Loading video" />
            ) : null}
            <video
              className="project-media__player"
              src={project.videoUrl}
              ref={videoRef}
              poster="/TunisiaJobs/overview1.png"
              controls
              playsInline
              preload="metadata"
              onLoadedMetadata={() => setVideoLoaded(true)}
              onCanPlay={() => setVideoLoaded(true)}
              onError={() => setVideoLoaded(true)}
            />
          </div>
        </div>
      ) : null}

      {gallery.length > 0 && current ? (
        <div
          className="project-media__gallery"
          onPointerEnter={() => setIsInteracting(true)}
          onPointerLeave={() => setIsInteracting(false)}
          onFocus={() => setIsInteracting(true)}
          onBlur={() => setIsInteracting(false)}
        >
          <div className="project-media__head">
            <div>
              <span className="kicker">Screenshots</span>
              <h2 className="wd__h2 display">Inside the build</h2>
            </div>
            <span className="project-media__count text-muted">
              {String(active + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
            </span>
          </div>
          <div className="project-media__frame">
            {!imageLoaded ? (
              <span className="project-media__loader" role="status" aria-label="Loading screenshot" />
            ) : null}
            <img
              key={current.src}
              ref={imageRef}
              src={current.src}
              alt={current.alt}
              className={`project-media__img${imageLoaded ? " is-loaded" : ""}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </div>
          <div className="project-media__progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="project-media__controls">
            <button
              type="button"
              className="project-media__button"
              onClick={() => setActive((active - 1 + gallery.length) % gallery.length)}
              aria-label="Previous screenshot"
            >
              ←
            </button>
            <div className="project-media__dots" aria-label="Choose screenshot">
              {gallery.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  className={`project-media__dot${index === active ? " is-active" : ""}`}
                  onClick={() => setActive(index)}
                  aria-label={`Show screenshot ${index + 1}`}
                  aria-current={index === active}
                />
              ))}
            </div>
            <button
              type="button"
              className="project-media__button"
              onClick={() => setActive((active + 1) % gallery.length)}
              aria-label="Next screenshot"
            >
              →
            </button>
          </div>
        </div>
      ) : null}

    </section>
  );
}