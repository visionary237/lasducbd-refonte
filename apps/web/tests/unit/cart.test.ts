import { describe, expect, it } from "vitest";
import { addLine, setQty, priceLines, shipping, subtotal, unitPrice, lineKey } from "@/lib/cart";
import { findById, allProducts, queryProducts } from "@/lib/catalog";
import { validateOrder } from "@/lib/validation";
import { isPublishable } from "@/lib/catalog/products";

const all = allProducts();
const zoap = all.find((p) => p.name === "Zoap")!;
const grinder = all.find((p) => p.name === "Grinder Gold 4 parties avec tamis")!;
const fromOnly = all.find((p) => p.priceFrom && !p.variants?.length)!;

describe("catalogue réel", () => {
  it("contient les produits relevés, sans produit en revue juridique", () => {
    expect(all.length).toBeGreaterThan(150);
    expect(all.some((p) => p.name.startsWith("Infusbar"))).toBe(false);
    expect(all.every((p) => p.attributes.thcPercent == null || p.attributes.thcPercent <= 0.3)).toBe(true);
  });
  it("mode strict : fleurs sans THC non publiées", () => {
    expect(isPublishable(fromOnly, true)).toBe(fromOnly.attributes.thcPercent != null);
    expect(isPublishable(zoap, true)).toBe(true);
  });
  it("recherche insensible aux accents + tri prix", () => {
    expect(queryProducts(all, { text: "gelato" }).some((p) => p.name === "Gélato 33")).toBe(true);
    const asc = queryProducts(all, { category: "e-cbd", sort: "prix-asc" }).filter((p) => p.priceCents != null);
    expect(asc[0].priceCents! <= asc[asc.length - 1].priceCents!).toBe(true);
  });
});

describe("panier", () => {
  it("ajoute, fusionne et plafonne les quantités", () => {
    let l = addLine([], zoap.id, "10 g");
    l = addLine(l, zoap.id, "10 g", 2);
    expect(l).toHaveLength(1); expect(l[0].qty).toBe(3);
    l = addLine(l, zoap.id, "1 g", 50);
    expect(l[1].qty).toBe(20);
    expect(setQty(l, lineKey(zoap.id, "1 g"), 0)).toHaveLength(1);
  });
  it("prix : variante exigée, « à partir de » refusé", () => {
    expect(unitPrice(zoap, "10 g")).toBe(5000);
    expect(unitPrice(zoap, null)).toBeNull();
    expect(unitPrice(fromOnly, null)).toBeNull();
    expect(unitPrice(grinder, null)).toBe(1690);
  });
  it("livraison selon les conditions affichées", () => {
    const flower = priceLines(addLine([], zoap.id, "1 g"), findById);
    expect(shipping(flower, "delivery").cents).toBe(0);
    const acc = priceLines(addLine([], grinder.id, null), findById);
    expect(shipping(acc, "delivery").cents).toBeNull();
    expect(shipping(priceLines(addLine([], grinder.id, null, 3), findById), "delivery").cents).toBe(0);
    expect(shipping(acc, "pickup").cents).toBe(0);
    expect(subtotal(acc)).toBe(1690);
  });
});

describe("commande (serveur)", () => {
  const base = { firstName: "Léa", lastName: "M", email: "lea@example.fr", consent: "yes", adult: "yes", mode: "pickup", store: "rouen" };
  it("recalcule les prix et ignore ceux du client", () => {
    const r = validateOrder({ ...base, lines: [{ key: "x", productId: zoap.id, variant: "10 g", qty: 2, unitCents: 1 }] }, findById, ["rouen"]);
    expect(r.ok && r.data.totals.total).toBe(10000);
  });
  it("refuse panier vide, produit non achetable, mineur, adresse incomplète", () => {
    expect(validateOrder({ ...base, lines: [] }, findById, ["rouen"]).ok).toBe(false);
    expect(validateOrder({ ...base, lines: [{ key: "x", productId: fromOnly.id, variant: null, qty: 1 }] }, findById, ["rouen"]).ok).toBe(false);
    expect(validateOrder({ ...base, adult: undefined, lines: [{ key: "x", productId: grinder.id, variant: null, qty: 1 }] }, findById, ["rouen"]).ok).toBe(false);
    expect(validateOrder({ ...base, mode: "delivery", postalCode: "123", lines: [{ key: "x", productId: grinder.id, variant: null, qty: 1 }] }, findById, ["rouen"]).ok).toBe(false);
  });
});
