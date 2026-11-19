export default function Tag({ children, tone = "or" }: { children: React.ReactNode; tone?: "or" | "bordeaux" | "ivoire" }) {
  const t = { or: "border-or/50 text-or", bordeaux: "border-bordeaux text-ivoire bg-bordeaux/30", ivoire: "border-ivoire/30 text-ivoire/80" }[tone];
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${t}`}>{children}</span>;
}
