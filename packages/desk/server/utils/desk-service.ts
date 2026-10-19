import { desc, eq, and, or, ilike, count } from "drizzle-orm";
import { type H3Event, getHeader, createError } from "h3";
import { getDeskContext, getDeskKind, type DeskDb } from "../db/client";
import { pages, revisions, users, issues, events, media } from "../db/schema";
import type { PageStatus, Visibility, FeedbackReason, IssueStatus, MediaKind } from "../db/types";
import { isVerificationStale, shouldOpenFeedbackIssue } from "../../app/utils/desk/governance";
import pkg from "../../package.json";

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

export function extractActorFromEvent(event?: H3Event): DeskActor | null {
  if (!event) return null;
  const actorHeader = getHeader(event, "x-tti-actor") || getHeader(event, "x-user");
  const userId = getHeader(event, "x-tti-user-id") || getHeader(event, "x-user-id");
  const email = getHeader(event, "x-tti-email") || getHeader(event, "x-user-email");

  if (actorHeader || userId) {
    return {
      userId: userId || actorHeader || "remote-user",
      name: actorHeader || "TTI Researcher",
      email: email || "research@tti.tamu.edu",
      login: actorHeader || "tti-researcher",
      isOrgOwner: true,
    };
  }

  // Allow dev/test actor when not running in production mode
  if (
    process.env.VITEST ||
    process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV !== "production"
  ) {
    return {
      userId: "dev-owner",
      name: "TTI Researcher (Dev)",
      email: "research@tti.tamu.edu",
      login: "tti-researcher",
      isOrgOwner: true,
    };
  }

  return null;
}

export async function openDesk(event?: H3Event, options?: { requireAuth?: boolean }) {
  const { db, defaultOrg } = await getDeskContext();
  let actor = extractActorFromEvent(event);

  if (options?.requireAuth && !actor) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Desk editorial actions require authentication",
    });
  }

  actor ??= {
    userId: defaultOrg?.ownerUserId || "dev-owner",
    name: "TTI Researcher",
    email: "research@tti.tamu.edu",
    login: "tti-researcher",
    isOrgOwner: true,
  };

  return {
    db,
    actor,
    service: createDeskService(db, actor, defaultOrg?.id || "default"),
  };
}

export function createDeskService(db: DeskDb, actor: DeskActor, defaultOrgId: string) {
  return {
    async listPages(filter?: {
      status?: string;
      search?: string;
      stale?: boolean;
      limit?: number;
      offset?: number;
    }): Promise<PageListItem[]> {
      const conditions = [];

      if (filter?.status && filter.status !== "all") {
        conditions.push(eq(pages.status, filter.status as PageStatus));
      }

      if (filter?.search?.trim()) {
        const q = `%${filter.search.trim()}%`;
        conditions.push(or(ilike(pages.title, q), ilike(pages.slug, q)));
      }

      let query = db
        .select({
          id: pages.id,
          slug: pages.slug,
          title: pages.title,
          status: pages.status,
          visibility: pages.visibility,
          updatedAt: pages.updatedAt,
          verifiedUntil: pages.verifiedUntil,
          reviewCadenceDays: pages.reviewCadenceDays,
        })
        .from(pages)
        .orderBy(desc(pages.updatedAt));

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }

      if (filter?.limit && filter.stale === undefined) {
        query = query.limit(filter.limit) as typeof query;
      }
      if (filter?.offset && filter.stale === undefined) {
        query = query.offset(filter.offset) as typeof query;
      }

      const rows = await query;

      let result = rows.map((p) => ({
        ...p,
        stale: isVerificationStale({
          verifiedUntil: p.verifiedUntil,
          reviewCadenceDays: p.reviewCadenceDays,
        }),
      }));

      if (filter?.stale !== undefined) {
        result = result.filter((p) => p.stale === filter.stale);
        if (filter?.offset) result = result.slice(filter.offset);
        if (filter?.limit) result = result.slice(0, filter.limit);
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

      const [owner] = page.ownerUserId
        ? await db
            .select({ id: users.id, name: users.name, email: users.email, login: users.login })
            .from(users)
            .where(eq(users.id, page.ownerUserId))
            .limit(1)
        : [undefined];

      return {
        ...page,
        owner: owner ?? null,
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

      const [owner] = page.ownerUserId
        ? await db
            .select({ id: users.id, name: users.name, email: users.email, login: users.login })
            .from(users)
            .where(eq(users.id, page.ownerUserId))
            .limit(1)
        : [undefined];

      return {
        ...page,
        owner: owner ?? null,
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
      const normalizedRef = pageId.replace(/^\/p\//, "").trim() || "general";
      const [matchedPage] = await db
        .select({ id: pages.id })
        .from(pages)
        .where(or(eq(pages.id, normalizedRef), eq(pages.slug, normalizedRef)))
        .limit(1);
      const effectivePageId = matchedPage?.id || pageId;

      // Record feedback event
      await db.insert(events).values({
        id: crypto.randomUUID(),
        pageId: effectivePageId,
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
          pageId: effectivePageId,
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
      const conditions = [];
      if (filter?.status && filter.status !== "all") {
        conditions.push(eq(issues.status, filter.status as IssueStatus));
      }
      if (filter?.pageId) {
        conditions.push(or(eq(issues.pageId, filter.pageId), eq(pages.slug, filter.pageId)));
      }

      let query = db
        .select({
          issue: issues,
          pageTitle: pages.title,
          pageSlug: pages.slug,
        })
        .from(issues)
        .leftJoin(pages, or(eq(issues.pageId, pages.id), eq(issues.pageId, pages.slug)))
        .orderBy(desc(issues.createdAt));

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }

      const rows = await query;

      return rows.map((r) => ({
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
      const kind = await getDeskKind();

      // Lightweight column select for pages (avoids wide rows and body content)
      const pageRows = await db
        .select({
          status: pages.status,
          verifiedUntil: pages.verifiedUntil,
          reviewCadenceDays: pages.reviewCadenceDays,
        })
        .from(pages);

      // Revisions total count via SQL count() — avoids loading large bodyJson/bodyMd documents
      const [revRow] = await db
        .select({ totalRevs: count() })
        .from(revisions);

      // Issues stats grouped by status via SQL
      const issueRows = await db
        .select({
          status: issues.status,
          count: count(),
        })
        .from(issues)
        .groupBy(issues.status);

      const published = pageRows.filter((p) => p.status === "published").length;
      const drafts = pageRows.filter((p) => p.status === "draft").length;
      const stale = pageRows.filter((p) =>
        isVerificationStale({
          verifiedUntil: p.verifiedUntil,
          reviewCadenceDays: p.reviewCadenceDays,
        })
      ).length;

      let openIssues = 0;
      let totalIssues = 0;
      for (const row of issueRows) {
        const c = Number(row.count);
        totalIssues += c;
        if (row.status === "open") openIssues += c;
      }

      return {
        status: "healthy",
        version: pkg.version,
        engine: kind === "postgres" ? "PostgreSQL" : "PGlite (in-process Wasm Postgres)",
        counts: {
          totalPages: pageRows.length,
          publishedPages: published,
          draftPages: drafts,
          stalePages: stale,
          totalRevisions: Number(revRow?.totalRevs ?? 0),
          openIssues,
          totalIssues,
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
