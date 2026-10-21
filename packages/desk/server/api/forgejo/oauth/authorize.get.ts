import { createError, defineEventHandler, getQuery, getRequestURL, sendRedirect, setCookie } from "h3";
import {
  buildForgejoOAuthUrl,
  FORGEJO_OAUTH_RETURN_COOKIE,
  FORGEJO_OAUTH_STATE_COOKIE,
  FORGEJO_OAUTH_VERIFIER_COOKIE,
  generateOAuthState,
  generatePkcePair,
  getForgejoConfig,
} from "../../../utils/forgejo-client";
import { checkRateLimit } from "../../../utils/rate-limit";

export default defineEventHandler(async (event) => {
  checkRateLimit(event, { keyPrefix: "forgejo-oauth-init", maxRequests: 15, windowMs: 60_000 });

  const reqUrl = getRequestURL(event);
  const config = getForgejoConfig(reqUrl.origin);
  const query = getQuery(event);

  if (!config.oauthConfigured) {
    throw createError({
      statusCode: 501,
      statusMessage:
        "Forgejo OAuth2 SSO is not configured on this server (missing FORGEJO_OAUTH_CLIENT_ID). Please authenticate using a Forgejo Personal Access Token.",
    });
  }

  const state = generateOAuthState();
  const { codeVerifier, codeChallenge } = generatePkcePair();
  const rawReturnTo = typeof query.returnTo === "string" ? query.returnTo.trim() : "/";
  const safeReturnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : "/";

  const cookieOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  };

  setCookie(event, FORGEJO_OAUTH_STATE_COOKIE, state, cookieOpts);
  setCookie(event, FORGEJO_OAUTH_VERIFIER_COOKIE, codeVerifier, cookieOpts);
  setCookie(event, FORGEJO_OAUTH_RETURN_COOKIE, safeReturnTo, cookieOpts);

  const authorizeUrl = buildForgejoOAuthUrl({
    baseUrl: config.baseUrl,
    clientId: config.oauthClientId,
    redirectUri: config.oauthRedirectUri,
    state,
    codeChallenge,
  });

  if (query.format === "json") {
    return {
      ok: true,
      authorizeUrl,
    };
  }

  return sendRedirect(event, authorizeUrl, 302);
});
