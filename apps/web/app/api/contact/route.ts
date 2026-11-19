import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validation";
import { forwardEvent } from "@/lib/server/forward";

export async function POST(req: Request) {
  const raw = await req.json().catch(() => ({}));
  const v = validateContact(raw);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  await forwardEvent("contact.created", v.data).catch(() => null);
  return NextResponse.json({ message: "Merci, votre message a bien été transmis. Réponse sous 48 h ouvrées." });
}
