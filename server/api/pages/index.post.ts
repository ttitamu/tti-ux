import { createPageSchema, parseOrThrow } from "../../utils/desk-schemas";

export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event, { requireAuth: true });
  const rawBody = await readBody(event);
  const validated = parseOrThrow(createPageSchema, rawBody);
  return service.createPage(validated);
});
