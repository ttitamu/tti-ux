import { defineEventHandler } from "h3";
import { openDesk } from "../../utils/desk-service";

export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event);
  return service.listMedia();
});

