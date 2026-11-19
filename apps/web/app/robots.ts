import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
/** Prototype : indexation fermée. Passer allow:"/" au lancement. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" }, sitemap: `${SITE.url}/sitemap.xml` };
}
