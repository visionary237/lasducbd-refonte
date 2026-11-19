import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/700.css";
import { createGame } from "./index";
import type { BrandConfig } from "./brand";

/**
 * Bootstrap autonome. La marque peut être fournie par :
 *  1. un fichier brand.json à côté de index.html (déploiement par marque, sans recompiler),
 *  2. sinon la configuration par défaut.
 * ?exit=/chemin définit l'URL du bouton « Quitter » (intégration dans un site).
 */
const q = new URLSearchParams(location.search);
async function loadBrand(): Promise<Partial<BrandConfig>> {
  try { const r = await fetch("./brand.json", { cache: "no-store" }); if (r.ok) return await r.json(); } catch {}
  return {};
}
loadBrand().then((b) => {
  const exit = q.get("exit");
  const game = createGame("game", { ...b, ...(exit && exit.startsWith("/") ? { exitUrl: exit } : {}) }, { canvas: q.has("canvas"), debug: q.has("debug") });
  (window as any).__game = game; // accès pour les tests automatisés
});
