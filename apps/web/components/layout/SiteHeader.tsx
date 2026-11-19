"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV } from "@/lib/site";
import { SuitIcon } from "../Suits";

export default function SiteHeader() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); btn.current?.focus(); }
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a,button"); const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); document.documentElement.style.overflow = ""; };
  }, [open]);

  const active = (href: string) => path === href || path.startsWith(href + "/");

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || open ? "bg-charbon/90 backdrop-blur-md" : "bg-gradient-to-b from-charbon/70 to-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="L'As du CBD — accueil">
          <SuitIcon suit="spade" className="h-7 w-7 text-or" />
          <span className="t-display text-xl tracking-[0.2em] uppercase">L'As du CBD</span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={active(n.href) ? "page" : undefined}
                  className={`relative py-2 transition hover:text-or-2 ${active(n.href) ? "text-or-2" : "text-ivoire/85"} after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-or after:transition-transform ${active(n.href) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/boutiques" className="hidden rounded-full bg-or px-5 py-2.5 text-sm font-bold text-charbon transition hover:bg-or-2 sm:inline-flex">Trouver une boutique</Link>
          <button ref={btn} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu-mobile" className="flex h-11 w-11 items-center justify-center rounded-full border border-ivoire/25 lg:hidden">
            <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <span aria-hidden className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-px w-5 bg-ivoire transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-5 bg-ivoire transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div id="menu-mobile" ref={panel} role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reduce ? 0 : 0.35 }}
            className="texture-botanique h-[calc(100svh-4rem)] overflow-y-auto bg-charbon px-6 pb-10 pt-6 lg:hidden">
            <ul className="space-y-1">
              {NAV.map((n, i) => (
                <motion.li key={n.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduce ? 0 : 0.05 * i }}>
                  <Link href={n.href} className="flex items-center justify-between border-b border-ivoire/10 py-4 t-display text-3xl">
                    {n.label} <SuitIcon suit={(["spade", "heart", "diamond", "club"] as const)[i % 4]} className="h-4 w-4 text-or" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Link href="/boutiques" className="mt-8 flex justify-center rounded-full bg-or px-6 py-4 font-bold text-charbon">Trouver une boutique</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
