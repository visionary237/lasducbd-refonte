import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { visibleCategories, allProducts } from "@/lib/catalog";
import { STORES } from "@/lib/stores";
import { ARTICLES } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`;
  const pages = ["", "/produits", "/boutiques", "/decouvrir-le-cbd", "/fidelite", "/experience", "/actualites", "/infos-pratiques", "/contact", "/mentions-legales", "/confidentialite"];
  return [
    ...pages.map((p) => ({ url: u(p), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...visibleCategories().map((c) => ({ url: u(`/produits/${c.slug}`), priority: 0.8 })),
    ...allProducts().map((p) => ({ url: u(`/produits/${p.categorySlug}/${p.slug}`), priority: 0.6 })),
    ...STORES.map((s) => ({ url: u(`/boutiques/${s.slug}`), priority: 0.9 })),
    ...ARTICLES.map((a) => ({ url: u(`/actualites/${a.slug}`), lastModified: a.date, priority: 0.5 })),
  ];
}
