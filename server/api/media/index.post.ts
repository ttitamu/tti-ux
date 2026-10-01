export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body?.filename || !body?.mime || !body?.kind) {
    throw createError({
      statusCode: 400,
      statusMessage: "filename, mime, and kind are required",
    });
  }
  const { service } = await openDesk(event);
  return service.createMedia({
    filename: String(body.filename),
    mime: String(body.mime),
    bytes: Number(body.bytes) || 0,
    kind: body.kind,
  });
});
