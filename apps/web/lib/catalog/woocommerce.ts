import type { Product } from "./types";

/**
 * Mapping WooCommerce Store API (/wp-json/wc/store/v1/products) → Product.
 * Règles : on n'invente rien. Taux CBD/THC lus dans les attributs produit ; s'ils manquent → null
 * (et la fiche n'est pas publiée pour les fleurs / extractions, cf. isPublishable).
 */
export interface WcProduct {
  id: number; name: string; slug: string; permalink: string; short_description?: string;
  prices: { price: string; currency_minor_unit: number };
  images: { src: string; alt?: string }[];
  categories: { slug: string; name: string }[];
  attributes?: { name: string; terms: { name: string }[] }[];
  is_in_stock?: boolean;
}

/** Correspondance catégories WooCommerce (slug) → catégories du site. */
export const WC_CATEGORY_MAP: Record<string, string> = {
  "fleurs-de-cbd": "fleurs-de-cbd", "solides-cbd": "hash-et-extractions", "e-cbd": "e-cbd", "liquides-cbd": "e-cbd",
  "vaporisateurs": "e-cbd", "cigarette-electronique": "e-cbd", "cigarettes-jetables": "e-cbd", "chicha-cbd": "e-cbd",
  "cosmetiques": "cosmetiques", "accessoires": "accessoires", "huiles-cbd-full-spectrum": "huiles",
};

const ENT: Record<string, string> = { "&amp;": "&", "&nbsp;": " ", "&#160;": " ", "&#8217;": "’", "&rsquo;": "’", "&quot;": '"', "&#039;": "'", "&lt;": "<", "&gt;": ">", "&eacute;": "é" };
const strip = (h = "") => h.replace(/<[^>]+>/g, " ").replace(/&[#a-z0-9]+;/gi, (e) => ENT[e] ?? " ").replace(/\s+/g, " ").trim();
function percent(attrs: WcProduct["attributes"], key: RegExp): number | null {
  const a = attrs?.find((x) => key.test(x.name));
  const m = a?.terms[0]?.name.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

export function mapWcProduct(w: WcProduct, importedAt = new Date().toISOString()): Product | null {
  const cat = w.categories.map((c) => WC_CATEGORY_MAP[c.slug]).find(Boolean);
  if (!cat) return null;
  const minor = w.prices.currency_minor_unit ?? 2;
  const raw = Number(w.prices.price);
  return {
    id: `wc-${w.id}`, slug: w.slug, name: strip(w.name), categorySlug: cat,
    priceCents: Number.isFinite(raw) && raw > 0 ? Math.round(raw * 10 ** (2 - minor)) : null,
    images: w.images.map((i) => ({ src: i.src, alt: i.alt || strip(w.name) })),
    shortDescription: strip(w.short_description).slice(0, 300) || undefined,
    attributes: {
      cbdPercent: percent(w.attributes, /cbd/i), thcPercent: percent(w.attributes, /thc/i),
      origin: w.attributes?.find((a) => /origine/i.test(a.name))?.terms[0]?.name ?? null,
      cultivation: w.attributes?.find((a) => /culture/i.test(a.name))?.terms[0]?.name ?? null,
      formats: w.attributes?.find((a) => /poids|format|contenance/i.test(a.name))?.terms.map((t) => t.name) ?? [],
    },
    labReport: null, eshopUrl: w.permalink,
    source: { system: "woocommerce", importedAt },
  };
}
