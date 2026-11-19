import { NextResponse } from "next/server";
import { validateReservation } from "@/lib/validation";
import { forwardEvent } from "@/lib/server/forward";
import { STORES } from "@/lib/stores";

export async function POST(req: Request) {
  const raw = await req.json().catch(() => ({}));
  const v = validateReservation(raw, STORES.map((s) => s.slug));
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  await forwardEvent("reservation.created", v.data).catch(() => null);
  return NextResponse.json({ message: "Demande envoyée. La boutique vous confirmera la mise de côté par e-mail." });
}
