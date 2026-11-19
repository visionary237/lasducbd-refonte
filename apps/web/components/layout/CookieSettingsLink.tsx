"use client";
export default function CookieSettingsLink() {
  return <button type="button" className="text-ivoire/80 underline-offset-2 hover:text-or-2 hover:underline" onClick={() => window.dispatchEvent(new Event("ladc:open-consent"))}>Gérer mes cookies</button>;
}
