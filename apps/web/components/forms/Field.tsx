export function Field({ label, name, type = "text", required, autoComplete, as, hint }: { label: string; name: string; type?: string; required?: boolean; autoComplete?: string; as?: "textarea" | "select"; hint?: string; children?: React.ReactNode }) {
  const cls = "mt-2 w-full rounded-xl border border-ivoire/20 bg-charbon px-4 py-3 text-ivoire placeholder:text-ivoire/40 focus:border-or focus:outline-none";
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">{label}{required && <span aria-hidden className="text-or"> *</span>}</label>
      {as === "textarea" ? <textarea id={id} name={name} required={required} rows={5} className={cls} /> : <input id={id} name={name} type={type} required={required} autoComplete={autoComplete} className={cls} aria-describedby={hint ? `${id}-h` : undefined} />}
      {hint && <p id={`${id}-h`} className="mt-1 text-xs text-ivoire/65">{hint}</p>}
    </div>
  );
}
