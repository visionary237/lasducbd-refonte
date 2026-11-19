import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import AgeGate from "@/components/layout/AgeGate";
import CookieBanner from "@/components/layout/CookieBanner";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "L'As du CBD — Boutiques CBD à Rouen, Caen, Le Mans, Nantes et Bordeaux", template: "%s · L'As du CBD" },
  description: "Fleurs, extractions et accessoires à base de chanvre (THC ≤ 0,3 %), présentés avec leurs analyses. Conseil en boutique et commande en ligne. Vente réservée aux majeurs.",
  openGraph: { type: "website", locale: SITE.locale, siteName: SITE.name },
  // Prototype : non indexé tant que la refonte n'est pas validée par la marque.
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#101010" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a href="#contenu" className="skip-link">Aller au contenu</a>
        <SiteHeader />
        <main id="contenu">{children}</main>
        <SiteFooter />
        <AgeGate />
        <CookieBanner />
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: SITE.name, url: SITE.url, sameAs: [SITE.eshopUrl] }} />
      </body>
    </html>
  );
}
