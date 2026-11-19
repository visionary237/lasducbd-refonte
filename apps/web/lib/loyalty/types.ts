/**
 * Domaine fidélité / CRM — contrats d'interface. Voir docs/CRM_ARCHITECTURE.md.
 * Les implémentations (Wallet, CRM, caisse) se branchent derrière ces interfaces.
 */
export type TierId = "valet" | "dame" | "roi" | "as";
export interface Tier { id: TierId; name: string; minPoints: number; perks: string[] }

export interface Member {
  id: string;                   // uuid
  createdAt: string;
  firstName?: string;
  email?: string;               // identifiant principal (magic link)
  phone?: string;
  birthYearVerified18: boolean; // contrôle de majorité déclaratif + vérif. en boutique
  homeStore?: string;           // slug boutique
  points: number;
  tier: TierId;
  consents: { email: boolean; sms: boolean; at: string };
  walletPasses: { platform: "apple" | "google"; serial: string; updatedAt: string }[];
  segments: string[];           // calculés (cf. segmentation.ts)
}

export type InteractionType = "visit" | "purchase" | "scan" | "game_played" | "newsletter_open" | "review_request";
export interface Interaction {
  id: string; memberId: string; type: InteractionType; at: string;
  storeSlug?: string; channel: "store" | "web" | "wallet" | "email" | "game";
  amountCents?: number;          // achats uniquement, issus de la caisse
  meta?: Record<string, string | number | boolean>;
}

/** Port vers le fournisseur de cartes Wallet (ex. PassKit, Passcreator, implémentation maison). */
export interface WalletProvider {
  issuePass(member: Member, platform: "apple" | "google"): Promise<{ url: string; serial: string }>;
  updatePass(member: Member): Promise<void>;
}
/** Port vers le CRM (ex. Brevo, HubSpot) — synchronisation des contacts et événements. */
export interface CrmProvider {
  upsertContact(member: Member): Promise<void>;
  trackEvent(i: Interaction): Promise<void>;
}
