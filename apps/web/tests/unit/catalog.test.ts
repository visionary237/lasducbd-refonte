import { describe, expect, it } from "vitest";
import { visibleCategories, categoryBySlug } from "@/lib/catalog/categories";
import { isPublishable, TEMPLATE_PRODUCT } from "@/lib/catalog/products";
import { formatPrice, getProduct } from "@/lib/catalog";
import { mapWcProduct, type WcProduct } from "@/lib/catalog/woocommerce";

const wc = (o: Partial<WcProduct> = {}): WcProduct => ({
  id: 7, name: "Amnesia &amp; co", slug: "amnesia", permalink: "https://shop/amnesia",
  prices: { price: "890", currency_minor_unit: 2 }, images: [{ src: "https://shop/a.jpg" }],
  categories: [{ slug: "fleurs-de-cbd", name: "Fleurs" }],
  attributes: [{ name: "Taux de CBD", terms: [{ name: "12,5 %" }] }, { name: "Taux THC", terms: [{ name: "0,2%" }] }], ...o,
});

describe("catalogue", () => {
  it("masque les catégories en revue juridique (huiles)", () => {
    expect(visibleCategories().map((c) => c.slug)).not.toContain("huiles");
    expect(visibleCategories({ includeLegalReview: true }).map((c) => c.slug)).toContain("huiles");
    expect(categoryBySlug("huiles")?.compliance).toBe("legal-review");
  });
  it("ne publie une fleur que si le THC est renseigné et ≤ 0,3 %", () => {
    const base = mapWcProduct(wc())!;
    expect(isPublishable(base, true)).toBe(true);
    expect(isPublishable({ ...base, attributes: { ...base.attributes, thcPercent: 0.5 } })).toBe(false);
    expect(isPublishable({ ...base, attributes: { ...base.attributes, thcPercent: null } }, true)).toBe(false);
    expect(isPublishable({ ...base, attributes: { ...base.attributes, thcPercent: null } }, false)).toBe(true);
    expect(isPublishable({ ...base, categorySlug: "accessoires", attributes: {} }, true)).toBe(true);
  });
  it("formate les prix sans jamais deviner", () => {
    expect(formatPrice(null)).toBe("Prix non communiqué");
    expect(formatPrice(250, "le g", true).replace(/\s/g, " ")).toBe("À partir de 2,50 € le g");
    expect(formatPrice(890, "le gramme").replace(/\s/g, " ")).toBe("8,90 € le gramme");
  });
  it("retrouve la fiche gabarit", () => expect(getProduct("fleurs-de-cbd", "modele-de-fiche")).toBe(TEMPLATE_PRODUCT));
});

describe("import WooCommerce", () => {
  it("mappe prix, taux et catégorie", () => {
    const p = mapWcProduct(wc(), "2026-11-19T00:00:00Z")!;
    expect(p).toMatchObject({ id: "wc-7", name: "Amnesia & co", categorySlug: "fleurs-de-cbd", priceCents: 890, eshopUrl: "https://shop/amnesia" });
    expect(p.attributes).toMatchObject({ cbdPercent: 12.5, thcPercent: 0.2 });
    expect(p.labReport).toBeNull();
  });
  it("laisse null ce qui manque et ignore les catégories inconnues", () => {
    expect(mapWcProduct(wc({ attributes: [], prices: { price: "0", currency_minor_unit: 2 } }))!.priceCents).toBeNull();
    expect(mapWcProduct(wc({ categories: [{ slug: "inconnue", name: "?" }] }))).toBeNull();
  });
});
