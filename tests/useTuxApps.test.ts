/**
 * Registry-order + audience-filtering invariants for useTuxApps().
 *
 * These are Phase-1 exit gates from the portal unification plan: tile
 * order is a pure function of design/apps.json, so the cross-portal
 * "tile-position constancy" check lives here as a unit test instead of
 * a four-portal live-browser battery.
 */
import { describe, expect, it } from "vitest";
import registry from "../design/apps.json";
import { useTuxApps } from "../app/composables/useTuxApps";

const ids = (apps: { id: string }[]) => apps.map((a) => a.id);
const registryIds = registry.apps.map((a) => a.id);

describe("useTuxApps", () => {
  it("renders tiles in registry order for every current-app value (spatial constancy)", () => {
    for (const current of registryIds) {
      const { apps } = useTuxApps({ current, signedIn: true });
      expect(ids(apps.value)).toEqual(registryIds);
    }
  });

  it("never sorts the current tile elsewhere — exactly one current, in place", () => {
    const { apps } = useTuxApps({ current: "tux", signedIn: true });
    const currents = apps.value.filter((a) => a.current);
    expect(currents).toHaveLength(1);
    expect(apps.value.findIndex((a) => a.current)).toBe(
      registryIds.indexOf("tux"),
    );
  });

  it("anonymous users see only audience:public apps, in registry order", () => {
    const { apps, footerText } = useTuxApps({ signedIn: false });
    const publicIds = registry.apps
      .filter((a) => a.audience === "public")
      .map((a) => a.id);
    expect(ids(apps.value)).toEqual(publicIds);
    expect(footerText.value).toContain("Sign in to see all");
  });

  it("signed-in without a my-apps resolver sees everything (Tier-0 fail-open)", () => {
    const { apps, hiddenCount } = useTuxApps({ signedIn: true });
    expect(ids(apps.value)).toEqual(registryIds);
    expect(hiddenCount.value).toBe(0);
  });

  it("an explicit entitled list filters audience:entitled apps (Landscape decision: hidden, not locked)", () => {
    const { apps } = useTuxApps({ signedIn: true, entitled: [] });
    expect(ids(apps.value)).not.toContain("landscape");
    const granted = useTuxApps({ signedIn: true, entitled: ["landscape"] });
    expect(ids(granted.apps.value)).toContain("landscape");
  });

  it("desktop entries point at the launcher, never a raw scheme", () => {
    // The roster carries no kind:"desktop" entry since the AI Studio tile was
    // retired (2026-08-30), so the branch below is DORMANT, not passing —
    // asserted explicitly so a future desktop tile is not added believing the
    // launcher rule is still being enforced here.
    expect(registry.apps.filter((a) => a.kind === "desktop")).toHaveLength(0);
    for (const app of registry.apps) {
      if (app.kind === "desktop") {
        expect(app.url.startsWith("https://")).toBe(true);
      }
      // deepLink is desktop transport only and never leaks into `to`.
      const { apps } = useTuxApps({ signedIn: true });
      for (const tile of apps.value) {
        expect(tile.to.startsWith("tti-ai-studio://")).toBe(false);
      }
    }
  });

  it("the registry ships public metadata only — no entitlement mappings client-side", () => {
    const raw = JSON.stringify(registry);
    expect(raw).not.toMatch(/entraGroups|groupId|oid/i);
  });

  it("heading is the family name", () => {
    expect(registry.heading).toBe("TTI Portals");
  });
});
