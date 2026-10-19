export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { service } = await openDesk(event);
  return service.listPages({
    status: query.status ? String(query.status) : undefined,
    search: query.search ? String(query.search) : undefined,
    stale: query.stale !== undefined ? query.stale === "true" || query.stale === "1" : undefined,
  });
});
