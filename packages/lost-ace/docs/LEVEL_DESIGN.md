# Système de niveaux & level design

## Format

Grille de tuiles de **48 px**, hauteur standard **15 lignes** (= 720 px, l'écran). Lignes numérotées de 0 (haut) à 14 ; la surface « normale » est la ligne **12**.

```ts
const b = new LevelBuilder(200);       // largeur en tuiles
b.ground(0, 24, 12)                    // sol plein colonnes 0→24, surface ligne 12
 .block(83, 10, 2, 2)                  // bloc solide (x, y, w, h)
 .platform(50, 9, 3)                   // plateforme traversable par le dessous
 .thorns(59, 74, 13)                   // ronces (dégâts + rebond)
 .crystals(9, 15, 10)                  // ligne de cristaux
 .arc(24, 28, 9, 2)                    // arc de cristaux au-dessus d'un saut
 .add("mover", 60, 10, { dx: 11, dy: 0, period: 4.2, phase: 0 })
 .add("beetle", 34, 11, { range: 4 })
 .add("wisp", 55, 8, { amp: 1.5, range: 0 })
 .add("checkpoint", 57, 11)
 .add("card", 45, 7)                   // 3 cartes par niveau, indexées dans l'ordre d'ajout
 .add("sign", 6, 11, { text: "…" })
 .add("exit", 192, 11)
 .playerStart(3, 11);
export const LEVEL = b.build("level1", "emerald-forest", "Le sentier des lucioles");
```

Conventions de coordonnées : objets posés (`sign`, `checkpoint`, `exit`, `beetle`, `mushroom`) → `y` = ligne juste au-dessus du sol. Objets flottants → centre de la tuile. `mover` → coin haut-gauche (largeur 3 tuiles).

L'**auto-tiling** (`Game.autotile`) choisit la tuile : surface (3 variantes), bord gauche/droit, remplissage (3 variantes), plateforme gauche/milieu/droite/seule, ronces.

## Métriques de conception

| Mesure | Valeur | Conséquence |
|---|---|---|
| Saut simple | 146 px ≈ 3 tuiles | marche de 3 = limite |
| Double saut | 248 px ≈ 5 tuiles | rebord de 4 = « mur pédagogique » |
| Course | 320 px/s | trou de 3 tuiles en saut simple, 6 en double |
| Coyote / buffer | 110 / 130 ms | tolérance de bord |

## Emerald Forest — découpage

| § | Colonnes | Intention | Éléments |
|---|---|---|---|
| 1 | 0–27 | Apprendre à bouger et sauter | 2 panneaux, cristaux en ligne, marche, trou de 3 + arc |
| 2 | 28–46 | Premier ennemi, **double saut obligatoire** | scarabée, rebord de 4 tuiles, **carte I** |
| 3 | 47–58 | Plateforme traversable, ennemi volant | rondin, feu follet, **checkpoint 1** |
| 4 | 59–74 | Fosse aux ronces | plateforme mobile horizontale, cœur en hauteur |
| 5 | 75–90 | Rythme d'ennemis | 2 scarabées, obstacle |
| 6 | 91–110 | Ascension verticale | 3 rondins en escalier, ascenseur, **carte II**, **checkpoint 2** |
| 7 | 111–126 | Vide total | 2 plateformes mobiles en relais (déphasées de 50 %) |
| 8 | 127–150 | Lecture du sol | ronces au sol, chemin haut optionnel, **carte III** |
| 9 | 151–171 | Épreuve finale | marches, fosse, 2 feux follets, **checkpoint 3** |
| 10 | 172–199 | Récompense et sortie | cristaux, cœur, portail |

Temps de référence : 150 s.

## Boss — *Le Roi Sans Visage* (Royal Palace)

Arène fermée de 30 tuiles, 2 plateformes refuges avec cœurs.

| État | Durée (phase 1 / phase 2) | Lecture |
|---|---|---|
| Marche vers le joueur | 1,8 s / 1,2 s | — |
| Élan | 0,56 s / 0,38 s | yeux blancs, corps écrasé (télégraphe) |
| Bond | jusqu'à l'impact | — |
| Impact | — | secousse + 2 ondes de choc au sol (sauter par-dessus) |
| **Sonné** | 1,9 s / 1,4 s | couronne qui brille, yeux en croix → **l'écraser** |
| Lancer | 0,9 s | 3 cartes en éventail (5 en phase 2) |

3 PV ; phase 2 quand il reste 1 PV. Victoire : +5000, portail au centre de l'arène.

## Mondes 2 à 4 — pistes de production
- **Golden Temple** : pièges à pointes temporisés, jets de flammes, plateformes qui s'effondrent, poussière dorée.
- **Crystal Laboratory** : ascenseurs à bulles, robots-engrenages, rayons de cristal à réfléchir.
- **Midnight Kingdom** : obscurité forte (darkness 0,3), champignons-tremplins, hiboux plongeurs.
