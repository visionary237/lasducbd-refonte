# Spécifications des assets graphiques & audio

Toutes les textures du prototype sont **générées par code** (`src/art/`) avec les mêmes clés, tailles et ordres de frames que ci-dessous. Remplacer par les illustrations finales = charger les fichiers dans un `preload()` sous la même clé et supprimer l'appel de génération correspondant. Aucun code de gameplay ne change.

Conventions : PNG 32 bits (alpha), dessinés à **2×** puis exportés à 1× (ou chargés en @2x avec `setScale(0.5)`), marge transparente de 2 px par frame, pas de flou de mouvement dans les frames.

## Personnages

| Clé | Frame | Frames | Ancrage | Corps physique | Contenu |
|---|---|---|---|---|---|
| `player` | 72×88 | 12 : 0-1 idle · 2-7 course · 8 saut · 9 chute · 10 blessé · 11 vrille | bas-centre (0.5, 1) | 26×58, offset 23,28 | Gentleman de Pique : tête en pique noire, yeux or lumineux, haut-de-forme à ruban émeraude et **emblème pique** (pas de feuille ni de produit), queue-de-pie, gilet émeraude motif or, nœud bordeaux, gants ivoire |
| `beetle` | 64×44 | 5 : 0-3 marche · 4 écrasé | bas-centre | 50×26 | Scarabée d'émeraude, carapace métallique liseré or, œil rouge |
| `wisp` | 56×56 | 4 : scintillement | centre | cercle r15 | Feu follet bleu-blanc, rendu en SCREEN |
| `boss` | 180×200 | 4 : 0 idle · 1 élan · 2 sonné · 3 vaincu | bas-centre | 100×150 | Le Roi Sans Visage : corps-carte ivoire, cœurs bordeaux, couronne or, cape bordeaux, visage noir sans traits |

Animations : `p-idle` 2,5 i/s · `p-run` 14 i/s · `beetle-walk` 10 i/s · `wisp-float` 8 i/s.

## Objets

| Clé | Taille | Notes |
|---|---|---|
| `crystal` | 32×44 | losange cyan, halo intégré ; flotte ±6 px |
| `card` / `card-face` | 44×62 | dos émeraude + pique or / face ivoire ; rotation Y simulée (scaleX) |
| `heart` | 36×36 | cœur bordeaux, soin +1 PV |
| `lantern` | 44×80, 2 frames | 0 éteinte · 1 allumée (checkpoint) |
| `portal` | 140×190 | arche de pierre, liseré or, cœur lumineux (particules en plus) |
| `sign` | 76×60 | panneau bois, texte rendu par le moteur |
| `mover` | 144×30 | dalle 3 tuiles, dessus moussu (collision 144×22) |
| `boss-card` | 30×42 | projectile ivoire à trèfle bordeaux |
| `mushroom` | 48×48, 3 frames | 1, 2 ou 3 champignons lumineux (décor + source de lumière) |
| `fern` | 160×120 | fougère silhouette de premier plan |

## Tileset — `tiles-<monde>` (13 tuiles de 48×48 sur une ligne, 624×48)

| Index | Tuile |
|---|---|
| 0-2 | surface (3 variantes) |
| 3-5 | remplissage (3 variantes) |
| 6 / 7 / 8 | plateforme traversable gauche / milieu / droite |
| 9 | ronces |
| 10 | plateforme seule |
| 11 / 12 | bord de falaise gauche / droit |

Les tuiles 0-5 et 11-12 doivent se raccorder horizontalement et verticalement ; l'herbe de la surface déborde de 6 px au-dessus (dessinée dans la tuile).

## Décors (par monde) — `bg-<monde>-<couche>`

| Couche | Taille | Défilement | Règles |
|---|---|---|---|
| `sky` | 1280×720 | fixe | dégradé + source lumineuse (lune / soleil) |
| `far` | 1280×720 | 0,12 | silhouettes lointaines, contre-jour, **raccord horizontal** |
| `mid` | 1280×720 | 0,32 | arbres/architecture avec détails, lueurs |
| `near` | 1280×720 | 0,62 | gros éléments sombres, transparence majoritaire pour garder la lisibilité |
| premier plan | libre | 1,08-1,25 | fougères, feuillages, piliers — jamais sur le chemin critique |

Palettes : voir `src/config/worlds.ts` (`skyTop`, `skyBottom`, `far`, `mid`, `near`, `groundTop`, `groundFill`, `accent`, `light`). Contraste requis : le plan de jeu (tuiles + personnage) doit rester plus contrasté que toutes les couches de décor.

| Monde | Motif | Particules | Obscurité |
|---|---|---|---|
| Emerald Forest | arbres, lianes, champignons | lucioles + feuilles | 0,18 |
| Golden Temple | piliers, toits de pagode, falaises | poussière dorée | 0,05 |
| Crystal Laboratory | sphères de verre, tuyaux | bulles | 0,10 |
| Midnight Kingdom | arbres tordus violets | spores | 0,30 |
| Royal Palace | colonnes, rosaces, bannières | braises | 0,20 |

## Interface (cartes à jouer)

`ui-panel` 320×110 · `ui-card-slot` 30×42 · `ui-hp` / `ui-hp-empty` 26×28 (pique) · `ui-touch` 120×120 · `menu-card` / `menu-card-locked` 260×364. Polices : Cormorant Garamond (titres, chiffres), Manrope (UI).

## Particules & lumière

`dot` 16 (glow blanc) · `spark` 12 (étoile 4 branches) · `leaf` 14×8 · `light` 256 (dégradé radial, sert aussi de tampon d'éclairage) · `ray` 220×720 · `vignette` 640×360.

## Audio (à remplacer les sons synthétisés)

| Clé | Durée | Intention |
|---|---|---|
| jump / double | 0,15 s | ressort feutré / carillon |
| crystal | 0,1 s | tintement cristallin, hauteur montant avec le combo |
| card | 0,5 s | arpège 4 notes |
| stomp / hurt / death | 0,1-0,6 s | sourd / dissonant / descendant |
| checkpoint / heart / portal | 0,2-0,8 s | accords majeurs |
| boss-hit / slam / throw | 0,1-0,35 s | métal, impact grave, sifflement |
| Musique (à créer) | boucles 90-120 s | une par monde, jazz manouche / Art déco orchestral, −14 LUFS |
