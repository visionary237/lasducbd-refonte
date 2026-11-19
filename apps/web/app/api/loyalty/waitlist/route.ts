import { NextResponse } from "next/server";
import { validateWaitlist } from "@/lib/validation";
import { forwardEvent } from "@/lib/server/forward";

export async function POST(req: Request) {
  const v = validateWaitlist(await req.json().catch(() => ({})));
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  await forwardEvent("loyalty.waitlist", v.data).catch(() => null);
  return NextResponse.json({ message: "C'est noté : nous vous écrirons au lancement du programme." });
}
