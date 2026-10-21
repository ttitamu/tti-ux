import { createError, defineEventHandler, getQuery } from "h3";
import {
  extractForgejoToken,
  fetchForgejoEntries,
  getForgejoConfig,
  verifyForgejoUser,
} from "../../utils/forgejo-client";
import { checkRateLimit } from "../../utils/rate-limit";

export default defineEventHandler(async (event) => {
  checkRateLimit(event, { keyPrefix: "forgejo-entries", maxRequests: 30, windowMs: 60_000 });

  const token = extractForgejoToken(event);
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required to inspect TTI Code (Forgejo) tracker entries.",
    });
  }

  await verifyForgejoUser(token);

  const query = getQuery(event);
  const rawKind = typeof query.kind === "string" ? query.kind.trim().toLowerCase() : "";
  const kind: "bug" | "idea" | undefined =
    rawKind === "bug" || rawKind === "idea" ? rawKind : undefined;
  const rawLimit = Number(query.limit);
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(25, Math.floor(rawLimit)) : 8;

  const entries = await fetchForgejoEntries(token, kind, limit);
  const config = getForgejoConfig();

  return {
    ok: true,
    entries,
    repoWebUrl: config.repoWebUrl,
    issuesWebUrl: config.issuesWebUrl,
    ideasWebUrl: config.ideasWebUrl,
  };
});
