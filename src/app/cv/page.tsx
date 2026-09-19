import type { Metadata } from "next";
import { cv } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { CvActions } from "@/components/CvActions";

export const metadata: Metadata = {
  title: "CV — Bahaa Eddine Bouzid",
  description:
    "Résumé of Bahaa Eddine Bouzid: full-stack engineer experienced with React, TypeScript, Spring Boot, and modern cloud deployment.",
};

export default function CvPage() {
  return (
    <section className="section section--page" data-od-id="cv">
      <div className="container">
        <Reveal>
          <span className="kicker">Résumé</span>
        </Reveal>

        <header className="cv__head" data-od-id="cv-head">
          <Reveal delay={0.05}>
            <h1 className="display display--section cv__name">{cv.initials}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="cv__role">
              Full-stack Engineer — {cv.location}
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <ul className="cv__contact">
              <li className="chip">{cv.email}</li>
              <li className="chip">{cv.phone}</li>
              {cv.sites.map((s) => (
                <li key={s.url} className="chip">
                  <a href={s.url} target="_blank" rel="noreferrer" data-od-id="cv-site">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="cv__actions-row">
              <CvActions />
              <span className="text-muted cv__hint">
                The site-wide theme toggle in the nav switches this résumé
                between light and dark print styles.
              </span>
            </div>
          </Reveal>
        </header>

        <div className="cv__summary" data-od-id="cv-summary">
          <Reveal>
            <h2 className="cv__h2 display">Summary</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="cv__p">{cv.summary}</p>
          </Reveal>
        </div>

        <div className="cv__grid">
          <div className="cv__main">
            <section className="cv__block" data-od-id="cv-experience">
              <Reveal>
                <h2 className="cv__h2 display">Experience</h2>
              </Reveal>
              <ol className="cv__timeline">
                {cv.experience.map((job, i) => (
                  <Reveal as="li" key={`${job.company}-${i}`} delay={i * 0.04}>
                    <article className="cv__job">
                      <div className="cv__job-head">
                        <h3>{job.role}</h3>
                        <span className="cv__company">{job.company}</span>
                        <span className="cv__period text-muted">
                          {job.period} · {job.location}
                        </span>
                      </div>
                      <ul className="cv__bullets">
                        {job.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                ))}
              </ol>
            </section>

            <section className="cv__block" data-od-id="cv-projects">
              <Reveal>
                <h2 className="cv__h2 display">Projects</h2>
              </Reveal>
              <ul className="cv__projects">
                {cv.projects.map((p, i) => (
                  <Reveal as="li" key={p.title} delay={i * 0.04}>
                    <div className="cv__proj">
                      <div>
                        <h3>{p.title}</h3>
                        <span className="text-muted cv__proj-meta">{p.meta}</span>
                      </div>
                      <span className="cv__proj-stack text-muted">{p.stack}</span>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </section>

            <section className="cv__block" data-od-id="cv-education">
              <Reveal>
                <h2 className="cv__h2 display">Education</h2>
              </Reveal>
              <Reveal>
                <div className="cv__edu">
                  <h3>{cv.education.school}</h3>
                  <span className="cv__period text-muted">
                    {cv.education.period} · {cv.education.location}
                  </span>
                  <p className="cv__p">{cv.education.degree}</p>
                  <p className="cv__p text-muted">{cv.education.detail}</p>
                </div>
              </Reveal>
            </section>
          </div>

          <aside className="cv__side" data-od-id="cv-skills">
            <section className="cv__block">
              <Reveal>
                <h2 className="cv__h2 display">Skills</h2>
              </Reveal>
              <div className="cv__skills">
                {cv.skills.map((group) => (
                  <div className="cv__skill-group" key={group.label}>
                    <Reveal>
                      <h3>{group.label}</h3>
                    </Reveal>
                    <p className="cv__skill-items text-muted">
                      {group.items.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}