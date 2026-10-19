import { createMediaSchema, parseOrThrow } from "../../utils/desk-schemas";

export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event, { requireAuth: true });
  const rawBody = await readBody(event);
  const validated = parseOrThrow(createMediaSchema, rawBody);
  return service.createMedia(validated);
});
