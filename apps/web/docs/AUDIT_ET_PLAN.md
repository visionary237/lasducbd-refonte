# Audit de l'existant & plan de refonte (19/11/2026)

## Audit
| Élément v1 | Verdict | Devenir |
|---|---|---|
| Next.js 15 export statique | Inadapté (formulaires, API fidélité) | Mode serveur |
| Intro plein écran bloquante | Contraire à l'objectif commercial | Supprimée (hero immersif non bloquant) |
| Récit « salon de jeu », palette Onyx/Émeraude/Bordeaux | Lecture « casino » | Nouvelle DA luxe / urbain / botanique, cartes en storytelling secondaire |
| Composants FlipCard, SectionHeading, Suits, contraste, tabs accessibles | Réutilisables | Conservés et adaptés |
| Jeu Phaser (marque codée en dur dans 4 fichiers) | Bonne architecture data-driven | Isolé dans `packages/lost-ace`, marque externalisée (`brand.ts` / `brand.json`), API `createGame()` |
| Pas de tests automatisés au sens CI | — | Vitest + Playwright + axe |

## Plan (réalisé dans cette branche)
1. Git : baseline `main` + tag `concept-v1`, branche `refonte/site-commercial`.
2. Monorepo : `apps/web`, `packages/lost-ace`, scripts racine.
3. Socle : tokens v2, header/footer, contrôle d'âge, consentement, SEO (metadata, sitemap, robots, JSON-LD).
4. Parcours : catalogue → fiche → commande en ligne / réservation boutique ; boutiques ; pédagogie ; journal.
5. Fidélité : modèle, règles testées, contrats Wallet/CRM, page programme, liste d'attente.
6. Expérience : jeu chargé à la demande en iframe isolée.
7. Qualité : tests unitaires, e2e, conformité éditoriale, accessibilité, captures.

## Prochaines étapes (hors prototype)
- Fournir : mentions légales, adresses/horaires, photos, validation de la liste de villes.
- Lancer l'import catalogue depuis un environnement autorisé et relire les fiches sans THC.
- Valider juridiquement : huiles (statut), E-CBD (publicité), mentions obligatoires.
- Choisir les fournisseurs Wallet / CRM, implémenter identification et dashboard commerçant.
- Décider du maintien de la boutique WooCommerce (commande) ou d'un checkout intégré.
