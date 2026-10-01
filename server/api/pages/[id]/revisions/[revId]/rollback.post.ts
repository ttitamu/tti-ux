export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event);
  const id = getRouterParam(event, "id");
  const revId = getRouterParam(event, "revId");
  if (!id || !revId) {
    throw createError({ statusCode: 400, statusMessage: "Missing page ID or revision ID" });
  }
  const result = await service.rollbackRevision(id, revId);
  if (!result) {
    throw createError({ statusCode: 404, statusMessage: "Page or revision not found" });
  }
  return result;
});
