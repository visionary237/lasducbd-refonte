"use client";
import { useState } from "react";

/**
 * Formulaire générique : POST JSON vers une route API, consentement RGPD explicite,
 * champ piège anti-spam, messages d'état annoncés aux lecteurs d'écran.
 */
export default function ApiForm({ endpoint, submitLabel, children, purpose }: { endpoint: string; submitLabel: string; children: React.ReactNode; purpose: string }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // capturé avant l'await (currentTarget devient null ensuite)
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const r = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Erreur");
      setState("ok"); setMsg(j.message); form.reset();
    } catch (err) { setState("error"); setMsg(err instanceof Error ? err.message : "Erreur"); }
  }
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      {children}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="flex items-start gap-3 text-sm text-ivoire/80">
        <input type="checkbox" name="consent" value="yes" required className="mt-1 h-4 w-4 accent-[#C5A059]" />
        <span>J'accepte que mes données soient utilisées pour {purpose}. Elles ne sont ni vendues ni cédées. <a href="/confidentialite" className="text-or-2 underline">Politique de confidentialité</a>.</span>
      </label>
      <button disabled={state === "sending"} className="min-h-12 rounded-full bg-or px-7 font-bold text-charbon transition hover:bg-or-2 disabled:opacity-50">{state === "sending" ? "Envoi…" : submitLabel}</button>
      <p role="status" aria-live="polite" className={`text-sm ${state === "error" ? "text-or-2" : "text-ivoire/85"}`}>{state === "ok" || state === "error" ? msg : ""}</p>
    </form>
  );
}
