import { defineEventHandler, readBody } from "h3";
import { feedbackSchema, parseOrThrow } from "../utils/desk-schemas";
import { openDesk } from "../utils/desk-service";
import { checkRateLimit } from "../utils/rate-limit";

export default defineEventHandler(async (event) => {
  // Prevent automated spam flood (max 10 feedback submissions per minute per client IP)
  checkRateLimit(event, { keyPrefix: "feedback", maxRequests: 10, windowMs: 60_000 });

  const rawBody = await readBody(event);
  const validated = parseOrThrow(feedbackSchema, rawBody || {});
  const { service } = await openDesk(event);

  return service.addFeedback(validated.pageId ?? "/", {
    vote: validated.vote ?? "up",
    reason: validated.reason,
    note: validated.note,
    sessionId: validated.sessionId ?? "anonymous",
  });
});

