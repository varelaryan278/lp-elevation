import type { MetadataRoute } from "next";
import { marca } from "@/content/marca";

export const dynamic = "force-static";

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/" },
  sitemap: `${marca.site}/sitemap.xml`,
});

export default robots;
