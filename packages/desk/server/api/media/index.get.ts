export default defineEventHandler(async (event) => {
  const { service } = await openDesk(event);
  return service.listMedia();
});
