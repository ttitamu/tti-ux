import { describe, it, expect } from "vitest";
import { getDeskDb, getDeskKind } from "../../server/db/client";
import { pages, users, orgUnits } from "../../server/db/schema";
import { eq } from "drizzle-orm";

describe("Tux Desk In-Process Database (PGlite)", () => {
  it("connects and seeds initial documentation data", async () => {
    const db = await getDeskDb();
    expect(db).toBeDefined();

    const kind = await getDeskKind();
    expect(["pglite", "postgres"]).toContain(kind);

    const [page] = await db.select().from(pages).where(eq(pages.slug, "corridor-telemetry-runbook")).limit(1);
    expect(page).toBeDefined();
    expect(page.title).toBe("Corridor Telemetry Field Protocol");
    expect(page.status).toBe("published");
    expect(page.visibility).toBe("public");
  });
});
