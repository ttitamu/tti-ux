export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Page ID is required" });
  const page = await service.getPage(id);
  if (!page) throw createError({ statusCode: 404, message: "Page not found" });
  return page;
});
