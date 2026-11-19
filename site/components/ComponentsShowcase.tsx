"use client";
import SectionHeading from "./ui/SectionHeading";
import { Button, LinkButton } from "./ui/Button";
import Tag from "./ui/Tag";
import Notice from "./ui/Notice";
import FlipCard from "./ui/FlipCard";
import { CardFace } from "./ui/PlayingCard";

export default function ComponentsShowcase() {
  return (
    <section id="composants" aria-labelledby="composants-titre" className="bg-emeraude/25 px-6 py-28 md:px-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="composants-titre" eyebrow="Composants" title="Une boîte à outils réutilisable" />
        <p className="mt-6 max-w-2xl text-ivoire/75">
          Extraits du design system. Chaque composant est documenté (props, états, accessibilité) sur la page dédiée.
        </p>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <Spec name="Button / LinkButton" path="components/ui/Button.tsx">
            <div className="flex flex-wrap gap-3">
              <Button>Primaire</Button>
              <Button variant="ghost">Secondaire</Button>
              <Button variant="accent">Accent</Button>
              <Button disabled>Désactivé</Button>
            </div>
          </Spec>
          <Spec name="Tag" path="components/ui/Tag.tsx">
            <div className="flex flex-wrap gap-2"><Tag>Art déco</Tag><Tag tone="bordeaux">Concept</Tag><Tag tone="ivoire">Rouen</Tag></div>
          </Spec>
          <Spec name="Notice" path="components/ui/Notice.tsx">
            <Notice title="Information">Mention de cadrage, rôle « note ».</Notice>
          </Spec>
          <Spec name="CardFace" path="components/ui/PlayingCard.tsx">
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-[5/7]"><CardFace rank="A" suit="spade" title="As" /></div>
              <div className="aspect-[5/7]"><CardFace rank="R" suit="heart" title="Roi" tone="onyx" /></div>
              <div className="aspect-[5/7]"><CardFace rank="D" suit="diamond" title="Dame" tone="ivoire" /></div>
            </div>
          </Spec>
          <Spec name="FlipCard" path="components/ui/FlipCard.tsx">
            <div className="mx-auto w-36">
              <FlipCard label="Carte démo" front={<CardFace rank="V" suit="club" title="Valet" />} back={<div className="deco-frame flex h-full items-center justify-center bg-bordeaux p-4 text-center text-sm">Verso : contenu libre</div>} />
            </div>
          </Spec>
          <Spec name="SectionHeading" path="components/ui/SectionHeading.tsx">
            <p className="t-eyebrow">Sur-titre</p>
            <p className="t-display text-4xl">Titre révélé mot à mot</p>
          </Spec>
        </div>
        <div className="mt-12"><LinkButton href="design-system/" variant="ghost">Ouvrir le design system complet →</LinkButton></div>
      </div>
    </section>
  );
}

function Spec({ name, path, children }: { name: string; path: string; children: React.ReactNode }) {
  return (
    <div className="deco-frame flex flex-col gap-5 bg-onyx p-6">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold">{name}</h3>
        <code className="truncate text-[0.65rem] text-ivoire/60">{path}</code>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
