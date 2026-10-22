import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import registry from "../design/apps.json";
import {
  forgejoAuthSchema,
  forgejoSubmissionSchema,
} from "../packages/desk/server/utils/desk-schemas";
import {
  buildForgejoOAuthUrl,
  fetchForgejoEntries,
  formatForgejoIssueMarkdown,
  generateOAuthState,
  generatePkcePair,
  pushEntryToForgejo,
  resolveForgejoLabelIds,
} from "../packages/desk/server/utils/forgejo-client";

describe("Forgejo Auth-Gated Bug Report & Idea Schemas", () => {
  it("validates Forgejo authentication token payloads", () => {
    const valid = forgejoAuthSchema.safeParse({
      action: "signin",
      token: "not-a-real-token",
    });
    expect(valid.success).toBe(true);

    const logout = forgejoAuthSchema.safeParse({
      action: "signout",
    });
    expect(logout.success).toBe(true);
  });

  it("validates Bug Report submission payloads targeting Forgejo Issues", () => {
    const bug = forgejoSubmissionSchema.safeParse({
      kind: "bug",
      title: "Contrast regression in TuxBadge dark mode",
      summary: "Observed on the /components/badge documentation page.",
      componentOrRoute: "/components/badge",
      category: "major",
      details: "1. Switch theme to tti-dark\n2. Inspect badge border",
    });
    expect(bug.success).toBe(true);
    if (bug.success) {
      expect(bug.data.kind).toBe("bug");
      expect(bug.data.category).toBe("major");
    }
  });

  it("validates Idea submission payloads targeting Forgejo Ideas", () => {
    const idea = forgejoSubmissionSchema.safeParse({
      kind: "idea",
      title: "Add transit GTFS real-time arrival strip component",
      summary: "Would help transit mobility researchers display live headways.",
      componentOrRoute: "TuxTransitArrivalStrip",
      category: "New Component",
      details: "Accelerates FTA and TxDOT transit dashboard deliverables.",
    });
    expect(idea.success).toBe(true);
    if (idea.success) {
      expect(idea.data.kind).toBe("idea");
      expect(idea.data.category).toBe("New Component");
    }
  });

  it("rejects empty or underspecified titles and summaries", () => {
    const invalid = forgejoSubmissionSchema.safeParse({
      kind: "bug",
      title: "abc",
      summary: "short",
    });
    expect(invalid.success).toBe(false);
  });
});

describe("Forgejo OAuth2 + PKCE (S256) & Live API Proxy", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates RFC 7636 PKCE S256 verifier/challenge pairs and cryptographic state", () => {
    const { codeVerifier, codeChallenge } = generatePkcePair();
    expect(codeVerifier.length).toBeGreaterThanOrEqual(40);
    const expectedChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
    expect(codeChallenge).toBe(expectedChallenge);

    const state = generateOAuthState();
    expect(state.length).toBeGreaterThanOrEqual(24);
  });

  it("builds a Forgejo OAuth2 authorization URL with S256 PKCE parameters", () => {
    const urlStr = buildForgejoOAuthUrl({
      baseUrl: "https://code.tti.tamu.edu",
      clientId: "tux-portal-client",
      redirectUri: "https://ux.tti.tamu.edu/api/forgejo/oauth/callback",
      state: "test-state-123",
      codeChallenge: "test-challenge-456",
    });

    const parsed = new URL(urlStr);
    expect(parsed.origin).toBe("https://code.tti.tamu.edu");
    expect(parsed.pathname).toBe("/login/oauth/authorize");
    expect(parsed.searchParams.get("client_id")).toBe("tux-portal-client");
    expect(parsed.searchParams.get("response_type")).toBe("code");
    expect(parsed.searchParams.get("state")).toBe("test-state-123");
    expect(parsed.searchParams.get("code_challenge")).toBe("test-challenge-456");
    expect(parsed.searchParams.get("code_challenge_method")).toBe("S256");
    expect(parsed.searchParams.get("scope")).toContain("write:issue");
  });

  it("formats Bug Reports and Idea Proposals with distinct section metadata and labels", () => {
    const bugFormatted = formatForgejoIssueMarkdown({
      kind: "bug",
      title: "Sticky header focus ring clipped",
      summary: "Clipped when scrolling horizontally.",
      componentOrRoute: "/components/data-table",
      category: "a11y-wcag-aaa",
      authorLogin: "ag-researcher",
    });
    expect(bugFormatted.formattedTitle).toBe("[Bug] Sticky header focus ring clipped");
    expect(bugFormatted.desiredLabels).toEqual(["bug", "a11y-wcag-aaa"]);
    expect(bugFormatted.bodyMarkdown).toContain("Forgejo Issues (tti/tti-ux)");

    const ideaFormatted = formatForgejoIssueMarkdown({
      kind: "idea",
      title: "Add TuxTransitSignalPriority diagram",
      summary: "Visualize transit signal priority corridors.",
      componentOrRoute: "TuxTransitSignalPriority",
      category: "new-component",
      authorLogin: "ag-researcher",
    });
    expect(ideaFormatted.formattedTitle).toBe("[Idea] Add TuxTransitSignalPriority diagram");
    expect(ideaFormatted.desiredLabels).toEqual(["idea", "enhancement", "new-component"]);
    expect(ideaFormatted.bodyMarkdown).toContain("Forgejo Ideas (tti/tti-ux)");
  });

  it("resolves repository label IDs and attaches them when pushing to Forgejo", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("/labels")) {
        return new Response(
          JSON.stringify([
            { id: 11, name: "bug" },
            { id: 22, name: "idea" },
            { id: 33, name: "enhancement" },
            { id: 44, name: "new-component" },
          ]),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      if (url.includes("/issues")) {
        return new Response(
          JSON.stringify({
            number: 88,
            html_url: "https://code.tti.tamu.edu/tti/tti-ux/issues/88",
          }),
          { status: 201, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response("{}", { status: 200 });
    });

    const labelCheck = await resolveForgejoLabelIds("test-token-123456", "tti/tti-ux", ["idea", "new-component"]);
    expect(labelCheck.ids).toEqual([22, 44]);

    const pushed = await pushEntryToForgejo("test-token-123456", {
      kind: "idea",
      title: "Add TuxSignalTimingChart",
      summary: "Helps traffic signal researchers plot green-band progression.",
      category: "new-component",
      authorLogin: "tti-engineer",
    });

    expect(pushed.ok).toBe(true);
    expect(pushed.section).toBe("ideas");
    expect(pushed.number).toBe(88);
    expect(pushed.labels).toEqual(["idea", "enhancement", "new-component"]);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("fetches and filters recent Bug Reports and Ideas from Forgejo", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            id: 501,
            number: 55,
            title: "[Idea] Add AASHTO Stopping Sight Distance Calculator",
            state: "open",
            html_url: "https://code.tti.tamu.edu/tti/tti-ux/issues/55",
            user: { login: "tti-safety-div" },
            created_at: "2026-10-20T12:00:00Z",
            labels: [{ name: "idea" }, { name: "enhancement" }],
          },
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const entries = await fetchForgejoEntries("test-token-123456", "idea", 5);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.kind).toBe("idea");
    expect(entries[0]?.number).toBe(55);
    expect(entries[0]?.labels).toContain("idea");
  });
});

describe("Internal Tool Purge Invariant", () => {
  it("excludes internal-only tools (atlas, landscape) from the public apps registry", () => {
    const ids = registry.apps.map((a) => a.id.toLowerCase());
    expect(ids).not.toContain("atlas");
    expect(ids).not.toContain("landscape");
  });
});
