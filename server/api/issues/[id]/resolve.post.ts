export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing issue ID" });
  }
  const body = await readBody(event).catch(() => ({}));
  const { service } = await openDesk(event);
  const updated = await service.resolveIssue(id, body?.note);
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: "Issue not found" });
  }
  return updated;
});
