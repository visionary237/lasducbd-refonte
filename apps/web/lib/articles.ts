/**
 * Journal (actualités & pédagogie). Contenus factuels, sourcés, relus par le vérificateur de conformité.
 * Format simple : blocs { h2 | p | ul }. Peut être remplacé par un CMS (Sanity, Strapi, WordPress headless).
 */
export type Block = { h2: string } | { p: string } | { ul: string[] };
export interface Article {
  slug: string; title: string; excerpt: string; date: string; category: "Réglementation" | "Guide" | "Maison";
  suit: "spade" | "heart" | "diamond" | "club"; blocks: Block[]; sources: { label: string; url: string }[];
}

export const ARTICLES: Article[] = [
  {
    slug: "cadre-legal-cbd-france-2026",
    title: "Le cadre légal du CBD en France, point d'étape 2026",
    excerpt: "Fleurs, extractions, produits alimentaires : ce qui est autorisé à la vente, et ce qui ne l'est plus depuis mai 2026.",
    date: "2026-11-19", category: "Réglementation", suit: "spade",
    blocks: [
      { p: "Le cannabidiol (CBD) est une molécule issue du chanvre. En France, les produits qui en contiennent doivent provenir de variétés autorisées et présenter un taux de THC inférieur ou égal à 0,3 %." },
      { h2: "Fleurs et feuilles : autorisées" },
      { p: "Un arrêté du 30 décembre 2021 interdisait la vente aux consommateurs des fleurs et feuilles brutes. Le Conseil d'État l'a annulé le 29 décembre 2022, jugeant cette interdiction générale et absolue disproportionnée pour des plantes sans propriétés stupéfiantes." },
      { h2: "Produits alimentaires : retirés depuis le 15 mai 2026" },
      { p: "Depuis le 15 mai 2026, la Direction générale de l'alimentation applique strictement le règlement européen « Novel Food » (UE 2015/2283) : les denrées destinées à être ingérées et contenant du CBD (huiles à avaler, infusions, bonbons, compléments) ne peuvent plus être commercialisées faute d'autorisation européenne. Une demande de suspension en référé a été rejetée par le Conseil d'État le 10 juillet 2026." },
      { h2: "Ce que cela change en boutique" },
      { ul: [
        "Les fleurs, résines et extractions à faible teneur en THC restent proposées, avec leur bulletin d'analyse.",
        "Les cosmétiques à usage externe ne sont pas concernés par l'interdiction alimentaire.",
        "Aucun produit n'est présenté comme ayant un effet sur la santé : la loi l'interdit, et nous ne le faisons pas.",
        "La vente est réservée aux personnes majeures dans nos boutiques.",
      ] },
    ],
    sources: [
      { label: "Conseil d'État — communiqué du 29/12/2022", url: "https://conseil-etat.fr/content/download/179139/document/cp_fleurs_cbd_fond_web.pdf" },
      { label: "Conseil d'État — ordonnance du 10/07/2026 n° 516668", url: "https://www.conseil-etat.fr/fr/arianeweb/CE/decision/2026-07-10/516668" },
      { label: "Vidal — compléments alimentaires à base de CBD", url: "https://www.vidal.fr/actualites/37840-complements-alimentaires-a-base-de-cbd-non-autorises-en-union-europeenne.html" },
    ],
  },
  {
    slug: "lire-un-bulletin-d-analyse",
    title: "Comment lire un bulletin d'analyse",
    excerpt: "Taux de CBD, taux de THC, laboratoire, numéro de lot : les quatre lignes à vérifier avant tout achat.",
    date: "2026-11-12", category: "Guide", suit: "diamond",
    blocks: [
      { p: "Chaque produit à base de chanvre de notre catalogue est rattaché à un bulletin d'analyse établi par un laboratoire. C'est la meilleure garantie de transparence : voici comment le lire." },
      { h2: "1. Le taux de THC" },
      { p: "C'est la ligne réglementaire. Il doit être inférieur ou égal à 0,3 %. Un produit sans analyse lisible n'est pas publié sur ce site." },
      { h2: "2. Le taux de CBD" },
      { p: "Il décrit la composition du produit. Il ne dit rien d'un quelconque effet : c'est une donnée de composition, pas une promesse." },
      { h2: "3. Le laboratoire et la date" },
      { p: "Le nom du laboratoire et la date d'analyse doivent figurer sur le document. Une analyse ancienne ou anonyme doit éveiller la vigilance." },
      { h2: "4. Le numéro de lot" },
      { p: "Il permet de relier l'analyse au sachet que vous avez en main. En boutique, nos conseillers peuvent vous le montrer." },
    ],
    sources: [],
  },
];
export const articleBySlug = (s: string) => ARTICLES.find((a) => a.slug === s);
