"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { aboutPortrait, blogUrl, services, stackGroups } from "@/lib/data";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { DiCss3, DiJava } from "react-icons/di";
import {
  SiAngular,
  SiApachemaven,
  SiCplusplus,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGithubactions,
  SiGooglegemini,
  SiGrafana,
  SiHtml5,
  SiJavascript,
  SiJenkins,
  SiJest,
  SiJunit5,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiPrometheus,
  SiPython,
  SiReact,
  SiSpringboot,
  SiSymfony,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

const TOOL_ICONS: Record<string, IconType> = {
  java: DiJava,
  css3: DiCss3,
  angular: SiAngular,
  cplusplus: SiCplusplus,
  django: SiDjango,
  docker: SiDocker,
  fastapi: SiFastapi,
  firebase: SiFirebase,
  flutter: SiFlutter,
  git: SiGit,
  githubactions: SiGithubactions,
  gemini: SiGooglegemini,
  grafana: SiGrafana,
  html5: SiHtml5,
  javascript: SiJavascript,
  jenkins: SiJenkins,
  jest: SiJest,
  junit: SiJunit5,
  laravel: SiLaravel,
  maven: SiApachemaven,
  mongodb: SiMongodb,
  mysql: SiMysql,
  nestjs: SiNestjs,
  nodedotjs: SiNodedotjs,
  prometheus: SiPrometheus,
  python: SiPython,
  react: SiReact,
  springboot: SiSpringboot,
  symfony: SiSymfony,
  tailwind: SiTailwindcss,
  typescript: SiTypescript,
};

export function AboutSection() {
  return (
    <section className="section" id="about" data-od-id="about">
      <div className="container">
        <div className="about__grid">
          <Reveal>
            <span className="kicker">About Me</span>
          </Reveal>

          <div className="about__body">
            <Reveal>
              <p className="section__lead about__lead">
                I build end-to-end software with React, TypeScript, Spring
                Boot, and modern cloud tooling — from polished interfaces to
                resilient APIs and delivery pipelines. I care about clean
                structure, meaningful motion, and code that stays easy to
                change.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="about__actions">
                <Magnetic>
                  <Link href="/cv" className="link" data-od-id="view-resume">
                    View Résumé
                    <span className="arr" aria-hidden="true">
                      ↗
                    </span>
                  </Link>
                </Magnetic>
                <Magnetic>
                  <a
                    href={blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                    data-od-id="read-blog"
                  >
                    Read the Blog
                    <span className="arr" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <motion.div
              className="about__portrait"
              suppressHydrationWarning
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.015 }}
            >
              <img
                src={aboutPortrait}
                alt="Working portrait of Bahaa Eddine Bouzid"
                loading="lazy"
                width={823}
                height={1132}
              />
            </motion.div>
          </Reveal>
        </div>

        <div className="services" data-od-id="services">
          <Reveal>
            <span className="kicker">Services</span>
          </Reveal>

          <div className="services__grid">
            {services.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06}>
                <article className="service">
                  <div className="service__num" aria-hidden="true">
                    {s.n}
                  </div>
                  <h3 className="service__title display">{s.title}</h3>
                  <p className="service__desc text-muted">{s.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="tools" data-od-id="tools">
          <Reveal>
            <span className="kicker">Tools &amp; Languages</span>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="tools__stack">
              {stackGroups.map((g) => (
                <div className="tools__line" key={g.label}>
                  <span className="tools__group">{g.label}</span>
                  <div className="tools__chips">
                    {g.items.map((t) => {
                      const Icon = TOOL_ICONS[t.icon];
                      return (
                        <div className="tools__chip" key={t.label} title={t.label}>
                          <span
                            className="tools__ic"
                            style={{ color: t.color }}
                            aria-hidden="true"
                          >
                            {Icon ? <Icon size={16} /> : null}
                          </span>
                          <span className="tools__label">{t.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}