"use client";

import Link from "next/link";
import { aboutPortrait, clientLogos, services } from "@/lib/data";
import { Reveal } from "./Reveal";

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
              <Link href="/cv" className="link" data-od-id="view-resume">
                View Résumé
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="about__portrait">
              <img
                src={aboutPortrait}
                alt="Working portrait of Bahaa Eddine Bouzid"
                loading="lazy"
                width={823}
                height={1132}
              />
            </div>
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

        <div className="clients" data-od-id="clients">
          <Reveal>
            <span className="kicker">Clients</span>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="marquee">
              <div className="marquee__track">
                {[...clientLogos, ...clientLogos].map((src, i) => (
                  <div className="marquee__item" key={i} aria-hidden={i >= clientLogos.length}>
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      width={120}
                      height={100}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}