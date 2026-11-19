import { CATEGORIES, visibleCategories, categoryBySlug } from "./categories";
import { PRODUCTS, TEMPLATE_PRODUCT, isPurchasable, findById } from "./products";
export { isPurchasable, findById };
import type { Product } from "./types";

export { CATEGORIES, visibleCategories, categoryBySlug, TEMPLATE_PRODUCT };
export type { Product, Category } from "./types";

export function productsByCategory(slug: string, list: Product[] = PRODUCTS) {
  return list.filter((p) => p.categorySlug === slug);
}
export function getProduct(category: string, slug: string, list: Product[] = PRODUCTS) {
  if (category === TEMPLATE_PRODUCT.categorySlug && slug === TEMPLATE_PRODUCT.slug) return TEMPLATE_PRODUCT;
  return list.find((p) => p.categorySlug === category && p.slug === slug);
}
export const euros = (cents: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
export function formatPrice(cents: number | null, unit?: string | null, from?: boolean) {
  if (cents == null) return "Prix non communiqué";
  return `${from ? "À partir de " : ""}${euros(cents)}${unit ? ` ${unit}` : ""}`;
}
export const displayPrice = (p: Product) => {
  if (p.variants?.length) return formatPrice(Math.min(...p.variants.map((v) => v.priceCents)), null, true);
  return formatPrice(p.priceCents, p.priceUnit, p.priceFrom);
};
export const SORTS = { pertinence: "Pertinence", "prix-asc": "Prix croissant", "prix-desc": "Prix décroissant", nom: "Nom A → Z", nouveautes: "Nouveautés" } as const;
export type SortKey = keyof typeof SORTS;
/** Filtrage + tri du catalogue (pur, testé). */
export function queryProducts(list: Product[], q: { text?: string; category?: string; sub?: string; inStockOnly?: boolean; sort?: SortKey }) {
  const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  let r = list.filter((p) =>
    (!q.category || p.categorySlug === q.category) && (!q.sub || p.subcategory === q.sub) &&
    (!q.inStockOnly || p.inStock !== false) && (!q.text || norm(p.name).includes(norm(q.text))));
  const price = (p: Product) => p.variants?.length ? Math.min(...p.variants.map((v) => v.priceCents)) : p.priceCents ?? Infinity;
  switch (q.sort) {
    case "prix-asc": r = [...r].sort((a, b) => price(a) - price(b)); break;
    case "prix-desc": r = [...r].sort((a, b) => (price(b) === Infinity ? -1 : price(b)) - (price(a) === Infinity ? -1 : price(a))); break;
    case "nom": r = [...r].sort((a, b) => a.name.localeCompare(b.name, "fr")); break;
    case "nouveautes": r = [...r].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew)); break;
    default: r = [...r].sort((a, b) => Number(b.inStock !== false) - Number(a.inStock !== false));
  }
  return r;
}
export const allProducts = () => PRODUCTS;
