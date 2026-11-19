/**
 * Transmission des événements vers l'outil d'automatisation (ex. webhook n8n / Make)
 * qui orchestre CRM, e-mails et Wallet. Sans CRM_WEBHOOK_URL : rien n'est stocké (mode prototype).
 */
export async function forwardEvent(type: string, payload: Record<string, unknown>) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return { forwarded: false };
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...(process.env.CRM_WEBHOOK_SECRET ? { "x-webhook-secret": process.env.CRM_WEBHOOK_SECRET } : {}) },
    body: JSON.stringify({ type, at: new Date().toISOString(), payload }),
  });
  return { forwarded: r.ok };
}
