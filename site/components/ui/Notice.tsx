/** Mention de cadrage (concept / information). Bordeaux = signal. */
export default function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="flex gap-4 rounded-2xl border border-bordeaux/70 bg-bordeaux/15 p-5 text-sm leading-relaxed text-ivoire/85" role="note">
      <span className="mt-0.5 text-or" aria-hidden>◆</span>
      <div><strong className="block text-ivoire">{title}</strong>{children}</div>
    </aside>
  );
}
