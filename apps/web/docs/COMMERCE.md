# Boutique en ligne — état et suite

## Ce qui fonctionne (prototype)
- Catalogue réel : 192 références relevées le 19/11/2026 sur les pages catégories du site actuel (noms, prix affichés, visuels, URL) → `scripts/data/*.txt` → `content/products.json` (`python3 scripts/data/build_catalog.py`). 189 publiées, 3 masquées en revue juridique (Infusbar X1/X10 : produits d'infusion ; Crystal de CBD : isolat).
- Grammages, taux de CBD/THC relevés fiche par fiche pour 7 fleurs (Zoap, Amnesia indoor, Wedding Cake, Gorilla Glue, Purple Haze USA, Blue Cheese, Lemon Haze).
- Boutique : recherche (insensible aux accents), filtres par rayon et sous-rayon, disponibilité, tri, pagination, état dans l'URL.
- Fiches : sélection du grammage, quantité, ajout au panier, produits associés, réservation en boutique, JSON-LD `Product` / `AggregateOffer`.
- Panier : tiroir + page, persistant (localStorage), retrait en boutique ou livraison, règles de livraison du site actuel.
- Commande : coordonnées, boutique de retrait ou adresse, attestation 18+, consentement ; **prix recalculés côté serveur** ; référence de commande ; transmission au webhook (`order.created`).

## Règles volontaires
- Un produit « à partir de X € » sans grammages synchronisés **ne peut pas** être mis au panier (prix ambigu) : la fiche propose la réservation en boutique. L'import WooCommerce (variations) lève ce verrou.
- Aucune description importée : les fiches actuelles contiennent des allégations de santé (ex. Lemon Haze : « efficace contre le stress », « favorise les heures de sommeil »).
- Aucun paiement n'est encaissé.

## À brancher pour la production
1. **Import complet** : `npm run import:catalog` (Store API WooCommerce : variations, stocks, attributs) depuis un poste ayant accès au site ; activer `CATALOG_STRICT_THC=true`.
2. **Paiement** : prestataire acceptant explicitement le CBD (à vérifier dans les CGU — de nombreux PSP généralistes l'excluent) ; créer la session dans `app/api/order/route.ts`, webhook de confirmation, e-mails transactionnels.
3. **Frais de port** sous le seuil de 49 € (tarif transporteur à fournir).
4. **Stock par boutique** (caisse) pour la disponibilité en magasin et le click & collect.
5. **Vérification d'âge** à la livraison (remise contre signature / pièce d'identité) — ⚖️.
6. CGV, droit de rétractation, mentions de facturation — ⚖️.

## Anomalies relevées sur le site actuel (à corriger à la source)
| Produit | Anomalie |
|---|---|
| Lemon Haze | CBD 13,6 % (encadré) vs 11 % (texte) ; allégations de santé dans la description |
| Gorilla Glue | CBD 13,9 % / THC 0,21 % (en-tête) vs 7,9 % / 0,17 % (texte) |
| Hulk | prix affiché « 0 € le g » |
| Cookie Cream CBG, Balance Gamma-100 | prix affiché « € » sans montant |
| 28 références | aucun prix affiché (ruptures probables) |
| CBD Relief Balm | « Relief » (soulagement) dans le nom : allégation implicite à revoir |
| Accessoires (sélection de 45 sur 241 importée) | plusieurs visuels sous licence (Rick & Morty, Looney Tunes, Picsou…) et produits intimes : arbitrage de positionnement à faire avec la marque |
