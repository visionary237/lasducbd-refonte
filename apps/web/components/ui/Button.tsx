import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "light" | "dark";
const styles: Record<Variant, string> = {
  primary: "bg-or text-charbon hover:bg-or-2",
  ghost: "border border-ivoire/30 text-ivoire hover:border-or hover:text-or-2",
  light: "bg-ivoire text-charbon hover:bg-ivoire-2",
  dark: "bg-charbon text-ivoire hover:bg-vert",
};
const base = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-wide transition duration-300 disabled:cursor-not-allowed disabled:opacity-40";

export function Button({ variant = "primary", className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...p} />;
}
export function LinkButton({ variant = "primary", className = "", href, external, ...p }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string; external?: boolean }) {
  if (external) return <a href={href} target="_blank" rel="noopener" className={`${base} ${styles[variant]} ${className}`} {...p} />;
  return <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...(p as any)} />;
}
