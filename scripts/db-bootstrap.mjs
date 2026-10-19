#!/usr/bin/env node
/**
 * scripts/db-bootstrap.mjs — out-of-band database bootstrap & migration script.
 *
 * Runs BOOTSTRAP_SQL and initial seeding against DATABASE_URL / NUXT_DATABASE_URL.
 * Useful for CI, container start scripts, and production environments where
 * DESK_AUTO_BOOTSTRAP=false is set to avoid running DDL on user requests.
 */

import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { getDeskContext } = await jiti.import("../packages/desk/server/db/client.ts");

async function main() {
  console.log("Starting TUX Desk database bootstrap...");
  const ctx = await getDeskContext();
  console.log(`Connected to database engine: ${ctx.kind}`);
  if (ctx.defaultOrg) {
    console.log(`Default organization: ${ctx.defaultOrg.id} (Owner: ${ctx.defaultOrg.ownerUserId})`);
  }
  console.log("Database bootstrap & schema synchronization completed successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Database bootstrap failed:", err);
  process.exit(1);
});
