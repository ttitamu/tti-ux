import { createError, defineEventHandler, getRouterParam } from "h3";
import { openDesk } from "../../../../utils/desk-service";

export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing page ID" });
  }
  return service.listRevisions(id);
});

