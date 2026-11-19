"use client";
import { useCart } from "./CartProvider";
export default function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button onClick={() => setOpen(true)} className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ivoire/25 transition hover:border-or" aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
      {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-or px-1 text-[0.65rem] font-bold text-charbon">{count}</span>}
    </button>
  );
}
