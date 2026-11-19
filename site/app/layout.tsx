import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: "L'As du CBD — Concept d'identité digitale · DOERZ",
  description: "Refonte conceptuelle indépendante et non commanditée de l'identité digitale de L'As du CBD, par DOERZ.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#101714" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="grain">
        <a href="#contenu" className="skip-link">Aller au contenu</a>
        {children}
      </body>
    </html>
  );
}
