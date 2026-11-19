/**
 * Boutiques physiques. Villes reprises de la page « Nos shops » du site actuel (19/11/2026).
 * ⚠️ Le site actuel affiche deux listes de villes différentes : liste à confirmer par la marque.
 * Adresses, horaires, téléphones et coordonnées : null tant qu'ils ne sont pas fournis — jamais inventés.
 */
export interface Store {
  slug: string; city: string; region: string; postalCode: string | null;
  address: string | null; phone: string | null; hours: { day: string; open: string; close: string }[] | null;
  geo: { lat: number; lng: number } | null; mood: string; confirmed: boolean;
}

const base = { postalCode: null, address: null, phone: null, hours: null, geo: null, confirmed: false };
export const STORES: Store[] = [
  { slug: "rouen", city: "Rouen", region: "Normandie", mood: "Un comptoir de conseil au cœur de la ville.", ...base },
  { slug: "caen", city: "Caen", region: "Normandie", mood: "Un cabinet de curiosités botaniques.", ...base },
  { slug: "le-mans", city: "Le Mans", region: "Pays de la Loire", mood: "Un atelier, matières brutes et lumière chaude.", ...base },
  { slug: "nantes", city: "Nantes", region: "Pays de la Loire", mood: "Un jardin d'hiver, verrière et banquettes.", ...base },
  { slug: "bordeaux", city: "Bordeaux", region: "Nouvelle-Aquitaine", mood: "Un salon feutré, bois sombre et laiton.", ...base },
];
export const storeBySlug = (s: string) => STORES.find((x) => x.slug === s);

/** JSON-LD LocalBusiness : n'émet que les champs réellement renseignés. */
export function storeJsonLd(s: Store, siteUrl: string) {
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": "Store", name: `L'As du CBD ${s.city}`, url: `${siteUrl}/boutiques/${s.slug}`,
  };
  if (s.address) ld.address = { "@type": "PostalAddress", streetAddress: s.address, postalCode: s.postalCode ?? undefined, addressLocality: s.city, addressCountry: "FR" };
  else ld.areaServed = s.city;
  if (s.phone) ld.telephone = s.phone;
  if (s.geo) ld.geo = { "@type": "GeoCoordinates", latitude: s.geo.lat, longitude: s.geo.lng };
  if (s.hours) ld.openingHoursSpecification = s.hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.day, opens: h.open, closes: h.close }));
  return ld;
}
