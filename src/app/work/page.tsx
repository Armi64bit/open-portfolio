import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Bahaa Eddine Bouzid — AI trading, product engineering, automation, and community platforms.",
};

export default function WorkPage() {
  return (
    <section className="section section--page" data-od-id="work">
      <div className="container">
        <Reveal>
          <span className="kicker">Portfolio</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="display display--section work__title">Work</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="section__lead">
            Selected projects, 2023 – 2026. Full-stack, frontend, and DevOps
            builds shipped from Tunis to remote teams.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <Link
            href="/work/creative"
            className="crea-cta"
            data-od-id="creative-cta"
          >
            <span className="crea-cta__icon" aria-hidden="true">
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
            <span className="crea-cta__body">
              <span className="crea-cta__kicker">Live · frame-locked</span>
              <span className="crea-cta__title">
                Creative
                <span className="crea-cta__arr" aria-hidden="true">
                  ↗
                </span>
              </span>
            </span>
          </Link>
        </Reveal>

        <ul className="work__list" data-od-id="work-list">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 0.04, 0.2)}>
              <li>
                <Link
                  href={`/work/${p.slug}`}
                  className="wrow"
                  data-od-id={`work-${p.slug}`}
                >
                  <span className="wrow__idx text-muted" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="wrow__media">
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      loading="lazy"
                      className="wrow__img"
                    />
                  </span>
                  <span className="wrow__body">
                    <span className="wrow__meta text-muted">
                      {p.category} · {p.year}
                    </span>
                    <span className="wrow__title display">{p.title}</span>
                    <span className="wrow__blurb text-muted">{p.blurb}</span>
                  </span>
                  <span className="wrow__arr" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}