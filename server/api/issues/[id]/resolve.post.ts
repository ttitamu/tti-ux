import { resolveIssueSchema, parseOrThrow } from "../../../utils/desk-schemas";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing issue ID" });
  }
  const rawBody = await readBody(event).catch(() => ({}));
  const validated = parseOrThrow(resolveIssueSchema, rawBody || {});
  const { service } = await openDesk(event, { requireAuth: true });
  const updated = await service.resolveIssue(id, validated.note);
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: "Issue not found" });
  }
  return updated;
});
