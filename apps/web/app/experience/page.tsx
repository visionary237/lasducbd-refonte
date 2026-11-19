import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import Notice from "@/components/ui/Notice";
import GameFrame from "./GameFrame";

export const metadata: Metadata = { title: "L'expérience — THE LOST ACE", description: "Un jeu de plateforme créé pour L'As du CBD : une parenthèse ludique, sans produit ni achat." };

export default function Experience() {
  return (
    <>
      <PageHeader eyebrow="L'expérience" title="THE LOST ACE" intro="Un gentleman à tête de pique part à la recherche de cartes anciennes à travers cinq mondes. Une parenthèse ludique, sans produit, sans achat, sans collecte de données." crumbs={[{ href: "/experience", label: "L'expérience" }]} />
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <GameFrame />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Notice title="Commandes">Clavier : ← → pour avancer, Espace pour sauter (deux fois pour un double saut), P pour la pause, M pour le son. Sur mobile : boutons tactiles à l'écran.</Notice>
          <Notice title="Cadre">Expérience secondaire, chargée uniquement sur cette page. Les scores restent sur votre appareil et ne donnent droit à aucune récompense commerciale.</Notice>
        </div>
      </section>
    </>
  );
}
