import { describe, it, expect } from "vitest";
import { openDesk } from "../../server/utils/desk-service";
import pkg from "../../package.json";

describe("Tux Desk API Service", () => {
  it("lists seeded pages with freshness metadata", async () => {
    const { service } = await openDesk();
    const list = await service.listPages();
    expect(list.length).toBeGreaterThan(0);
    const seeded = list.find((p) => p.slug === "corridor-telemetry-runbook");
    expect(seeded).toBeDefined();
    expect(seeded?.title).toBe("Corridor Telemetry Field Protocol");
    expect(seeded?.stale).toBe(false);
  });

  it("retrieves page with revisions and modules", async () => {
    const { service } = await openDesk();
    const page = await service.getPublicPage("corridor-telemetry-runbook");
    expect(page).not.toBeNull();
    expect(page?.status).toBe("published");
    expect(page?.revision?.bodyJson).toBeDefined();
  });

  it("creates a new draft and updates it", async () => {
    const { service } = await openDesk();
    const uniqueSlug = `fleet-guide-${Date.now()}`;
    const created = await service.createPage({
      title: "Autonomous Fleet Testing Guide",
      slug: uniqueSlug,
      bodyMd: "# Autonomous Fleet Testing Guide",
      bodyJson: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Procedures for autonomous shuttle fleet operations." }],
          },
        ],
      },
    });

    expect(created).not.toBeNull();
    expect(created?.title).toBe("Autonomous Fleet Testing Guide");
    expect(created?.status).toBe("draft");

    // Publish the draft
    const published = await service.publishPage(created!.id);
    expect(published?.status).toBe("published");
    expect(published?.verifiedUntil).not.toBeNull();
  });

  it("records reader feedback and creates issues for actionable downs", async () => {
    const { service } = await openDesk();
    const res = await service.addFeedback("corridor-telemetry-runbook", {
      vote: "down",
      reason: "outdated",
      note: "Speed thresholds changed to 45mph.",
      sessionId: `session-${Date.now()}`,
    });

    expect(res.recorded).toBe(true);
    expect(res.issueOpened).toBe(true);
  });

  it("filters pages by status and search keyword", async () => {
    const { service } = await openDesk();
    const publishedOnly = await service.listPages({ status: "published" });
    expect(publishedOnly.every((p) => p.status === "published")).toBe(true);

    const searchMatch = await service.listPages({ search: "telemetry" });
    expect(searchMatch.length).toBeGreaterThan(0);
    expect(searchMatch[0]?.title.toLowerCase()).toContain("telemetry");

    const noMatch = await service.listPages({ search: "nonexistent-xyz-search-token" });
    expect(noMatch.length).toBe(0);
  });

  it("lists page revisions and performs rollback", async () => {
    const { service } = await openDesk();
    const created = await service.createPage({
      title: "V2X Crash Mitigation Protocol",
      bodyMd: "Revision 1 initial content",
    });
    expect(created).not.toBeNull();
    const initialRevId = created!.draftRevisionId!;

    // Make an update (Revision 2)
    const updated = await service.updatePage(created!.id, {
      bodyMd: "Revision 2 updated content",
    });
    expect(updated).not.toBeNull();

    // List revisions
    const revs = await service.listRevisions(created!.id);
    expect(revs.length).toBeGreaterThanOrEqual(2);

    // Rollback to initial revision
    const rolledBack = await service.rollbackRevision(created!.id, initialRevId);
    expect(rolledBack).not.toBeNull();
    expect(rolledBack?.revision?.bodyMd).toBe("Revision 1 initial content");
  });

  it("lists and resolves reader issues", async () => {
    const { service } = await openDesk();
    const allIssues = await service.listIssues();
    expect(Array.isArray(allIssues)).toBe(true);

    if (allIssues.length > 0) {
      const target = allIssues[0]!;
      const resolved = await service.resolveIssue(target.id, "Corrected in latest revision");
      expect(resolved?.status).toBe("resolved");
    }
  });

  it("returns comprehensive system and telemetry stats", async () => {
    const { service } = await openDesk();
    const stats = await service.getSystemStats();
    expect(stats.status).toBe("healthy");
    expect(stats.version).toBe(pkg.version);
    expect(stats.counts.totalPages).toBeGreaterThan(0);
    expect(stats.engine).toContain("PGlite");
  });

  it("manages media asset records", async () => {
    const { service } = await openDesk();
    const created = await service.createMedia({
      filename: "rellis-corridor-overview.png",
      mime: "image/png",
      bytes: 2048576,
      kind: "image",
    });
    expect(created.filename).toBe("rellis-corridor-overview.png");

    const mediaList = await service.listMedia();
    expect(mediaList.some((m) => m.filename === "rellis-corridor-overview.png")).toBe(true);
  });
});
