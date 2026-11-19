export default function Tag({ children, tone = "or" }: { children: React.ReactNode; tone?: "or" | "vert" | "ivoire" }) {
  const t = { or: "border-or/50 text-or-2", vert: "border-vert-3 bg-vert-2 text-ivoire", ivoire: "border-ivoire/25 text-ivoire/80" }[tone];
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] ${t}`}>{children}</span>;
}
