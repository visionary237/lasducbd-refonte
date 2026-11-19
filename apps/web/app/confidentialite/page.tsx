import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import CookieSettingsLink from "@/components/layout/CookieSettingsLink";

export const metadata: Metadata = { title: "Confidentialité & cookies" };

export default function Confidentialite() {
  return (
    <>
      <PageHeader title="Confidentialité & cookies" intro="Ce que nous collectons, pourquoi, combien de temps, et comment exercer vos droits." crumbs={[{ href: "/confidentialite", label: "Confidentialité" }]} />
      <article className="prose-lux mx-auto max-w-3xl px-5 py-16 md:px-8">
        <h2>Responsable du traitement</h2><p>L'As du CBD — coordonnées à compléter (voir mentions légales).</p>
        <h2>Données traitées</h2>
        <ul>
          <li>Formulaire de contact : prénom, e-mail, message — pour répondre à votre demande. Conservation : 12 mois.</li>
          <li>Réservation en boutique : prénom, e-mail, boutique, produit, attestation de majorité — pour préparer la réservation. Conservation : 3 mois.</li>
          <li>Liste d'attente fidélité : e-mail — pour vous informer une fois du lancement. Conservation : jusqu'au lancement ou désinscription.</li>
          <li>Programme de fidélité (à venir) : données de compte, historique de visites et d'achats en boutique, paliers — base légale : contrat ; communications marketing uniquement avec consentement.</li>
        </ul>
        <h2>Ce que nous ne faisons pas</h2>
        <ul><li>Aucune vente ni cession de données.</li><li>Aucun traceur publicitaire sans votre accord.</li><li>Le jeu « THE LOST ACE » ne collecte aucune donnée : les scores restent dans votre navigateur.</li></ul>
        <h2>Cookies</h2>
        <p>Par défaut, seuls les éléments nécessaires sont utilisés (mémorisation de votre réponse au contrôle d'âge et de vos choix de cookies). La mesure d'audience et la personnalisation ne sont activées qu'avec votre consentement, valable 6 mois. <CookieSettingsLink /></p>
        <h2>Vos droits</h2>
        <p>Accès, rectification, effacement, opposition, limitation, portabilité : écrivez-nous via la page contact. Vous pouvez saisir la CNIL (cnil.fr).</p>
      </article>
    </>
  );
}
