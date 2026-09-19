export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  blurb: string;
  description: string;
  highlights: string[];
  stack: string[];
  image: string;
  imageAlt: string;
  imageRatio: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "lilac-aitrader",
    title: "Lilac-AiTrader",
    category: "Full-stack Engineering",
    year: "2026",
    blurb:
      "A self-improving AI trading bot streaming live Binance market data across 15 crypto pairs.",
    description: "",
    highlights: [
      "Engineered a self-improving AI crypto trading bot with a FastAPI backend and a React/Tailwind dashboard",
      "Integrated CCXT for live Binance market data across 15 crypto pairs",
      "Architected 4 ensemble trading strategies with a dynamic weighted-voting system",
      "Automated hyperparameter optimization via Optuna",
      "Deployed via GitHub Actions to Railway and Vercel",
    ],
    stack: ["FastAPI", "React", "Tailwind", "CCXT", "Optuna", "GitHub Actions"],
    image: "/images/framerusercontent.com/tPh4XLwOfVYM4RO317hL6nDda8-d783a3b17b.jpg",
    imageAlt: "Lilac-AiTrader crypto trading dashboard",
    imageRatio: "3 / 2",
    featured: true,
  },
  {
    slug: "b2b-hub-platform-revamp",
    title: "B2B Hub Platform Revamp",
    category: "Frontend Engineering",
    year: "2025",
    blurb:
      "Modernizing a B2B platform's frontend under Atomic Design, cutting component duplication by ~30%.",
    description: "",
    highlights: [
      "Rebuilt core UI modules of an internal B2B platform in React and TypeScript, reducing estimated page load time by 20%",
      "Migrated the frontend under Atomic Design principles, cutting component duplication by an estimated 30%",
      "Refactored 8+ legacy UI components into a shared design system used across 3+ features",
      "Cut new-feature implementation time by an estimated 25%",
    ],
    stack: ["React", "TypeScript", "Atomic Design"],
    image: "/images/framerusercontent.com/7O2YqYQfVyrjjiBX5pdwxT0LCi0-af4c5814f0.jpg",
    imageAlt: "B2B hub platform interface",
    imageRatio: "3 / 2",
    featured: true,
  },
  {
    slug: "zerowaste",
    title: "ZeroWaste",
    category: "Full-stack Engineering",
    year: "2024",
    blurb:
      "A sustainability & recycling platform connecting people with recycling centers and community events.",
    description: "",
    highlights: [
      "Built a React and Laravel platform for discovering recycling centers and learning eco-friendly practices",
      "Interactive GPS recycling map, semantic search and Stripe payments",
      "Dynamic cart, email notifications, educational content and sustainability challenges",
      "Developed in association with ESPRIT (Sep–Nov 2024)",
    ],
    stack: ["React", "Laravel", "Stripe", "GPS", "MySQL"],
    image: "/images/framerusercontent.com/bDivqxG2iB6c6fhONI6RFtaL6zM-b673ef6b8f.jpg",
    imageAlt: "ZeroWaste recycling platform",
    imageRatio: "3 / 2",
    featured: true,
  },
  {
    slug: "devops-automation",
    title: "DevOps Automation Project",
    category: "Backend & DevOps",
    year: "2024",
    blurb:
      "Spring Boot + Angular application shipped with a full CI/CD pipeline and production monitoring.",
    description: "",
    highlights: [
      "Built a Spring Boot + Angular application with a complete CI/CD pipeline",
      "Reduced manual deployment steps by an estimated 70%",
      "Added Prometheus/Grafana monitoring across the stack",
    ],
    stack: ["Spring Boot", "Angular", "Docker", "Jenkins", "Prometheus"],
    image: "/images/framerusercontent.com/iDWqKgoesi3cnPNsTyi54KIwVY-d9b3e515e2.jpg",
    imageAlt: "DevOps automation pipeline dashboard",
    imageRatio: "4 / 3",
    featured: false,
  },
  {
    slug: "tektai",
    title: "Tektai",
    category: "Full-stack Engineering",
    year: "2024",
    blurb:
      "An ML collaboration platform with an estimated 25% faster API responses from backend query optimization.",
    description: "",
    highlights: [
      "Developed an ML collaboration platform for teams working on machine learning projects",
      "Improved API response times by an estimated 25% through backend query optimization",
    ],
    stack: ["React", "Node.js", "NestJS", "MongoDB"],
    image: "/images/framerusercontent.com/0nYSOjyBgXpc7IxWGJ0F9EFhmIA-745ac60360.jpg",
    imageAlt: "Tektai ML collaboration platform",
    imageRatio: "4 / 3",
    featured: false,
  },
  {
    slug: "artfulio",
    title: "Artfulio",
    category: "Frontend Engineering",
    year: "2023",
    blurb:
      "A cross-platform social network for artists to share work, connect and grow their portfolio's visibility.",
    description: "",
    highlights: [
      "Cross-platform social network for artists to share their work and connect with creators",
      "Social interactions, portfolio sharing and real-time feedback features",
      "Developed in association with ESPRIT",
    ],
    stack: ["HTML5", "CSS3", "JavaScript"],
    image: "/images/framerusercontent.com/d6yYXVlzi8KC6ok8OkGppmhogkc-819576a474.jpg",
    imageAlt: "Artfulio artist community platform",
    imageRatio: "4 / 3",
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/* ---------------- CV / resume ---------------- */

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

export type ProjectEntry = {
  title: string;
  meta: string;
  stack: string;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export const cv = {
  name: "Bahaa Eddine Bouzid",
  initials: "BAHAA",
  location: "Tunis, Tunisia",
  phone: "+216 55482545",
  email: "bahaaeddinebouzid@gmail.com",
  sites: [
    { label: "Portfolio", url: "https://bahaaeddine-dev.vercel.app" },
    { label: "GitHub", url: "https://github.com/Armi64bit" },
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/bahaa-eddine-bouzid-webdev",
    },
    { label: "Blog", url: "https://armi64bit.github.io/own-blog/" },
  ],
  summary:
    "Full-stack engineer who has shipped React/TypeScript frontends and Spring Boot backends across two internships and six-plus independent projects, including a live AI-driven trading system processing real-time market data across 15 crypto pairs. Comfortable owning features end-to-end, from REST API design through AWS deployment and CI/CD.",
  skills: [
    { label: "Languages", items: ["Java", "JavaScript", "TypeScript", "Python", "C/C++"] },
    { label: "Frontend", items: ["React", "Angular", "HTML5", "CSS3", "Tailwind CSS"] },
    {
      label: "Backend",
      items: ["Spring Boot", "Node.js", "NestJS", "FastAPI", "Django", "Laravel", "Symfony"],
    },
    { label: "Databases", items: ["MongoDB", "SQL", "NoSQL"] },
    {
      label: "Cloud & DevOps",
      items: [
        "AWS (EC2, S3)",
        "Docker",
        "CI/CD",
        "GitHub Actions",
        "Jenkins",
        "Git",
        "Maven",
        "SonarQube",
        "Prometheus",
        "Grafana",
        "Firebase",
      ],
    },
    { label: "Testing", items: ["Jest", "JUnit"] },
    {
      label: "AI/ML Tools",
      items: ["OpenRouter", "Gemini AI", "Optuna", "Prompt Engineering"],
    },
    { label: "Spoken", items: ["English", "French", "Spanish"] },
  ] as SkillGroup[],
  experience: [
    {
      role: "Front-End Developer Intern",
      company: "Xtendplex",
      location: "Tunisia",
      period: "02/2025 – 12/2025",
      bullets: [
        "Rebuilt core UI modules of an internal B2B platform in React and TypeScript, reducing page load time by an estimated 20%.",
        "Refactored 8+ legacy UI components into a shared design system used across 3+ features, cutting new-feature implementation time by an estimated 25%.",
      ],
    },
    {
      role: "Full Stack Developer Intern",
      company: "IPACT Consult Inc.",
      location: "Remote (Canada)",
      period: "06/2024 – 08/2024",
      bullets: [
        "Built a customizable Andon dashboard in AngularJS and Spring Boot, giving production teams real-time visibility into 5+ line metrics.",
        "Raised system reliability by writing unit and integration tests covering core dashboard features, and authored technical documentation adopted team-wide.",
      ],
    },
    {
      role: "Mobile Developer",
      company: "Denim Authority",
      location: "Tunisia",
      period: "06/2023 – 07/2023",
      bullets: [
        "Launched a Flutter/Firebase e-commerce app with full backend integration, enabling end-to-end purchase flows for early users.",
      ],
    },
    {
      role: "Admissions Committee",
      company: "ESPRIT",
      location: "Tunisia",
      period: "06/2022 – 08/2022",
      bullets: [
        "Resolved 50+ inquiries across phone, email, and live chat channels, maintaining a response time under 24 hours.",
      ],
    },
    {
      role: "Freelance Full-Stack Developer",
      company: "Self-employed",
      location: "Remote",
      period: "2018 – Present",
      bullets: [
        "Delivered production web applications in React, Angular, Spring Boot, and Node.js for multiple clients, integrating REST APIs and building responsive, cross-device interfaces.",
      ],
    },
  ] as Experience[],
  projects: [
    {
      title: "Lilac-AiTrader",
      meta: "2026 — Self-improving AI crypto trading bot",
      stack: "FastAPI · React · Tailwind · CCXT · Optuna",
    },
    {
      title: "B2B Hub Platform Revamp",
      meta: "2025 — Platform frontend modernization",
      stack: "React · TypeScript",
    },
    {
      title: "DevOps Automation Project",
      meta: "2024 — CI/CD pipeline & monitoring",
      stack: "Spring Boot · Angular · Docker · Jenkins",
    },
    {
      title: "Tektai",
      meta: "2024 — ML collaboration platform",
      stack: "React · Node.js · NestJS · MongoDB",
    },
    {
      title: "ZeroWaste",
      meta: "2024 — Sustainability & recycling platform",
      stack: "React · Laravel · Stripe · GPS",
    },
    {
      title: "Artfulio",
      meta: "2023 — Artist community platform",
      stack: "HTML · CSS · JavaScript",
    },
  ] as ProjectEntry[],
  education: {
    school: "ESPRIT — Private Higher School of Engineering and Technology",
    location: "Tunisia",
    period: "2020 – 2025",
    degree: "Software Engineering Degree, Web & Internet Technologies",
    detail:
      "Five-year engineering program focused on web and internet technologies, covering full-stack development, software architecture, and modern deployment practices.",
  },
};

/* ---------------- misc content ---------------- */

export const services = [
  {
    n: "01",
    title: "Web Design",
    desc: "Clear, refined websites built around strong structure and visual direction.",
  },
  {
    n: "02",
    title: "Framer Development",
    desc: "Responsive builds with thoughtful motion, interactions and attention to detail.",
  },
  {
    n: "03",
    title: "Interaction Design",
    desc: "Purposeful interactions that make digital experiences feel intuitive and engaging.",
  },
  {
    n: "04",
    title: "Creative Direction",
    desc: "Visual concepts and systems that give each project a distinct and cohesive identity.",
  },
];

export const clientLogos = [
  "/images/framerusercontent.com/Pj4r2WPp521SAmFTATceGMTOB8Y-6101122e22.png",
  "/images/framerusercontent.com/W34K33eayQqhINfB7JT0wSEPTc-fd45aa66fa.png",
  "/images/framerusercontent.com/CDDnckZCkn2N4IV8qLFsOtS8KEs-7467c0c647.png",
  "/images/framerusercontent.com/qVxl1TaRgKDniIkfQpLcGews0-cf9b7bea0f.png",
  "/images/framerusercontent.com/dkNhhM1J21y7SEMm8NjSp31goOU-d99114b4f4.png",
];

export const heroPortrait =
  "/images/framerusercontent.com/zxVxR2OQZ4gwb0Z5UtFvEnMLINQ-b82d477927.jpg";

export const aboutPortrait =
  "/images/framerusercontent.com/9VzqeInK4U8O75RntX2C3nj4Da4-bb064258fe.jpg";

export const blogUrl = "https://armi64bit.github.io/own-blog/";