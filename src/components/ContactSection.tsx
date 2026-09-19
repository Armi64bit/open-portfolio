"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || "your site"}`);
    const body = encodeURIComponent(
      `Hi Bahaa,\n\n${message}\n\n— ${name}\n${email}`,
    );
    window.location.href = `mailto:bahaaeddinebouzid@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section className="section section--contact" id="contact" data-od-id="contact">
      <div className="container">
        <Reveal>
          <span className="kicker">Let&apos;s Connect</span>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="section__lead">
            Open to engineering roles, freelance collaborations, and ambitious
            product work. Tell me about your project — I usually reply within a
            day.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {sent ? (
            <div className="contact__success" role="status">
              <span className="contact__success-num" aria-hidden="true">
                ✓
              </span>
              <p>
                Thanks{name ? `, ${name.split(" ")[0]}` : ""} — your email app
                should have opened with the message prefilled. I&apos;ll get
                back to you shortly.
              </p>
            </div>
          ) : (
            <form className="contact__form" onSubmit={onSubmit} data-od-id="contact-form">
              <div className="contact__row">
                <div className="field">
                  <label htmlFor="cf-name">Name</label>
                  <input
                    id="cf-name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="cf-message">Message</label>
                <textarea
                  id="cf-message"
                  name="message"
                  placeholder="Tell me about your project…"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="contact__actions">
                <button type="submit" className="btn btn--solid" data-od-id="send-message">
                  Send Message
                  <span className="ico" aria-hidden="true">
                    ↗
                  </span>
                </button>
                <span className="text-muted contact__hint">
                  Opens your mail client with the message prefilled.
                </span>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}