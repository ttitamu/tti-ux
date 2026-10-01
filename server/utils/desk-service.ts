import { desc, eq, and, sql } from "drizzle-orm";
import type { H3Event } from "h3";
import { getDeskDb, type DeskDb } from "../db/client";
import { pages, revisions, orgUnits, users, issues, events, media } from "../db/schema";
import type { PageStatus, Visibility, FeedbackReason, MediaKind } from "../db/types";
import { isVerificationStale, shouldOpenFeedbackIssue } from "../../app/utils/desk/governance";

export interface DeskActor {
  userId: string;
  name: string;
  email: string;
  login: string;
  isOrgOwner: boolean;
}

export interface PageListItem {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  visibility: Visibility;
  updatedAt: Date;
  verifiedUntil: Date | null;
  reviewCadenceDays: number;
  stale: boolean;
}

export async function openDesk(event?: H3Event) {
  const db = await getDeskDb();
  const [org] = await db.select().from(orgUnits).limit(1);

  const actor: DeskActor = {
    userId: org?.ownerUserId || "dev-owner",
    name: "TTI Researcher",
    email: "research@tti.tamu.edu",
    login: "tti-researcher",
    isOrgOwner: true,
  };

  return {
    db,
    actor,
    service: createDeskService(db, actor, org?.id || "default"),
  };
}

