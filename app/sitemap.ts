import type { MetadataRoute } from "next";
import { marca } from "@/content/marca";

export const dynamic = "force-static";

const sitemap = (): MetadataRoute.Sitemap => [
  { url: `${marca.site}/`, lastModified: new Date("2026-10-08"), changeFrequency: "weekly", priority: 1 },
];

export default sitemap;
