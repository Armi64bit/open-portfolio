import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Particles } from "@/components/Particles";
import "./globals.css";
import "./components.css";

const title = "Bahaa Eddine Bouzid — Full-stack Engineer";
const description =
  "Portfolio of Bahaa Eddine Bouzid: a full-stack engineer in Tunis building dependable web products, real-time systems, and cloud-ready platforms with React, TypeScript, and Spring Boot.";

export const metadata: Metadata = {
  metadataBase: new URL("https://bahaaeddine-dev.vercel.app"),
  title: {
    default: title,
    template: "%s — Bahaa Eddine Bouzid",
  },
  description,
  keywords: [
    "Bahaa Eddine Bouzid",
    "full-stack engineer",
    "React",
    "TypeScript",
    "Spring Boot",
    "portfolio",
  ],
  icons: {
    icon: "/images/framerusercontent.com/5OyXDq4rMkj8O41hdVBRgIcG0-7c175826f1.png",
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/og-bahaa-bouzid.jpg", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body>
        <ThemeProvider>
          <Particles />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}