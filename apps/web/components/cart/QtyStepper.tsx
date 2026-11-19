"use client";
import { MAX_QTY } from "@/lib/cart";
export default function QtyStepper({ value, onChange, label, min = 0 }: { value: number; onChange: (v: number) => void; label: string; min?: number }) {
  return (
    <div className="inline-flex items-center rounded-full border border-ivoire/25" role="group" aria-label={`Quantité pour ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} className="h-9 w-9 rounded-full text-lg disabled:opacity-30" aria-label="Diminuer">−</button>
      <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} className="h-9 w-9 rounded-full text-lg disabled:opacity-30" aria-label="Augmenter">+</button>
    </div>
  );
}
