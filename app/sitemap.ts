import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({ url: `${siteUrl}/work/${project.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.75 }))
  ];
}
