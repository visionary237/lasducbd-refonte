# Conformité — contenus CBD, RGPD, accessibilité

> Synthèse technique établie le 19/11/2026. **Ce n'est pas un avis juridique** : chaque point marqué ⚖️ doit être validé par un juriste avant la mise en ligne.

## 1. Cadre réglementaire pris en compte

| Sujet | État au 19/11/2026 | Traduction dans le site |
|---|---|---|
| Fleurs & feuilles (THC ≤ 0,3 %) | Vente autorisée : le Conseil d'État a annulé l'interdiction le 29/12/2022 | Catégorie publiée ; une fiche n'est publiée que si le THC est renseigné et ≤ 0,3 % (`isPublishable`) |
| Denrées alimentaires au CBD (huiles à ingérer, infusions, confiseries, compléments) | Retrait depuis le 15/05/2026 (DGAL, règlement Novel Food UE 2015/2283) ; référé rejeté par le Conseil d'État le 10/07/2026 | Catégorie **Huiles** en `legal-review` : masquée, 404, hors sitemap. ⚖️ Statut éventuel « cosmétique à usage externe » à valider produit par produit |
| Allégations de santé / thérapeutiques | Interdites | Vérificateur `lib/compliance.ts` exécuté sur tout le contenu (`npm run check:compliance`, inclus dans `npm test`) |
| Produits du vapotage (E-CBD) | ⚖️ Règles de publicité spécifiques à vérifier | Catégorie `restricted-ads` : présentée à titre informatif, aucune mise en avant |
| Mineurs | ⚖️ Pas d'interdiction générale codifiée pour le CBD en tant que tel, mais engagement de la marque | Contrôle d'âge 18+ déclaratif, mentions « réservé aux majeurs », attestation 18+ dans les formulaires, contrôle de pièce d'identité en boutique |

Mentions portées sur le site (pied de page, fiches) : vente réservée aux majeurs ; pas un médicament, aucune propriété thérapeutique revendiquée ; déconseillé aux femmes enceintes ou allaitantes ; ne pas conduire après usage (traces de THC détectables) ; ne pas ingérer.

## 2. Vérificateur éditorial (`lib/compliance.ts`)
Familles de règles : allégation thérapeutique, pathologie/symptôme, promesse d'effet, incitation/banalisation, ciblage des mineurs. Les tournures de mise en garde (« aucune propriété thérapeutique », « n'est pas un médicament ») sont tolérées. Toute nouvelle page, catégorie, fiche importée ou article passe le test ; un échec bloque la CI.

## 3. Contenus non inventés
- Aucun produit, prix, avis client, adresse, horaire ou numéro de téléphone n'a été rédigé. Les champs absents affichent « à importer » / « à fournir ».
- Catégories, liens boutique en ligne et conditions de livraison : relevés sur le site actuel le 19/11/2026.
- Programme de fidélité : présenté explicitement comme **proposition DOERZ**.
- Visuel du hero : image de moodboard fournie, à remplacer par un shooting (cf. `ASSETS.md`).

## 4. RGPD
- Bandeau de consentement : « Tout refuser » au même niveau que « Tout accepter », aucun traceur avant consentement, durée 6 mois, version de consentement, réouverture depuis le pied de page et la page Confidentialité.
- Formulaires : finalité affichée, case de consentement non pré-cochée, champ piège anti-spam, données transmises uniquement au webhook CRM si configuré (`CRM_WEBHOOK_URL`), sinon rien n'est stocké.
- Jeu : aucune donnée collectée, scores en local.
- ⚖️ À compléter : mentions légales (éditeur, hébergeur), registre des traitements, contrats de sous-traitance (CRM, Wallet, hébergeur), durées de conservation définitives.

## 5. Accessibilité
WCAG 2.2 AA visé : axe-core sans violation sur 6 pages types (desktop + mobile), navigation clavier, focus visible, dialogues modaux avec piège du focus, `prefers-reduced-motion` respecté, contrastes vérifiés (`DESIGN_SYSTEM.md`).
