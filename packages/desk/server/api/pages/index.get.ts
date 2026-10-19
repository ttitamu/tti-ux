import { defineEventHandler, getQuery } from "h3";
import { openDesk } from "../../utils/desk-service";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { service } = await openDesk(event);
  return service.listPages({
    status: query.status ? String(query.status) : undefined,
    search: query.search ? String(query.search) : undefined,
    stale: query.stale !== undefined ? query.stale === "true" || query.stale === "1" : undefined,
    limit: query.limit !== undefined ? Number(query.limit) : undefined,
    offset: query.offset !== undefined ? Number(query.offset) : undefined,
  });
});

