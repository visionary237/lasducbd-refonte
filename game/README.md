# THE LOST ACE

Jeu de plateforme 2D pour navigateur — projet portfolio **indépendant** de DOERZ.
Un élégant Gentleman de Pique traverse cinq mondes fantastiques pour retrouver des cartes anciennes et des cristaux magiques.

> Univers, personnages et ennemis fictifs. **Aucun placement de produit, aucun coupon, aucune récompense liée à un achat, aucune collecte de données** : tout est stocké localement (`localStorage`) et rien ne quitte l'appareil.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build dans dist/ (statique, chemin relatif)
npm run preview    # http://localhost:4174
```

Paramètres d'URL : `?level=level1` ou `?level=boss` (lancement direct) · `?debug` (corps physiques) · `?canvas` (rendu Canvas 2D au lieu de WebGL).

## Contrôles

| Action | Clavier | Tactile |
|---|---|---|
| Se déplacer | ← → · A/D · Q/D (AZERTY) | ◀ ▶ (bas gauche) |
| Sauter / double saut | Espace · ↑ · W · Z (2ᵉ appui en l'air) | SAUT (bas droite) |
| Saut court | relâcher tôt | relâcher tôt |
| Écraser un ennemi | retomber dessus | idem |
| Pause | P · Échap | bouton PAUSE |
| Son on/off | M | lien « Son » |
| Recommencer le niveau | R | menu pause |
| Menus | ↑ ↓ ← → Entrée | toucher |

## Contenu jouable

| Monde | Statut |
|---|---|
| I · Emerald Forest — « Le sentier des lucioles » | **Niveau complet** (200 tuiles, 3 checkpoints, 3 cartes, 69 cristaux, 2 cœurs, 4 plateformes mobiles, scarabées & feux follets) |
| II · Golden Temple | Monde configuré (palette, décors procéduraux, tileset) — niveau à produire |
| III · Crystal Laboratory | idem |
| IV · Midnight Kingdom | idem |
| V · The Royal Palace | **Arène du boss jouable** (prototype) : *Le Roi Sans Visage* |

## Architecture

```
src/
  main.ts                 configuration Phaser (Arcade, FIT 1280×720, 3 pointeurs)
  constants.ts            dimensions, physique, barème de score, palette
  config/worlds.ts        ★ définition data-driven des 5 mondes (palette, parallaxe, ambiance, ennemis, temps de référence)
  levels/
    types.ts              LevelData, Entity, codes de cellules
    LevelBuilder.ts       ★ DSL de construction (ground, platform, thorns, arc, add…)
    level1.ts             Emerald Forest
    boss.ts               arène du Palais
    index.ts              registre levelKey → LevelData
  art/                    génération procédurale des textures (remplaçables 1:1, cf. docs/ASSETS.md)
    characters.ts         joueur (12 frames), scarabée, feu follet, boss
    props.ts              cristaux, cartes, lanternes, portail, UI cartes à jouer, particules
    world.ts              tileset auto-tilé + 4 couches de parallaxe par monde
  objects/                Player, Enemies (Beetle, Wisp), MovingPlatform, Boss
  systems/                Controls (clavier + tactile), Audio (WebAudio), Storage (localStorage)
  scenes/                 Boot → Menu → Game (+ HUD en surimpression, Pause) → LevelEnd
scripts/                  qa.mjs (captures), bot.mjs (playtest automatique), boss-test.mjs
docs/                     LEVEL_DESIGN.md · ASSETS.md
```

**Principe clé** : `scenes/Game.ts` ne contient aucune logique propre à un monde. Il lit un `LevelData` et un `WorldDef`, auto-tile la grille, instancie les entités, la parallaxe, l'ambiance et l'éclairage. Ajouter un niveau = un fichier dans `levels/` + `levelKey` dans `worlds.ts`.

### Ajouter un monde (ex. Golden Temple)
1. Créer `src/levels/level2.ts` avec `LevelBuilder` (voir `docs/LEVEL_DESIGN.md`).
2. L'enregistrer dans `levels/index.ts` : `{ level2: LEVEL2 }`.
3. Dans `config/worlds.ts`, mettre `levelKey: "level2"` sur `golden-temple`.
4. Débloquer : `Storage.unlock("golden-temple")` (ex. en fin de niveau 1). Les ennemis spécifiques (`spikeTrap`, `flameJet`) s'ajoutent dans `objects/` et dans le `switch` de `Game.spawn()`.

## Systèmes

- **Game feel** : accélération/freinage, *coyote time* 110 ms, *buffer* de saut 130 ms, hauteur variable, double saut avec vrille et traînée d'étincelles, squash & stretch, secousse caméra, invulnérabilité clignotante.
- **Vies** : 3 points de vie (piques) par vie, 3 vies. Coup = −1 PV ; chute = −1 vie ; reprise au dernier checkpoint (lanterne).
- **Score & combos** : cristal 100, ennemi 250, carte 1000, ×combo (jusqu'à ×8) si les actions s'enchaînent en moins de 2,4 s ; bonus de fin = temps sous le temps de référence × 20 + 500 par vie restante.
- **Classement local** : top 10, initiales façon arcade (3 caractères), par appareil.
- **Éclairage dynamique** : voile sombre (RenderTexture) percé chaque frame par des lumières (joueur, champignons, feux follets, cartes, lanternes, portail) + halos additifs + liseré lumineux (preFX) sur le joueur.
- **Parallaxe** : ciel fixe + 3 couches (0,12 / 0,32 / 0,62) + premier plan à 1,08–1,25 ; rayons de lumière animés ; particules d'ambiance par monde (lucioles, poussière, bulles, spores, braises) ; feuilles qui tombent.
- **Audio** : 14 effets synthétisés en WebAudio, désactivables, réglage persistant.
- **Accessibilité** : commandes AZERTY/QWERTY, menus 100 % clavier, option « effets lumineux réduits » (pause), pause automatique à la perte de focus.

## Tests réalisés

- `npm run build` : TypeScript strict sans erreur.
- `scripts/bot.mjs` : un bot parcourt le niveau 1 — sections 0→110 sans mort, 110→197 atteintes (2 chutes sur les plateformes en relais), aucune erreur console. Il a révélé un défaut corrigé (zone de portail trop basse franchie en saut).
- `scripts/boss-test.mjs` : 3 écrasements pendant l'état « sonné » → PV 2, 1, 0 → portail affiché.
- `scripts/qa.mjs` : 18 captures (menu, mondes, sections du niveau, bilan, boss, mobile tactile), 0 erreur console.
- Mesure des sauts : simple 146 px (≈ 3 tuiles), double 248 px (≈ 5 tuiles).

## Performances

Bundle ~1,28 Mo (357 ko gzip, Phaser inclus). Textures générées au démarrage (< 1 s). Les lumières hors écran sont ignorées. Pour les machines modestes : option « effets réduits » (supprime le voile d'éclairage et le liseré).
