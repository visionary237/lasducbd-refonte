# Fidélisation & CRM — architecture cible

Statut : **contrats d'interface et squelette en place, fournisseurs non branchés.** Le programme lui-même est une proposition DOERZ à valider.

## Vue d'ensemble

```
 Client ─┬─ Site (Next.js) ── /api/loyalty/* ──┐
         ├─ Carte Wallet (Apple / Google) ◄────┤ push de mise à jour
         └─ Boutique : scan QR / NFC ──► Dashboard commerçant ─► /api/loyalty/scan
                                                │
                                     Base membres (Postgres)
                                                │ événements
                                 Orchestrateur d'automatisations (n8n / Make)
                                   ├─ CRM (Brevo, HubSpot…) : contacts, segments, e-mails
                                   ├─ Fournisseur Wallet (PassKit, Passcreator ou maison)
                                   └─ Caisse (import des achats, jamais saisis à la main)
```

## Briques

| Brique | Rôle | Dans le code |
|---|---|---|
| Modèle de données | `Member`, `Interaction`, `Tier` | `lib/loyalty/types.ts` |
| Règles | paliers, points, segmentation RFM légère | `lib/loyalty/rules.ts` (testé) · `lib/loyalty/config.ts` |
| Identification client | lien magique par e-mail (sans mot de passe) ; majorité contrôlée en boutique (`birthYearVerified18`) | à implémenter (Auth.js / Clerk) |
| Carte Wallet | Apple : `.pkpass` signé avec un certificat Pass Type ID ; Google : objet `LoyaltyObject` + JWT « Save to Google Wallet » ; QR = numéro de série opaque | contrat `WalletProvider`, route `/api/loyalty/pass/[platform]` (501) |
| QR / NFC | le QR du pass contient un *serial* opaque (aucune donnée personnelle) ; NFC via Apple VAS / Google Smart Tap (nécessite un terminal compatible) | `/api/loyalty/scan` (501) |
| Dashboard commerçant | vue boutique : scan, fiche membre (prénom, palier, dernière visite), conseil enregistré ; statistiques par boutique | à construire (`/pro`, accès par jeton boutique) |
| CRM & automatisations | upsert contacts, événements, campagnes | contrat `CrmProvider` ; `lib/server/forward.ts` envoie déjà `contact.created`, `reservation.created`, `loyalty.waitlist` au webhook `CRM_WEBHOOK_URL` |
| Suivi des interactions | `Interaction` (visit, purchase, scan, newsletter_open…) horodatées, par canal | types prêts |

## Scénarios d'automatisation proposés (n8n)
1. **Bienvenue** : inscription → envoi du lien Wallet → rappel J+3 si la carte n'est pas ajoutée.
2. **Changement de palier** : mise à jour du pass (push) + e-mail (si consentement).
3. **Réservation** : formulaire → notification à la boutique (e-mail / Slack) → confirmation au client → relance si non retiré à 48 h.
4. **Réactivation** : segment `tiède-90j` → invitation à un événement en boutique (jamais de promotion sur la consommation).
5. **Avis Google** : après une visite scannée, invitation unique à laisser un avis (sans contrepartie, conformément aux règles des plateformes).

## Garde-fous
- Aucun point ni avantage lié au jeu (`pointsFor("game_played") = 0`).
- Avantages orientés service/accès, pas volume.
- Marketing uniquement avec consentement explicite (segment `sans-consentement-marketing` exclu des campagnes).
- Minimisation : pas de date de naissance stockée, uniquement l'attestation de majorité vérifiée.
