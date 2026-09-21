import Link from "next/link";
import type { Metadata } from "next";
import { creativePieces } from "@/lib/creative";
import { Reveal } from "@/components/Reveal";
import CreativeVideo from "@/components/CreativeVideo";

export const metadata: Metadata = {
  title: "Creative",
  description:
    "Generative visuals by Bahaa Eddine Bouzid - TouchDesigner and JavaScript algorithms, CSS and JS canvas work, each piece beat-locked to the music it was built on.",
};

export default function CreativePage() {
  return (
    <section className="section section--page" data-od-id="creative">
      <div className="container">
        <Reveal>
          <span className="kicker">Creative</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="display display--section creative__title">
            Creative
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="section__lead">
            Generative motion studies, 2026. TouchDesigner patches and
            JavaScript algorithms rendered to a beat.
          </p>
        </Reveal>

        <ul className="creative__list" data-od-id="creative-list">
          {creativePieces.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i * 0.04, 0.2)}>
              <li>
                <div className="cpcard">
                  <CreativeVideo piece={p} />
                  <div className="cpcard__body">
                    <span className="text-muted">
                      {p.tech} &middot; {p.year}
                    </span>
                    <h2 className="cpcard__title display">{p.title}</h2>
                    <p className="text-muted">{p.blurb}</p>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
