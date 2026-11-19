import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Mentions légales" };
const v = (x: string | null) => x ?? "[À compléter par L'As du CBD]";

export default function Mentions() {
  const l = SITE.legal;
  return (
    <>
      <PageHeader title="Mentions légales" crumbs={[{ href: "/mentions-legales", label: "Mentions légales" }]} />
      <article className="prose-lux mx-auto max-w-3xl px-5 py-16 md:px-8">
        <h2>Éditeur du site</h2>
        <p>{v(l.company)} — SIREN {v(l.siren)} — {v(l.address)}. Directeur de la publication : {v(l.publisher)}. Contact : {v(l.email)}.</p>
        <h2>Hébergement</h2><p>{v(l.host)}</p>
        <h2>Conception</h2><p>Direction artistique, design et développement : DOERZ.</p>
        <h2>Produits</h2>
        <p>Les produits présentés sont issus de variétés de chanvre autorisées et présentent un taux de THC inférieur ou égal à 0,3 %. Ils ne sont pas des médicaments et ne revendiquent aucune propriété thérapeutique. Vente réservée aux personnes majeures.</p>
        <h2>Propriété intellectuelle</h2><p>Marque, logo, textes et visuels : propriété de leurs titulaires respectifs. Toute reproduction sans autorisation est interdite.</p>
      </article>
    </>
  );
}
