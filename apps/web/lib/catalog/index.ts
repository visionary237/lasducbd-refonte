import { CATEGORIES, visibleCategories, categoryBySlug } from "./categories";
import { PRODUCTS, TEMPLATE_PRODUCT } from "./products";
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
export function formatPrice(cents: number | null, unit?: string) {
  if (cents == null) return "Prix à importer";
  const v = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
  return unit ? `${v} ${unit}` : v;
}
export const allProducts = () => PRODUCTS;
