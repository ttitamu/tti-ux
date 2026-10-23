import { defineEventHandler, readBody } from "h3";
import { createMediaSchema, parseOrThrow } from "../../utils/desk-schemas";
import { openDesk } from "../../utils/desk-service";

export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event, { requireAuth: true });
  const rawBody = await readBody(event);
  const validated = parseOrThrow(createMediaSchema, rawBody);
  return service.createMedia(validated as Parameters<typeof service.createMedia>[0]);
});

