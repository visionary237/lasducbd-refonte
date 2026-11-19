# L'As du CBD — Concept d'identité digitale (DOERZ)

> **Concept indépendant non commandité.** Prototype réalisé par DOERZ à titre d'étude de cas et de présentation privée aux fondateurs de L'As du CBD. Il n'a été ni commandé ni validé par la marque. Démonstration éditoriale **sans vente, sans paiement, sans promotion** et sans présentation de produits réglementés. `robots: noindex`.

## Démarrer

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # export statique dans out/
npx serve out        # ou : cd out && python3 -m http.server 4173
npm run test:qa      # captures + responsive + audit axe (serveur sur :4173 requis, CHROME=/chemin/chrome si besoin)
```

Paramètres d'URL utiles : `?nointro` (saute l'intro), `?introAt=0.42` (fige l'intro à 42 % — captures portfolio).

## Stack

| Besoin | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js 15** (App Router, `output: 'export'`) | Pages statiques, hébergeables partout, zéro serveur |
| Langage | **TypeScript** strict | |
| Styles | **Tailwind CSS v4** (`@theme` = tokens) | Tokens de marque comme source unique (`app/globals.css`) |
| Scroll & timelines | **GSAP + ScrollTrigger** (`@gsap/react`) | Intro, parallaxe, défilement horizontal épinglé, révélations |
| Micro-interactions | **Motion** (`motion/react`) | Retournement 3D des cartes, menu en éventail, transitions d'onglets |
| 3D | **Three.js : non utilisé** | Les retournements sont en CSS 3D (`preserve-3d`), plus légers ; Three.js ne se justifierait que pour une scène WebGL (ex. As en métal réel), proposée en option |
| Polices | Cormorant Garamond + Manrope via **@fontsource** | Auto-hébergées, aucune requête à Google |

## Structure

```
app/
  layout.tsx            lang="fr", skip link, grain animé, métadonnées noindex
  page.tsx              assemblage des sections
  design-system/page.tsx documentation vivante (tokens, contrastes, composants)
  globals.css           tokens @theme + motifs Art déco + carte 3D + reduced-motion
components/
  Intro.tsx             intro cinématographique (tracé → or → donne → titre → rideau)
  Navigation.tsx        en-tête, menu plein écran « Le jeu » (cartes), rail d'enseignes
  Hero.tsx              ouverture, parallaxe multicouche
  Story.tsx             récit en 4 chapitres (horizontal épinglé ≥ 1024 px, vertical sinon)
  Gallery.tsx           8 cartes graphiques retournables
  Spaces.tsx            maisons physiques (onglets accessibles)
  ArtDirection.tsx      palette, typographie, motifs, mascotte, principes
  ComponentsShowcase.tsx extraits du design system
  Footer.tsx            mentions de cadrage
  Suits.tsx             pique/cœur/carreau/trèfle, rosace, Gentleman (SVG originaux)
  ui/                   Button, Tag, Notice, SectionHeading, CardFace, FlipCard
lib/content.ts          tout le texte éditorial (un seul fichier à faire valider)
lib/contrast.ts         ratio WCAG
scripts/qa.mjs          Playwright + axe-core
docs/                   DESIGN_SYSTEM.md · ASSETS.md · QA.md · ETUDE_UX.md
captures/               images portfolio générées par le script QA
```

## Motion design — où et comment

| Effet | Fichier | Technique |
|---|---|---|
| Tracé du pique, distribution des cartes, révélation lettre à lettre, rideau | `Intro.tsx` | timeline GSAP, `stroke-dashoffset` |
| Parallaxe (rayons, rosace, mascotte) | `Hero.tsx` | ScrollTrigger `scrub` sur `[data-depth]` |
| Chapitres en défilement horizontal | `Story.tsx` | `pin` + `containerAnimation` |
| Titres révélés mot à mot | `ui/SectionHeading.tsx` | ScrollTrigger + masques `overflow-hidden` |
| Retournement de cartes 3D | `ui/FlipCard.tsx` | Motion spring sur `rotateY` |
| Menu distribué en éventail | `Navigation.tsx` | Motion + `clip-path` circulaire |
| Transition organique des maisons | `Spaces.tsx` | `AnimatePresence` + `clip-path inset` |
| Texture vivante | `globals.css` `.grain` | bruit SVG animé en `steps()` à 7 % |

Toutes les animations passent par `gsap.matchMedia("(prefers-reduced-motion: no-preference)")` ou `useReducedMotion()` : avec la préférence système activée, le contenu est affiché immédiatement et l'intro est sautée.

## Accessibilité (WCAG 2.2 AA visé)

- Lien d'évitement, `lang="fr"`, un `h1` (intro) puis `h2` par section, landmarks `header/nav/main/footer`.
- Menu : `role="dialog"`, `aria-modal`, focus piégé, Échap, retour du focus au bouton.
- Cartes : vrais `<button>` avec `aria-pressed`, verso présent dans le DOM.
- Onglets des maisons : motif ARIA tabs (flèches, Début/Fin, `tabIndex` itinérant).
- Focus visible Or 2 px ; contrastes vérifiés (voir `docs/DESIGN_SYSTEM.md`).
- Résultat axe-core : **0 violation** sur `/` et `/design-system` (voir `docs/QA.md`).

## Performance

Export statique ~1,8 Mo (polices incluses), JS 208 kB first-load sur `/`. Aucune image matricielle : tout est SVG/CSS en attendant les visuels de l'inventaire. Les animations n'utilisent que `transform`, `opacity` et `clip-path`.

## Garde-fous éditoriaux

Pas de panier, prix, codes promo, compte à rebours, pop-up ni CTA d'achat. Les maisons sont présentées de façon informative (accueil réservé aux majeurs). Les textes « histoire » sont un récit de travail à valider ; les adresses et horaires ne sont **pas inventés** et restent à brancher sur les données officielles.
