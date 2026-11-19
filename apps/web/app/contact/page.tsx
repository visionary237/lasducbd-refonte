import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ApiForm from "@/components/forms/ApiForm";
import { Field } from "@/components/forms/Field";
import { STORES } from "@/lib/stores";

export const metadata: Metadata = { title: "Contact", description: "Contacter L'As du CBD : question sur un produit, une boutique ou une commande." };

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Écrivez-nous." intro="Une question sur un produit, une boutique ou une commande en ligne ? Réponse sous 48 h ouvrées." crumbs={[{ href: "/contact", label: "Contact" }]} />
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <ApiForm endpoint="/api/contact" submitLabel="Envoyer" purpose="répondre à ma demande">
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Prénom" name="firstName" required autoComplete="given-name" /><Field label="E-mail" name="email" type="email" required autoComplete="email" /></div>
          <div>
            <label htmlFor="f-topic" className="text-sm font-semibold">Sujet</label>
            <select id="f-topic" name="topic" className="mt-2 w-full rounded-xl border border-ivoire/20 bg-charbon px-4 py-3">
              <option value="produit">Un produit</option><option value="commande">Une commande en ligne</option>
              {STORES.map((s) => <option key={s.slug} value={`boutique:${s.slug}`}>Boutique de {s.city}</option>)}<option value="autre">Autre</option>
            </select>
          </div>
          <Field label="Message" name="message" as="textarea" required />
        </ApiForm>
      </section>
    </>
  );
}
