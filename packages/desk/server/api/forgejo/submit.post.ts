import { createError, defineEventHandler, readBody } from "h3";
import { forgejoSubmissionSchema, parseOrThrow } from "../../utils/desk-schemas";
import { openDesk } from "../../utils/desk-service";
import {
  extractForgejoToken,
  pushEntryToForgejo,
  verifyForgejoUser,
} from "../../utils/forgejo-client";
import { checkRateLimit } from "../../utils/rate-limit";

export default defineEventHandler(async (event) => {
  checkRateLimit(event, { keyPrefix: "forgejo-submit", maxRequests: 10, windowMs: 60_000 });

  // Strict Authentication Gate: reject unauthenticated submissions
  const token = extractForgejoToken(event);
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required: sign in with your TTI Code (Forgejo) credentials before submitting a bug report or idea.",
    });
  }

  const user = await verifyForgejoUser(token);
  const rawBody = await readBody(event);
  const validated = parseOrThrow(forgejoSubmissionSchema, rawBody || {});

  const result = await pushEntryToForgejo(token, {
    kind: validated.kind,
    title: validated.title,
    summary: validated.summary,
    componentOrRoute: validated.componentOrRoute,
    category: validated.category,
    details: validated.details,
    authorLogin: user.login,
  });

  // Also record in the local TUX Desk governance ledger for auditability
  try {
    const { service } = await openDesk(event);
    await service.addFeedback(validated.componentOrRoute || "forgejo-tracker", {
      vote: "down",
      reason: validated.kind === "bug" ? "wrong" : "missing",
      note: `[Forgejo ${validated.kind.toUpperCase()} by @${user.login}] ${validated.title} — ${validated.summary}`,
      sessionId: `forgejo:${user.login}`,
    });
  } catch {
    // Non-fatal if local SQLite ledger is read-only
  }

  return result;
});
