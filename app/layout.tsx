import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollReveals } from "@/components/scroll-reveals";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ashwin Sharma — AI/ML Engineer",
    template: "%s | Ashwin Sharma"
  },
  description: "Ashwin Sharma is an AI/ML Engineer building practical Generative AI products, machine learning systems, and production-ready applications.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Ashwin Sharma — AI/ML Engineer",
    description: "AI/ML, Generative AI, and production systems built for real-world use.",
    siteName: "Ashwin Sharma",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Ashwin Sharma — AI/ML Engineer" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashwin Sharma — AI/ML Engineer",
    description: "AI/ML, Generative AI, and production systems built for real-world use.",
    images: ["/opengraph-image"]
  },
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#101216",
  colorScheme: "dark"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ashwin Sharma",
    jobTitle: "AI/ML Engineer",
    url: siteUrl,
    sameAs: ["https://github.com/Ashwin-Sharma-H", "https://www.linkedin.com/in/ashwin-sharma-h/"]
  };

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <ScrollReveals />
        {children}
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
