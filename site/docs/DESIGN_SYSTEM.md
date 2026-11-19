# Design system — L'As du CBD (concept DOERZ) · v1.0

Documentation vivante : `/design-system`. Source des tokens : `app/globals.css` (`@theme`).

## 1. Couleurs

| Token | Hex | Rôle |
|---|---|---|
| `--color-onyx` | `#101714` | Fond principal, profondeur |
| `--color-onyx-2` | `#17201C` | Fond secondaire (sections alternées) |
| `--color-emeraude` | `#214D36` | Surfaces, « feutre de table », dos de cartes |
| `--color-emeraude-2` | `#2C6447` | Survol des surfaces émeraude |
| `--color-or` | `#C6A05A` | Emblème, filets, actions primaires, focus |
| `--color-or-2` | `#DCBD84` | Or éclairci — **petit texte sur émeraude** |
| `--color-ivoire` | `#F3EBDD` | Texte, papier, faces claires |
| `--color-bordeaux` | `#832E3E` | Accent rare : signaux, mentions, enseignes rouges |

Règle de dosage : 70 % Onyx/Émeraude · 20 % Ivoire · 8 % Or · 2 % Bordeaux.

### Contrastes mesurés (WCAG 2.x)

| Paire | Ratio | Usage |
|---|---|---|
| Ivoire / Onyx | 15,36:1 | AAA, tout texte |
| Or-2 / Onyx | 10,09:1 | AAA |
| Ivoire / Émeraude | 8,14:1 | AAA |
| Or / Onyx | 7,43:1 | AAA |
| Onyx / Or (bouton primaire) | 7,43:1 | AAA |
| Ivoire / Bordeaux | 7,31:1 | AAA |
| Or-2 / Émeraude | 5,35:1 | AA, tout texte |
| **Or / Émeraude** | **3,94:1** | **Grand texte (≥ 24 px) et pictos uniquement** |

## 2. Typographie

| Rôle | Police | Graisse | Taille | Interligne / approche |
|---|---|---|---|---|
| Display XL (hero) | Cormorant Garamond | 500 | `clamp(3.2rem, 11vw, 10rem)` | 0,92 / −0,01 em |
| Display L (h2) | Cormorant Garamond | 500 | `clamp(2.4rem, 5.5vw, 4.8rem)` | 0,92 |
| Emphase | Cormorant Garamond italique | 500 | — | dégradé « or » animé `.gold-text` |
| Signature (`.t-caps`) | Cormorant Garamond | 500 | 14–60 px | capitales, +0,28 em |
| Sur-titre (`.t-eyebrow`) | Manrope | 600 | 11,5 px | capitales, +0,32 em, Or |
| Corps | Manrope | 400 | 16–18 px | 1,6 |
| UI | Manrope | 600 | 14–16 px | — |

## 3. Formes & motifs

- **Rayon de carte** : `--radius-card: 18px` (proportion d'une carte réelle 5:7).
- **`.deco-frame`** : double filet doré (1 px à 45 % + 1 px à 22 % en retrait de 7 px).
- **`.deco-rays`** : rayons Art déco (`repeating-conic-gradient`, pas de 9°, 9 %).
- **Rosace** (`<Rosette/>`) : 16 pétales, filet 0,6 px — fond, filigrane.
- **Enseignes** (`<SuitIcon/>`) : tracés originaux, viewBox 100×110.
- **Grain** (`.grain`) : bruit fractal SVG animé, opacité 7 %, coupé en reduced-motion.

## 4. Mouvement

| Intention | Durée | Courbe |
|---|---|---|
| Révélation typographique | 1,0–1,2 s | `expo.out` |
| Distribution de cartes | 0,8–1,0 s, décalage 60–80 ms | `back.out(1.2–1.4)` |
| Retournement | ressort `stiffness 120, damping 16` | — |
| Transition de panneau | 0,7 s | `cubic-bezier(.22,1,.36,1)` (`--ease-card`) |
| Survol | 0,3–0,5 s | ease par défaut |

Principe : **le mouvement raconte le geste du croupier** (donner, retourner, éventailler). Jamais de mouvement en boucle autour d'un contenu à lire.

## 5. Composants

| Composant | Props | États | Accessibilité |
|---|---|---|---|
| `Button` / `LinkButton` | `variant: primary \| ghost \| accent` | hover, focus, disabled | focus Or 2 px, hauteur ≥ 44 px |
| `Tag` | `tone: or \| bordeaux \| ivoire` | — | texte explicite |
| `Notice` | `title`, `children` | — | `role="note"` |
| `SectionHeading` | `id`, `eyebrow`, `title`, `align` | animé à l'entrée | `h2` réel, `id` pour `aria-labelledby` |
| `CardFace` | `rank`, `suit`, `title`, `tone` | — | coins décoratifs `aria-hidden` |
| `FlipCard` | `front`, `back`, `label` | recto / verso, épinglé au clic | `button` + `aria-pressed`, survol non requis |
| `SuitIcon` | `suit`, `title?` | — | décoratif sauf si `title` |
| `Rosette`, `Gentleman` | `className` | — | décoratif / `role="img"` |

## 6. Grille & responsive

Conteneur `max-w-7xl`, gouttières 24 px (mobile) → 56 px (desktop). Points de rupture Tailwind : `sm 640`, `md 768`, `lg 1024`. Le récit passe en horizontal épinglé à partir de `lg` ; le rail d'enseignes n'apparaît qu'à partir de `lg`.

## 7. Ton éditorial

Vouvoiement, phrases courtes, champ lexical du jeu de cartes et du salon. On informe et on conseille ; on ne pousse jamais à l'achat ni à la consommation.
