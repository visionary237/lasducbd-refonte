# Design system v2 — L'As du CBD (refonte commerciale)

Source des tokens : `app/globals.css` (`@theme`). Territoire : **luxe × culture urbaine × botanique**. Les cartes à jouer sont un registre secondaire (enseignes, micro-interactions, paliers de fidélité), jamais une esthétique de casino.

## Couleurs
| Token | Hex | Rôle |
|---|---|---|
| `charbon` / `-2` / `-3` | #101010 / #181818 / #222222 | Fonds, cartes produit |
| `vert` / `-2` / `-3` | #142B20 / #1D3B2C / #2A5240 | Surfaces de marque, catégories, boutiques |
| `or` / `or-2` | #C5A059 / #D9BE85 | Actions, filets, chiffres ; or-2 pour le texte sur fond sombre |
| `or-fonce` | #7A5F2B | Or lisible sur ivoire |
| `ivoire` / `-2` | #F2EEE5 / #E6E0D3 | Texte, sections éditoriales claires |

| Paire | Ratio |
|---|---|
| Ivoire / Charbon | 16,43:1 |
| Ivoire / Vert | 12,99:1 |
| Or / Charbon (et Charbon / Or, bouton) | 7,74:1 |
| Or / Vert | 6,12:1 |
| Or foncé / Ivoire | 5,18:1 |
| ⚠️ Or / Ivoire | 2,12:1 — interdit pour du texte |

## Typographie
Cormorant Garamond (titres éditoriaux, chiffres `t-num`, italique en emphase) · Manrope (texte, UI, étiquettes `t-label` en capitales espacées 0,24 em — la touche urbaine).

## Matières & motifs
`texture-botanique` (nervures dorées à 7 %) · `texture-grain` (grain velours) · `gold-frame` (double filet) · `BotanicalLines` (feuillage au trait, générique) · enseignes `SuitIcon` · photographie macro plein cadre avec dégradés charbon.

## Mouvement
Révélation du titre du hero (1,3 s, expo.out), parallaxe de la photo, titres mot à mot, apparitions en cascade (`Reveal`), bandeau défilant, cartes retournables (engagements), soulèvement des tuiles. Tout est coupé en `prefers-reduced-motion`.

## Composants
`Button/LinkButton` (primary, ghost, light, dark) · `Tag` · `Notice` · `SectionHeading` · `Reveal` · `FlipCard` · `CategoryCard` · `ProductCard` · `WalletCard` · `ApiForm` + `Field` · `PageHeader` (+ fil d'Ariane JSON-LD) · `AgeGate` · `CookieBanner` · `JsonLd`.
