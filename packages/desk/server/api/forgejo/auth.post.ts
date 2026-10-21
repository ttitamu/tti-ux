import { createError, defineEventHandler, readBody } from "h3";
import { forgejoAuthSchema, parseOrThrow } from "../../utils/desk-schemas";
import {
  clearForgejoSessionCookie,
  getForgejoConfig,
  setForgejoSessionCookie,
  verifyForgejoUser,
} from "../../utils/forgejo-client";
import { checkRateLimit } from "../../utils/rate-limit";

export default defineEventHandler(async (event) => {
  checkRateLimit(event, { keyPrefix: "forgejo-auth", maxRequests: 10, windowMs: 60_000 });

  const rawBody = await readBody(event);
  const validated = parseOrThrow(forgejoAuthSchema, rawBody || {});
  const config = getForgejoConfig();

  if (validated.action === "signout") {
    clearForgejoSessionCookie(event);
    return {
      authenticated: false,
      user: null,
      repoWebUrl: config.repoWebUrl,
      issuesWebUrl: config.issuesWebUrl,
      ideasWebUrl: config.ideasWebUrl,
    };
  }

  if (!validated.token) {
    throw createError({
      statusCode: 400,
      statusMessage: "token: Forgejo Personal Access Token is required to sign in",
    });
  }

  const user = await verifyForgejoUser(validated.token);
  setForgejoSessionCookie(event, validated.token);

  return {
    authenticated: true,
    user,
    repoWebUrl: config.repoWebUrl,
    issuesWebUrl: config.issuesWebUrl,
    ideasWebUrl: config.ideasWebUrl,
  };
});
