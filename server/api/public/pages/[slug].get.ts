export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event);
  const slug = getRouterParam(event, "slug");
  if (!slug) throw createError({ statusCode: 400, message: "Slug is required" });
  const page = await service.getPublicPage(slug);
  if (!page) throw createError({ statusCode: 404, message: "Page not found" });
  return page;
});
