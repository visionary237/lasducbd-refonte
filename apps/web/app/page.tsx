import Link from "next/link";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Engagements from "@/components/home/Engagements";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CategoryCard from "@/components/catalog/CategoryCard";
import WalletCard from "@/components/loyalty/WalletCard";
import { LinkButton } from "@/components/ui/Button";
import { BotanicalLines } from "@/components/Botanical";
import { Gentleman, SuitIcon } from "@/components/Suits";
import { visibleCategories } from "@/lib/catalog";
import { STORES } from "@/lib/stores";
import { ARTICLES } from "@/lib/articles";

export default function Home() {
  const cats = visibleCategories();
  return (
    <>
      <Hero />
      <Marquee />

      {/* Catalogue */}
      <section aria-labelledby="h-cat" className="texture-botanique mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading id="h-cat" eyebrow="Le catalogue" title="Une sélection, pas un rayon." intro="Chaque famille de produits est présentée avec ses informations techniques. Les produits à base de chanvre sont accompagnés de leur bulletin d'analyse." />
          <LinkButton href="/produits" variant="ghost">Tout le catalogue</LinkButton>
        </div>
        <Reveal className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c, i) => <CategoryCard key={c.slug} c={c} index={i} />)}
          <Link href="/decouvrir-le-cbd" className="gold-frame flex min-h-[19rem] flex-col justify-between bg-charbon-2 p-6 transition hover:bg-charbon-3">
            <span className="t-eyebrow">Premier pas</span>
            <div><p className="t-display text-3xl">Découvrir le CBD</p><p className="mt-3 text-sm text-ivoire/75">Ce qu'est le CBD, ce que dit la loi, comment lire une analyse.</p><span className="mt-5 inline-block text-sm font-bold text-or-2">Lire le guide →</span></div>
          </Link>
        </Reveal>
      </section>

      {/* Maison & engagements */}
      <section aria-labelledby="h-maison" className="surface-ivoire texture-grain relative overflow-hidden py-24 md:py-32">
        <BotanicalLines className="pointer-events-none absolute -left-20 top-0 h-full w-auto text-vert/15" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <p className="t-eyebrow mb-4">La maison</p>
            <h2 id="h-maison" className="t-display text-[clamp(2.3rem,5vw,4.4rem)] text-charbon">Quatre cartes, une seule règle du jeu.</h2>
            <p className="mt-6 text-lg leading-relaxed text-charbon/80">L'As du CBD réunit des boutiques où l'on vient chercher un produit et repart avec une explication. Retournez les cartes : elles résument ce qui ne se négocie pas.</p>
          </div>
          <Engagements />
        </div>
      </section>

      {/* Boutiques */}
      <section aria-labelledby="h-shops" className="relative overflow-hidden bg-vert py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading id="h-shops" eyebrow="Nos boutiques" title="Le conseil se vit en vrai." intro="Cinq adresses pour voir, sentir et comprendre les produits avant de choisir." />
          <Reveal as="ul" className="mt-14 divide-y divide-ivoire/10 border-y border-ivoire/10">
            {STORES.map((s, i) => (
              <li key={s.slug}>
                <Link href={`/boutiques/${s.slug}`} className="group flex items-center justify-between gap-6 py-6 transition hover:px-3">
                  <span className="flex items-baseline gap-6">
                    <span className="t-num text-2xl text-or">{String(i + 1).padStart(2, "0")}</span>
                    <span className="t-display text-4xl md:text-6xl group-hover:text-or-2">{s.city}</span>
                  </span>
                  <span className="hidden max-w-xs text-right text-sm text-ivoire/70 md:block">{s.mood}</span>
                  <span aria-hidden className="text-2xl text-or transition group-hover:translate-x-2">→</span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Fidélité */}
      <section aria-labelledby="h-fid" className="texture-botanique mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-2">
        <div>
          <SectionHeading id="h-fid" eyebrow="Programme de fidélité · proposition" title="Votre carte, dans votre téléphone." intro="Une carte Apple Wallet et Google Wallet, présentée en caisse d'un geste. Des avantages de service et d'accès plutôt que des incitations à acheter plus." />
          <div className="mt-8 flex flex-wrap gap-3"><LinkButton href="/fidelite">Découvrir le programme</LinkButton></div>
        </div>
        <div className="relative flex justify-center [perspective:1200px]">
          <WalletCard className="rotate-[-6deg] transition duration-700 hover:rotate-0" />
        </div>
      </section>

      {/* Expérience + Journal */}
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 md:px-8 md:pb-32 lg:grid-cols-[1.2fr_1fr]">
        <Link href="/experience" className="group gold-frame texture-grain relative flex min-h-[22rem] overflow-hidden bg-gradient-to-br from-vert-2 to-charbon p-8">
          <Gentleman className="absolute bottom-0 right-6 h-[90%] w-auto opacity-90 transition duration-700 group-hover:-translate-y-2" />
          <div className="relative max-w-sm self-end">
            <p className="t-eyebrow">L'expérience</p>
            <p className="t-display mt-3 text-4xl">THE LOST ACE</p>
            <p className="mt-3 text-sm text-ivoire/80">Un jeu de plateforme créé pour la maison. Une parenthèse ludique, sans produit ni achat.</p>
            <span className="mt-5 inline-block text-sm font-bold text-or-2">Jouer →</span>
          </div>
        </Link>
        <div className="grid gap-6">
          {ARTICLES.map((a) => (
            <Link key={a.slug} href={`/actualites/${a.slug}`} className="group flex flex-col justify-between rounded-2xl border border-ivoire/10 bg-charbon-2 p-6 transition hover:border-or/50">
              <span className="flex items-center gap-2 t-label text-or-2"><SuitIcon suit={a.suit} className="h-3 w-3" /> {a.category}</span>
              <span className="t-display mt-4 text-2xl group-hover:text-or-2">{a.title}</span>
              <span className="mt-2 text-sm text-ivoire/70">{a.excerpt}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
