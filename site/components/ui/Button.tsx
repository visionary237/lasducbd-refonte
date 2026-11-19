import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "accent";
const styles: Record<Variant, string> = {
  primary: "bg-or text-onyx hover:bg-or-2",
  ghost: "border border-ivoire/30 text-ivoire hover:border-or",
  accent: "bg-bordeaux text-ivoire hover:brightness-110",
};
const base = "inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold transition duration-300 disabled:opacity-40";

export function Button({ variant = "primary", className = "", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...p} />;
}
export function LinkButton({ variant = "primary", className = "", ...p }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={`${base} ${styles[variant]} ${className}`} {...p} />;
}
