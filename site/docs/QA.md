# Tests responsive & accessibilité — 19/11/2026

Outil : `scripts/qa.mjs` (Playwright + Chrome headless + axe-core 4.x). Rapport brut : `captures/qa-report.json`.

## Responsive

| Viewport | Taille | Débordement horizontal | Résultat |
|---|---|---|---|
| Desktop | 1440 × 900 | 0 px | ✅ |
| Tablette | 834 × 1112 | 0 px | ✅ |
| Mobile | 390 × 844 (DPR 2) | 0 px | ✅ (14 px corrigés : `overflow-x: clip`) |

Adaptations : récit horizontal → vertical sous 1024 px ; menu en grille 3×2 avec rotation réduite ; rail d'enseignes masqué ; bandeau « concept » déplacé dans le hero sur mobile ; indicateur de défilement masqué sur mobile.

## Accessibilité (axe-core, tags WCAG 2.0/2.1/2.2 A & AA, reduced-motion activé)

| Page | Violations | Règles passées |
|---|---|---|
| `/` | **0** | 29 |
| `/design-system` | **0** | 5 |

Corrections faites pendant les tests : chiffre romain décoratif géant passé en `::before` (contraste), sur-titres sur émeraude passés en Or-2 (3,94 → 5,35:1), petits textes des cartes émeraude en Or-2.

## Vérifications manuelles scriptées
- Premier `Tab` → « Aller au contenu » ✅
- Menu : ouverture, focus sur la 1re carte, Échap ferme et rend le focus ✅
- Cartes de la galerie retournées au clic (aria-pressed) ✅
- Intro passable (bouton + Échap), non rejouée dans la session, ignorée en reduced-motion ✅

## Limites connues
- Pas encore testé avec NVDA / VoiceOver réels ni sur Safari iOS physique.
- Le défilement horizontal épinglé peut gêner la navigation au clavier par sauts de page : le contenu reste lisible linéairement (ordre DOM).
