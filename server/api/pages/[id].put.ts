export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Page ID is required" });
  const body = await readBody(event);
  const updated = await service.updatePage(id, body);
  if (!updated) throw createError({ statusCode: 404, message: "Page not found" });
  return updated;
});
