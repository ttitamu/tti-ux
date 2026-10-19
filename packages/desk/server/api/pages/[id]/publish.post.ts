import { createError, defineEventHandler, getRouterParam } from "h3";
import { openDesk } from "../../../utils/desk-service";

export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event, { requireAuth: true });
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Page ID is required" });
  const published = await service.publishPage(id);
  if (!published) throw createError({ statusCode: 404, message: "Page not found" });
  return published;
});

