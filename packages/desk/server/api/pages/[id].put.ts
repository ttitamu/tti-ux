import { createError, defineEventHandler, getRouterParam, readBody } from "h3";
import { updatePageSchema, parseOrThrow } from "../../utils/desk-schemas";
import { openDesk } from "../../utils/desk-service";

export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event, { requireAuth: true });
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Page ID is required" });
  const rawBody = await readBody(event);
  const validated = parseOrThrow(updatePageSchema, rawBody);
  const updated = await service.updatePage(id, validated);
  if (!updated) throw createError({ statusCode: 404, message: "Page not found" });
  return updated;
});

