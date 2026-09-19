"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data";
import { EASE, EASE_SPRING } from "@/lib/motion";
import { Reveal } from "./Reveal";
import { RingCarousel } from "./RingCarousel";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.08}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={EASE_SPRING}
        suppressHydrationWarning
        className="pcard__lift"
      >
        <Link
          href={`/work/${project.slug}`}
          className="pcard"
          data-od-id={`project-${project.slug}`}
        >
          <div className="pcard__media" style={{ aspectRatio: project.imageRatio }}>
            <img
              src={project.image}
              alt={project.imageAlt}
              loading="lazy"
              width={1200}
              height={800}
              className="pcard__img"
            />
            <span className="pcard__sweep" aria-hidden="true" />
            <span className="pcard__view" aria-hidden="true">
              View project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17 17 7M17 7v8m0-8H9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="pcard__zoom" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17 17 7M17 7v8m0-8H9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div className="pcard__meta text-muted">
            <span>{project.category}</span>
            <span className="pcard__year">{project.year}</span>
          </div>
          <div className="pcard__row">
            <h3 className="pcard__title display">{project.title}</h3>
            <span className="arr" aria-hidden="true">
              ↗
            </span>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  );
}

export function ProjectsSection() {
  return (
    <section className="section" id="projects" data-od-id="selected-projects">
      <div className="container">
        <div className="section__head">
          <Reveal>
            <span className="kicker">Selected Projects</span>
          </Reveal>
          <Reveal delay={0.08}>
            <Link href="/work" className="link" data-od-id="view-all-projects">
              View All
              <span className="arr" aria-hidden="true">
                ↗
              </span>
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <p className="section__lead">
            Six hands-on projects spanning AI trading, product engineering,
            automation, and community platforms.
          </p>
        </Reveal>

        <RingCarousel />
      </div>
    </section>
  );
}

export function ProjectHeroImage({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <motion.div
      className="phero"
      suppressHydrationWarning
      style={{ aspectRatio: project.imageRatio, perspective: 1000 }}
      initial={{ opacity: 0, scale: 0.96, y: 28, rotateX: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.95, ease: EASE }}
    >
      <motion.img
        src={project.image}
        alt={project.imageAlt}
        loading={priority ? "eager" : "lazy"}
        suppressHydrationWarning
        className="phero__img"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
      />
    </motion.div>
  );
}