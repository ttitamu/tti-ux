import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { BOOTSTRAP_SQL } from "./bootstrap";
import * as schema from "./schema";
import { orgUnits, pages, revisions, users } from "./schema";

export type DeskDb =
  | ReturnType<typeof drizzlePglite<typeof schema>>
  | ReturnType<typeof drizzlePostgres<typeof schema>>;

interface Cache {
  db: DeskDb;
  kind: "postgres" | "pglite";
}

let cache: Cache | null = null;
let ready: Promise<Cache> | null = null;

function databaseUrl(): string {
  return process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL || "";
}

export async function getDeskDb(): Promise<DeskDb> {
  if (cache) return cache.db;
  if (!ready) ready = openDeskDb();
  cache = await ready;
  return cache.db;
}

export async function getDeskKind(): Promise<"postgres" | "pglite"> {
  if (!cache) await getDeskDb();
  return cache?.kind ?? "pglite";
}

async function openDeskDb(): Promise<Cache> {
  const url = databaseUrl();
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
    const sql = postgres(url, { max: 4 });
    const db = drizzlePostgres(sql, { schema });
    await sql.unsafe(BOOTSTRAP_SQL);
    await seedDesk(db);
    return { db, kind: "postgres" };
  }

  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    const client = new PGlite();
    await client.waitReady;
    const db = drizzlePglite(client, { schema });
    await client.exec(BOOTSTRAP_SQL);
    await seedDesk(db);
    return { db, kind: "pglite" };
  }

  const file = url.startsWith("pglite:")
    ? url.slice("pglite:".length)
    : resolve(process.cwd(), ".data/tux-desk");
  mkdirSync(dirname(file), { recursive: true });
  const client = new PGlite(file);
  await client.waitReady;
  const db = drizzlePglite(client, { schema });
  await client.exec(BOOTSTRAP_SQL);
  await seedDesk(db);
  return { db, kind: "pglite" };
}

async function seedDesk(db: DeskDb) {
  let [org] = await db.select().from(orgUnits).where(eq(orgUnits.slug, "tti-research")).limit(1);
  if (!org) {
    const ownerId = crypto.randomUUID();
    await db.insert(users).values({
      id: ownerId,
      email: "research@tti.tamu.edu",
      name: "TTI Mobility Research Group",
      login: "tti-researcher",
      groups: ["research", "admin"],
    });
    await db.insert(orgUnits).values({
      slug: "tti-research",
      title: "TTI Mobility & Network Division",
      ownerUserId: ownerId,
      defaultVisibility: "internal",
    });
    [org] = await db.select().from(orgUnits).where(eq(orgUnits.slug, "tti-research")).limit(1);
  }
  if (!org) return;

  const [existingPage] = await db.select({ id: pages.id }).from(pages).limit(1);
  if (existingPage) return;

  const pageId = crypto.randomUUID();
  const revisionId = crypto.randomUUID();

  const initialBodyJson = {
    type: "doc",
    content: [
      {
        type: "deskModule",
        attrs: {
          kind: "hero",
          payload: {
            eyebrow: "Operations Runbook",
            title: "Corridor Telemetry Field Protocol",
            lead: "Operating standards and telemetry verification sequences for connected roadside vehicle sensors.",
            actionLabel: "View Live Corridor Telemetry",
            actionHref: "/p/corridor-telemetry-runbook",
          },
        },
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This document outlines standard operating procedures for roadside telemetry units deployed across the Texas Connected Corridors network. Research teams must verify sensor heartbeat intervals before commencing continuous automated driving evaluations.",
          },
        ],
      },
      {
        type: "deskModule",
        attrs: {
          kind: "callout",
          payload: {
            tone: "important",
            title: "Active Sensor Loop Notice",
            body: "Sensor calibration is currently active on the RELLIS test corridor. High-rate packet logging is enabled.",
          },
        },
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Key Operational Metrics" }],
      },
      {
        type: "deskModule",
        attrs: {
          kind: "stats",
          payload: {
            v1: "50 Hz",
            l1: "LiDAR Packet Rate",
            v2: "4.2m",
            l2: "Mounting Height",
            v3: "90d",
            l3: "Review Cadence",
          },
        },
      },
    ],
  };

  await db.insert(pages).values({
    id: pageId,
    orgUnitId: org.id,
    slug: "corridor-telemetry-runbook",
    title: "Corridor Telemetry Field Protocol",
    status: "published",
    visibility: "public",
    ownerUserId: org.ownerUserId,
    reviewCadenceDays: 90,
    verifiedUntil: new Date(Date.now() + 90 * 86_400_000),
    publishedAt: new Date(),
    liveRevisionId: revisionId,
    draftRevisionId: revisionId,
  });

  await db.insert(revisions).values({
    id: revisionId,
    pageId,
    authorUserId: org.ownerUserId,
    bodyMd: "# Corridor Telemetry Field Protocol\n\nOperating standards for connected vehicle roadside sensors.",
    bodyJson: initialBodyJson,
  });
}