export function createDeskService(db: DeskDb, actor: DeskActor, defaultOrgId: string) {
  return {
    async listPages(filter?: {
      status?: string;
      search?: string;
      stale?: boolean;
    }): Promise<PageListItem[]> {
      const rows = await db
        .select()
        .from(pages)
        .orderBy(desc(pages.updatedAt));

      let result = rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        status: p.status,
        visibility: p.visibility,
        updatedAt: p.updatedAt,
        verifiedUntil: p.verifiedUntil,
        reviewCadenceDays: p.reviewCadenceDays,
        stale: isVerificationStale({
          verifiedUntil: p.verifiedUntil,
          reviewCadenceDays: p.reviewCadenceDays,
        }),
      }));

      if (filter?.status && filter.status !== "all") {
        result = result.filter((p) => p.status === filter.status);
      }
      if (filter?.search?.trim()) {
        const q = filter.search.toLowerCase().trim();
        result = result.filter(
          (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
        );
      }
      if (filter?.stale !== undefined) {
        result = result.filter((p) => p.stale === filter.stale);
      }

      return result;
    },

    async getPage(id: string) {
      const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
      if (!page) return null;

      const revisionId = page.draftRevisionId || page.liveRevisionId;
      let revision = null;
      if (revisionId) {
        [revision] = await db.select().from(revisions).where(eq(revisions.id, revisionId)).limit(1);
      }

      return {
        ...page,
        stale: isVerificationStale({
          verifiedUntil: page.verifiedUntil,
          reviewCadenceDays: page.reviewCadenceDays,
        }),
        revision,
      };
    },

    async getPublicPage(slug: string) {
      const [page] = await db
        .select()
        .from(pages)
        .where(and(eq(pages.slug, slug), eq(pages.status, "published")))
        .limit(1);
      if (!page || !page.liveRevisionId) return null;

      const [revision] = await db
        .select()
        .from(revisions)
        .where(eq(revisions.id, page.liveRevisionId))
        .limit(1);

      return {
        ...page,
        stale: isVerificationStale({
          verifiedUntil: page.verifiedUntil,
          reviewCadenceDays: page.reviewCadenceDays,
        }),
        revision,
      };
    },

    async createPage(input: {
      title: string;
      slug?: string;
      bodyJson?: Record<string, unknown>;
      bodyMd?: string;
      reviewCadenceDays?: number;
    }) {
      const pageId = crypto.randomUUID();
      const revisionId = crypto.randomUUID();
      const slug =
        input.slug?.trim() ||
        input.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") ||
        "page";

      await db.insert(pages).values({
        id: pageId,
        orgUnitId: defaultOrgId,
        slug,
        title: input.title,
        status: "draft",
        visibility: "internal",
        ownerUserId: actor.userId,
        reviewCadenceDays: input.reviewCadenceDays ?? 90,
        draftRevisionId: revisionId,
      });

      await db.insert(revisions).values({
        id: revisionId,
        pageId,
        authorUserId: actor.userId,
        bodyMd: input.bodyMd || "",
        bodyJson: input.bodyJson,
      });

      return this.getPage(pageId);
    },

    async updatePage(
      id: string,
      input: {
        title?: string;
        slug?: string;
        bodyJson?: Record<string, unknown>;
        bodyMd?: string;
        reviewCadenceDays?: number;
      }
    ) {
      const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
      if (!page) return null;

      const revisionId = crypto.randomUUID();
      await db.insert(revisions).values({
        id: revisionId,
        pageId: id,
        authorUserId: actor.userId,
        bodyMd: input.bodyMd || "",
        bodyJson: input.bodyJson,
      });

      await db
        .update(pages)
        .set({
          title: input.title ?? page.title,
          slug: input.slug ?? page.slug,
          reviewCadenceDays: input.reviewCadenceDays ?? page.reviewCadenceDays,
          draftRevisionId: revisionId,
          updatedAt: new Date(),
        })
        .where(eq(pages.id, id));

      return this.getPage(id);
    },

    async publishPage(id: string) {
      const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
      if (!page || !page.draftRevisionId) return null;

      const cadenceDays = page.reviewCadenceDays || 90;
      const verifiedUntil = new Date(Date.now() + cadenceDays * 86_400_000);

      await db
        .update(pages)
        .set({
          status: "published",
          visibility: "public",
          liveRevisionId: page.draftRevisionId,
          verifiedUntil,
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(pages.id, id));

      return this.getPage(id);
    },

    async addFeedback(
      pageId: string,
      input: {
        vote: "up" | "down";
        reason?: FeedbackReason | string;
        note?: string;
        sessionId: string;
      }
    ) {
      // Record feedback event
      await db.insert(events).values({
        id: crypto.randomUUID(),
        pageId,
        sessionId: input.sessionId,
        type: `feedback_${input.vote}`,
        payload: {
          reason: input.reason,
          note: input.note,
        },
      });

      let issueOpened = false;
      if (
        shouldOpenFeedbackIssue({
          vote: input.vote,
          reason: input.reason as FeedbackReason,
          note: input.note,
        })
      ) {
        await db.insert(issues).values({
          id: crypto.randomUUID(),
          pageId,
          kind: "feedback",
          status: "open",
          payload: {
            vote: input.vote,
            reason: input.reason,
            note: input.note,
            sessionId: input.sessionId,
          },
        });
        issueOpened = true;
      }

      return {
        recorded: true,
        issueOpened,
      };
    },

    async listRevisions(pageId: string) {
      const list = await db
        .select()
        .from(revisions)
        .where(eq(revisions.pageId, pageId))
        .orderBy(desc(revisions.createdAt));

      return list.map((rev) => ({
        id: rev.id,
        pageId: rev.pageId,
        authorUserId: rev.authorUserId,
        createdAt: rev.createdAt,
        byteLength: rev.bodyMd.length,
        snippet: rev.bodyMd.slice(0, 120),
        bodyJson: rev.bodyJson,
        bodyMd: rev.bodyMd,
      }));
    },

    async rollbackRevision(pageId: string, revisionId: string) {
      const [targetRev] = await db
        .select()
        .from(revisions)
        .where(and(eq(revisions.id, revisionId), eq(revisions.pageId, pageId)))
        .limit(1);

      if (!targetRev) return null;

      // Create a new rollback revision so history is preserved
      const newRevisionId = crypto.randomUUID();
      await db.insert(revisions).values({
        id: newRevisionId,
        pageId,
        authorUserId: actor.userId,
        bodyMd: targetRev.bodyMd,
        bodyJson: targetRev.bodyJson,
      });

      await db
        .update(pages)
        .set({
          draftRevisionId: newRevisionId,
          updatedAt: new Date(),
        })
        .where(eq(pages.id, pageId));

      return this.getPage(pageId);
    },

    async listIssues(filter?: { status?: string; pageId?: string }) {
      const rows = await db
        .select({
          issue: issues,
          pageTitle: pages.title,
          pageSlug: pages.slug,
        })
        .from(issues)
        .leftJoin(pages, eq(issues.pageId, pages.id))
        .orderBy(desc(issues.createdAt));

      let result = rows.map((r) => ({
        id: r.issue.id,
        pageId: r.issue.pageId,
        pageTitle: r.pageTitle || "General",
        pageSlug: r.pageSlug || "",
        kind: r.issue.kind,
        status: r.issue.status,
        payload: r.issue.payload as Record<string, unknown>,
        createdAt: r.issue.createdAt,
        updatedAt: r.issue.updatedAt,
      }));

      if (filter?.status && filter.status !== "all") {
        result = result.filter((i) => i.status === filter.status);
      }
      if (filter?.pageId) {
        result = result.filter((i) => i.pageId === filter.pageId);
      }

      return result;
    },

    async resolveIssue(id: string, note?: string) {
      const [existing] = await db.select().from(issues).where(eq(issues.id, id)).limit(1);
      if (!existing) return null;

      const payload = {
        ...(existing.payload as Record<string, unknown>),
        resolvedNote: note || "Resolved by editorial staff",
        resolvedAt: new Date().toISOString(),
      };

      await db
        .update(issues)
        .set({
          status: "resolved",
          payload,
          updatedAt: new Date(),
        })
        .where(eq(issues.id, id));

      const [updated] = await db.select().from(issues).where(eq(issues.id, id)).limit(1);
      return updated;
    },

    async getSystemStats() {
      const allPages = await this.listPages();
      const allRevs = await db.select().from(revisions);
      const allIssues = await db.select().from(issues);

      const published = allPages.filter((p) => p.status === "published").length;
      const drafts = allPages.filter((p) => p.status === "draft").length;
      const stale = allPages.filter((p) => p.stale).length;
      const openIssues = allIssues.filter((i) => i.status === "open").length;

      return {
        status: "healthy",
        version: "3.0.0",
        engine: "PGlite (in-process Wasm Postgres)",
        counts: {
          totalPages: allPages.length,
          publishedPages: published,
          draftPages: drafts,
          stalePages: stale,
          totalRevisions: allRevs.length,
          openIssues,
          totalIssues: allIssues.length,
        },
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      };
    },

    async listMedia() {
      return db.select().from(media).orderBy(desc(media.createdAt));
    },

    async createMedia(input: {
      filename: string;
      mime: string;
      bytes: number;
      kind: MediaKind;
    }) {
      const id = crypto.randomUUID();
      await db.insert(media).values({
        id,
        filename: input.filename,
        mime: input.mime,
        bytes: input.bytes,
        kind: input.kind,
        uploaderUserId: actor.userId,
      });

      const [created] = await db.select().from(media).where(eq(media.id, id)).limit(1);
      return created;
    },
  };
}
