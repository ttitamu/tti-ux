export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { service } = await openDesk(event);
  return service.listIssues({
    status: query.status ? String(query.status) : undefined,
    pageId: query.pageId ? String(query.pageId) : undefined,
  });
});
