import { describe, expect, it } from "vitest";
import { tierFor, nextTier, pointsFor, segmentsFor } from "@/lib/loyalty/rules";
import type { Member, Interaction } from "@/lib/loyalty/types";

const member: Member = { id: "m1", createdAt: "2026-01-01", birthYearVerified18: true, homeStore: "rouen", points: 0, tier: "valet", consents: { email: false, sms: false, at: "2026-01-01" }, walletPasses: [], segments: [] };
const ev = (type: Interaction["type"], at: string, amountCents?: number): Interaction => ({ id: at, memberId: "m1", type, at, channel: "store", amountCents });

describe("fidélité", () => {
  it("calcule le palier et le suivant", () => {
    expect(tierFor(0).id).toBe("valet");
    expect(tierFor(250).id).toBe("dame");
    expect(tierFor(5000).id).toBe("as");
    expect(nextTier(700)).toMatchObject({ tier: { id: "roi" }, missing: 50 });
    expect(nextTier(1500)).toBeNull();
  });
  it("ne donne aucun point pour le jeu", () => {
    expect(pointsFor(ev("game_played", "2026-11-01"))).toBe(0);
    expect(pointsFor(ev("visit", "2026-11-01"))).toBe(10);
    expect(pointsFor(ev("purchase", "2026-11-01", 2599))).toBe(25);
  });
  it("segmente sans données sensibles", () => {
    const now = new Date("2026-11-19");
    const h = [...Array(6)].map((_, i) => ev("visit", `2026-11-${10 + i}`));
    expect(segmentsFor(member, h, now)).toEqual(["actif-30j", "habitué", "boutique:rouen", "sans-consentement-marketing"]);
    expect(segmentsFor(member, [], now)).toContain("inactif");
  });
});
