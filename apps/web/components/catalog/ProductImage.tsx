"use client";
import { useState } from "react";
import { SuitIcon } from "../Suits";

/** Photo produit : visuel de marque affiché pendant le chargement et en cas d'échec, fondu à l'arrivée de l'image. */
export default function ProductImage({ src, alt, name, small, className = "" }: { src?: string; alt: string; name: string; small?: boolean; className?: string }) {
  const [state, setState] = useState<"loading" | "ok" | "error">(src ? "loading" : "error");
  return (
    <div className={`relative h-full w-full ${className}`}>
      {state !== "ok" && (
        <div className="texture-botanique absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-vert-2 to-charbon-3 p-3 text-center" aria-hidden={state === "loading"}>
          <SuitIcon suit="spade" className={small ? "h-6 w-6 text-or/60" : "h-12 w-12 text-or/60"} />
          {!small && <span className="t-display mt-3 line-clamp-2 text-lg text-ivoire/80">{name}</span>}
        </div>
      )}
      {src && state !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" onLoad={() => setState("ok")} onError={() => setState("error")}
          className={`absolute inset-0 h-full w-full bg-ivoire object-contain p-3 transition-opacity duration-500 ${state === "ok" ? "opacity-100" : "opacity-0"}`} />
      )}
    </div>
  );
}
