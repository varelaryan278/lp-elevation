import type { MetadataRoute } from "next";
import { marca, nav } from "@/content/marca";

export const dynamic = "force-static";

const sitemap = (): MetadataRoute.Sitemap =>
  nav.map((item) => ({
    url: `${marca.site}${item.href === "/" ? "/" : `${item.href}/`}`,
    lastModified: new Date("2026-09-22"),
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));

export default sitemap;
