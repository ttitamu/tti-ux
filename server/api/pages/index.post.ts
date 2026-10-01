export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event);
  const body = await readBody(event);
  if (!body?.title) {
    throw createError({ statusCode: 400, message: "Title is required" });
  }
  return service.createPage(body);
});
