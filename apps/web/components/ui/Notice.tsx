/** Mention de cadrage ou d'information réglementaire. */
export default function Notice({ title, children, tone = "info" }: { title: string; children: React.ReactNode; tone?: "info" | "warn" }) {
  const t = tone === "warn" ? "border-or/60 bg-or/10" : "border-ivoire/15 bg-ivoire/[0.04]";
  return (
    <aside role="note" className={`flex gap-4 rounded-2xl border p-5 text-sm leading-relaxed text-ivoire/85 ${t}`}>
      <span className="mt-0.5 text-or" aria-hidden>♠</span>
      <div><strong className="block text-ivoire">{title}</strong>{children}</div>
    </aside>
  );
}
