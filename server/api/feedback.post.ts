export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event);
  const body = await readBody(event);
  const pageId = body?.pageId || "general";
  return service.addFeedback(pageId, {
    vote: body?.vote || "up",
    reason: body?.reason,
    note: body?.note,
    sessionId: body?.sessionId || "anonymous",
  });
});
