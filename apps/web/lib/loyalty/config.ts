import type { Tier } from "./types";

/**
 * PROPOSITION DOERZ — L'As du CBD n'a pas de programme de fidélité aujourd'hui.
 * Paliers, seuils et avantages sont des hypothèses de travail à valider avec la marque.
 * Avantages volontairement non liés à la quantité consommée : services, accès, événements.
 */
export const LOYALTY_IS_PROPOSAL = true;
export const POINTS_RULES = { perVisit: 10, perEuro: 1, gamePlayedMonthlyCap: 0 } as const; // le jeu ne rapporte AUCUN point
export const TIERS: Tier[] = [
  { id: "valet", name: "Valet", minPoints: 0, perks: ["Carte digitale Apple Wallet / Google Wallet", "Conseil personnalisé enregistré"] },
  { id: "dame", name: "Dame", minPoints: 250, perks: ["Invitations aux soirées découverte", "Accès anticipé aux nouveautés"] },
  { id: "roi", name: "Roi", minPoints: 750, perks: ["Atelier accessoires & entretien", "Gravure offerte sur boîte de rangement"] },
  { id: "as", name: "As", minPoints: 1500, perks: ["Carte métal As de pique", "Rendez-vous conseil privé"] },
];
