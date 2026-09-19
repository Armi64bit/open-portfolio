"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data";
import { featuredProjects } from "@/lib/data";
import { Reveal } from "./Reveal";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.1}>
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

        <div className="pcard__grid">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
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
      style={{ aspectRatio: project.imageRatio }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src={project.image}
        alt={project.imageAlt}
        loading={priority ? "eager" : "lazy"}
        className="phero__img"
      />
    </motion.div>
  );
}