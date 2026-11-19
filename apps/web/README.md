# L'As du CBD — site commercial (refonte DOERZ)

Branche `refonte/site-commercial`. L'état précédent (concept éditorial v1) est conservé sous le tag `concept-v1`.

## Démarrer
```bash
npm install
npm run dev                # http://localhost:3000
npm run build && npm start # production locale sur :4173
npm test                   # 88 tests unitaires (Vitest), dont la conformité éditoriale
npm run test:e2e           # 58 tests Playwright (desktop + mobile, axe) — CHROME=/chemin si besoin
npm run import:catalog     # importe le catalogue réel depuis la boutique WooCommerce → content/products.json
npm run preview            # captures pleine page → captures/
```
Variables d'environnement : `NEXT_PUBLIC_SITE_URL`, `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` (voir `.env.example`).

## Pages
| Route | Rôle |
|---|---|
| `/` | Accueil immersif : hero macro, catégories, engagements (cartes), boutiques, fidélité, expérience, journal |
| `/produits`, `/produits/[categorie]`, `/produits/[categorie]/[produit]` | Catalogue → fiches (specs, analyse, disponibilité, commande en ligne, réservation boutique) |
| `/boutiques`, `/boutiques/[ville]` | Présentation des boutiques + JSON-LD `Store` (SEO local) |
| `/decouvrir-le-cbd` | Pédagogie et cadre légal |
| `/fidelite` | Programme (proposition), carte Wallet, liste d'attente |
| `/experience` | Jeu THE LOST ACE, chargé au clic dans une iframe |
| `/actualites`, `/actualites/[slug]` | Journal |
| `/infos-pratiques`, `/contact`, `/mentions-legales`, `/confidentialite` | Service et légal |
| `/api/contact`, `/api/reservation`, `/api/loyalty/*` | Formulaires (→ webhook CRM) et contrats fidélité |

## Architecture
```
app/            pages (App Router), sitemap.ts, robots.ts, routes API
components/     layout/ (header, footer, contrôle d'âge, cookies, en-tête de page) · home/ · catalog/ · forms/ · loyalty/ · ui/
lib/            site.ts · catalog/ (types, catégories, produits, import WooCommerce) · stores.ts · articles.ts
                compliance.ts · consent.ts · validation.ts · loyalty/ (types, config, règles) · server/forward.ts
content/        products.json (généré par l'import, vide par défaut)
tests/          unit/ (Vitest) · e2e/ (Playwright + axe)
docs/           DESIGN_SYSTEM · ASSETS · COMPLIANCE · CRM_ARCHITECTURE · AUDIT_ET_PLAN
```
Stack : Next.js 15 (serveur), TypeScript strict, Tailwind 4, GSAP ScrollTrigger, Motion. Three.js non utilisé (aucun besoin de 3D WebGL).

## Données réelles vs à fournir
Rien n'est inventé : produits, prix, avis, adresses, horaires et mentions légales sont vides tant qu'ils ne sont pas importés ou fournis. Voir `docs/COMPLIANCE.md` §3.
