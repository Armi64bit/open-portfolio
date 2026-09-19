"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { blogUrl } from "@/lib/data";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "CV", href: "/cv" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: blogUrl, external: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.24,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/#contact") return pathname === "/";
    return pathname.startsWith(href);
  };

  const renderLinks = (mobile = false) =>
    NAV.map((item) => (
      <Link
        key={item.label}
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={
          mobile
            ? "navbar__mobile-link"
            : `navbar__link${!item.external && isActive(item.href) ? " is-active" : ""}`
        }
      >
        {item.label}
        {item.external && <span className="arr">↗</span>}
      </Link>
    ));

  return (
    <header
      className={`navbar${scrolled ? " navbar--scrolled" : ""}`}
      data-od-id="navbar"
    >
      <div className="navbar__inner container">
        <Link href="/" className="navbar__logo" data-od-id="navbar-logo">
          BAHAA
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          {renderLinks()}
        </nav>

        <div className="navbar__actions">
          <ThemeToggle />
          <button
            type="button"
            className="navbar__burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            {open && <span className="burger-x" />}
          </button>
        </div>
      </div>

      <motion.div
        className="navbar__progress"
        style={{ scaleX: progressX }}
        data-od-id="scroll-progress"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            className="navbar__overlay"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="navbar__mobile" aria-label="Mobile">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35 }}
                >
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="navbar__mobile-link"
                  >
                    <span className="navbar__mobile-idx">
                      0{i + 1}
                    </span>
                    {item.label}
                    <span className="arr">↗</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}