import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, projects } from "@/lib/data";
import { ProjectHeroImage } from "@/components/ProjectsSection";
import { ProjectMedia } from "@/components/ProjectMedia";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.blurb,
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <section className="section section--page" data-od-id={`work-${slug}`}>
      <div className="container">
        <Reveal>
          <Link href="/work" className="link back-link" data-od-id="back-to-work">
            ← Back to Work
          </Link>
        </Reveal>

        <div className="wd__head">
          <Reveal delay={0.05}>
            <span className="kicker">
              {project.category} · {project.year}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="display display--section wd__title">{project.title}</h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="section__lead wd__blurb">{project.blurb}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ProjectHeroImage project={project} priority />
        </Reveal>

        <ProjectMedia project={project} />

        <div className="wd__body">
          <div>
            <h2 className="wd__h2 display">Overview</h2>
            {project.description ? <p className="wd__story">{project.description}</p> : null}
            <ul className="wd__highlights">
              {project.highlights.map((h, i) => (
                <Reveal key={i} delay={i * 0.04} as="li">
                  <span className="wd__bullet" aria-hidden="true" />
                  {h}
                </Reveal>
              ))}
            </ul>
          </div>

          <aside className="wd__side">
            <h2 className="wd__h2 display">Stack</h2>
            <ul className="wd__stack">
              {project.stack.map((s) => (
                <li key={s} className="chip" data-od-id={`stack-${s.toLowerCase()}`}>
                  {s}
                </li>
              ))}
            </ul>
            <Link
              href="/#contact"
              className="btn"
              data-od-id="project-contact"
            >
              Start a project
              <span className="ico" aria-hidden="true">
                ↗
              </span>
            </Link>
            {project.repoUrl || project.originUrl ? (
              <div className="wd__links">
                <span className="wd__links-label text-muted">Project links</span>
                {project.repoUrl ? (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="link">
                    Current repository <span className="arr" aria-hidden="true">↗</span>
                  </a>
                ) : null}
                {project.originUrl ? (
                  <a href={project.originUrl} target="_blank" rel="noreferrer" className="link">
                    Original fork <span className="arr" aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>

        <nav className="wd__nav" aria-label="Other projects">
          <Link
            href={`/work/${prev.slug}`}
            className="wd__nav-item"
            data-od-id="prev-project"
          >
            <span className="wd__nav-label text-muted">← Previous</span>
            <span className="wd__nav-title display">{prev.title}</span>
          </Link>
          <Link
            href={`/work/${next.slug}`}
            className="wd__nav-item wd__nav-item--next"
            data-od-id="next-project"
          >
            <span className="wd__nav-label text-muted">Next →</span>
            <span className="wd__nav-title display">{next.title}</span>
          </Link>
        </nav>
      </div>
    </section>
  );
}