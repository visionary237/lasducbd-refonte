# DOERZ × L'As du CBD — monorepo

| Dossier | Contenu |
|---|---|
| `apps/web` | Site commercial L'As du CBD (Next.js) — voir `apps/web/README.md` |
| `packages/lost-ace` | Moteur de jeu de plateforme isolé et réutilisable (Phaser 3) |

```bash
npm run install:all
npm run build       # compile le jeu, l'exporte dans le site, puis compile le site
npm test            # tests unitaires du site
npm run test:e2e    # tests de bout en bout
```
Historique : tag `concept-v1` = concept éditorial initial ; branche `refonte/site-commercial` = cette refonte.
