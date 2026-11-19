import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import JsonLd from "@/components/JsonLd";
import { ARTICLES, articleBySlug } from "@/lib/articles";
import { SITE } from "@/lib/site";

export function generateStaticParams() { return ARTICLES.map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = articleBySlug((await params).slug);
  return a ? { title: a.title, description: a.excerpt, openGraph: { type: "article", publishedTime: a.date } } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();
  return (
    <>
      <PageHeader eyebrow={a.category} title={a.title} intro={a.excerpt} crumbs={[{ href: "/actualites", label: "Journal" }, { href: `/actualites/${a.slug}`, label: a.title }]} />
      <article className="prose-lux mx-auto max-w-3xl px-5 py-16 md:px-8">
        <time dateTime={a.date} className="t-label text-or-2">{new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</time>
        {a.blocks.map((b, i) => "h2" in b ? <h2 key={i}>{b.h2}</h2> : "p" in b ? <p key={i}>{b.p}</p> : <ul key={i}>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>)}
        {a.sources.length > 0 && (<><h2>Sources</h2><ul>{a.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.label}</a></li>)}</ul></>)}
      </article>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: a.title, datePublished: a.date, author: { "@type": "Organization", name: SITE.name }, mainEntityOfPage: `${SITE.url}/actualites/${a.slug}` }} />
    </>
  );
}
