import { defineEventHandler, getQuery } from "h3";
import { openDesk } from "../../utils/desk-service";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { service } = await openDesk(event);
  return service.listIssues({
    status: query.status ? String(query.status) : undefined,
    pageId: query.pageId ? String(query.pageId) : undefined,
  });
});

