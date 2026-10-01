export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Page ID is required" });
  const published = await service.publishPage(id);
  if (!published) throw createError({ statusCode: 404, message: "Page not found" });
  return published;
});
