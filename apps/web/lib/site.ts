/**
 * Configuration globale du site. Les champs marqués TODO doivent être fournis par L'As du CBD
 * (aucune donnée légale ou commerciale n'est inventée).
 */
export const SITE = {
  name: "L'As du CBD",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example-lasducbd.fr", // TODO domaine définitif
  eshopUrl: "https://coffeeshop-lasducbd.fr", // boutique en ligne actuelle (relevé du 19/11/2026)
  locale: "fr_FR",
  legal: {
    company: null as string | null, // TODO raison sociale
    siren: null as string | null,
    address: null as string | null,
    publisher: null as string | null, // TODO directeur de la publication
    host: null as string | null, // TODO hébergeur (nom, adresse, téléphone)
    email: null as string | null,
  },
  /** Livraison telle qu'affichée sur le site actuel (relevé du 19/11/2026) — à reconfirmer. */
  shipping: [
    "Livraison offerte en France pour les fleurs, solides et extractions.",
    "Livraison offerte dès 49 € pour les autres produits.",
    "Expédition sous 48 h, sous enveloppe neutre.",
  ],
};

export const NAV = [
  { href: "/produits", label: "Boutique en ligne" },
  { href: "/boutiques", label: "Nos boutiques" },
  { href: "/decouvrir-le-cbd", label: "Découvrir le CBD" },
  { href: "/fidelite", label: "Fidélité" },
  { href: "/actualites", label: "Journal" },
  { href: "/experience", label: "L'expérience" },
] as const;

export const FOOTER_NAV = [
  { href: "/infos-pratiques", label: "Infos pratiques" },
  { href: "/contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité & cookies" },
] as const;
