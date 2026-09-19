# Open Portfolio

Clone of **https://outstanding-tuna-866749.framer.app/** — Bahaa Eddine Bouzid's
Framer portfolio — rebuilt as a **Next.js (App Router) + Framer Motion** static
site, plus a new **dark-theme CV** page reconstructed from `Bahaa_Bouzid_CV-_2_.docx`.

The clone is for personal/professional reuse of the owner's own site; the design
is adapted, not directly ported, and is not affiliated with Framer.

## Stack

- Next.js 15 (App Router, static export via `output: "export"`)
- React 19, TypeScript 5.8
- Framer Motion 12 (`motion`, `AnimatePresence`, `useScroll` parallax)
- Plain CSS + CSS custom properties (no Tailwind) — matches the source's light, neutral system
- Self-hosted fonts: Inter + Inter Display (woff2, from the original site)

## Run

```bash
npm install
npm run build        # static export → out/
node serve.mjs       # tiny static server on :4321 → http://localhost:4321
```

`npm run dev` works too (Next dev server).

## Pages

| Route    | Content                                                               |
| -------- | --------------------------------------------------------------------- |
| `/`      | Nav · Hero (BAHAA display + portrait) · Selected Projects · About · Services · Clients · Contact |
| `/work`  | All six projects                                                       |
| `/work/[slug]` | Project detail (overview, highlights, stack, prev/next)          |
| `/cv`    | Résumé built from the attached CV docx, light/dark via the theme toggle, print-optimized |

## Theme

- **Light** — the brand surface, tokens bound to the original site's computed values:
  `--bg #fff, --fg #000, --muted #6e6e6e, --accent #3cff00, --danger #e80000` (selection color).
- **Dark** — deliberate OKLch-derived variant for the CV: `--bg #0a0a0a, --fg #f2f2f2,
  --muted #8f8f8f, --line #232323`, same `#3cff00` accent.
- Toggle is global (localStorage `open-portfolio-theme`, defaults to `prefers-color-scheme`).
- CV has dedicated `@media print` styles; "Print / Save as PDF" button → `window.print()`.

## Structure

```
src/app/globals.css       design tokens + base
src/app/components.css    component + page styles (navbar, hero, cards, cv, print)
src/app/layout.tsx        metadata, fonts link, ThemeProvider, Navbar/Footer
src/app/page.tsx          home
src/app/work/page.tsx     work listing
src/app/work/[slug]/page.tsx  project detail (generateStaticParams)
src/app/cv/page.tsx       résumé (data-driven from src/lib/data.ts)
src/components/           Navbar, Hero, ProjectsSection, AboutSection,
                          ContactSection, Footer, ThemeProvider, ThemeToggle,
                          Reveal (whileInView), CvActions
src/lib/data.ts           projects + CV data (single source of truth)
public/images…            harvested assets from the original site
public/fonts/fonts.css    self-hosted @font-face (relative URLs)
```

## Notes / caveats

- **Image associations** are inferred from the original DOM order and recon
  screenshots (see `../RECON/`); project covers were matched by position, not
  guarantees — verify `src/lib/data.ts` images visually if precision matters.
- Original "View Résumé" pointed to `https://brxneo.com/`; this clone points it
  to the new in-app `/cv` page instead (a deliberate improvement).
- No backend: the contact form opens a prefilled `mailto:` to the owner's email.
- `og:image` uses a relative URL; set `metadataBase` in `layout.tsx` after
  choosing a deployment domain.
- GitHub push is pending `gh auth login` (blocked outside the sandbox).