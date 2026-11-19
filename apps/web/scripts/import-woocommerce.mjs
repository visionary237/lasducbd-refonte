// Import du catalogue réel depuis la boutique WooCommerce (Store API publique, sans clé).
// Usage : node --experimental-strip-types scripts/import-woocommerce.mjs [https://boutique.example]
// Écrit content/products.json. Les produits sans taux de THC ne seront pas publiés (cf. isPublishable).
import fs from "node:fs";
import { mapWcProduct } from "../lib/catalog/woocommerce.ts";

const base = process.argv[2] ?? "https://coffeeshop-lasducbd.fr";
const out = [];
for (let page = 1; page < 50; page++) {
  const r = await fetch(`${base}/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
  if (!r.ok) { if (page === 1) throw new Error(`HTTP ${r.status}`); break; }
  const batch = await r.json();
  if (!batch.length) break;
  for (const w of batch) { const p = mapWcProduct(w); if (p) out.push(p); }
}
fs.writeFileSync(new URL("../content/products.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(`${out.length} produits importés · ${out.filter((p) => p.attributes.thcPercent == null).length} sans taux de THC (non publiés si fleurs/extractions)`);
