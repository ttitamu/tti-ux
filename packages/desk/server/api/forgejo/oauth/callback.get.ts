import { createError, defineEventHandler, deleteCookie, getCookie, getQuery, getRequestURL, sendRedirect } from "h3";
import {
  exchangeForgejoOAuthCode,
  FORGEJO_OAUTH_RETURN_COOKIE,
  FORGEJO_OAUTH_STATE_COOKIE,
  FORGEJO_OAUTH_VERIFIER_COOKIE,
  getForgejoConfig,
  setForgejoSessionCookie,
  verifyForgejoUser,
} from "../../../utils/forgejo-client";
import { checkRateLimit } from "../../../utils/rate-limit";

export default defineEventHandler(async (event) => {
  checkRateLimit(event, { keyPrefix: "forgejo-oauth-cb", maxRequests: 15, windowMs: 60_000 });

  const query = getQuery(event);
  const code = typeof query.code === "string" ? query.code.trim() : "";
  const state = typeof query.state === "string" ? query.state.trim() : "";

  const expectedState = getCookie(event, FORGEJO_OAUTH_STATE_COOKIE) || "";
  const codeVerifier = getCookie(event, FORGEJO_OAUTH_VERIFIER_COOKIE) || "";
  const returnToCookie = getCookie(event, FORGEJO_OAUTH_RETURN_COOKIE) || "/";

  deleteCookie(event, FORGEJO_OAUTH_STATE_COOKIE, { path: "/" });
  deleteCookie(event, FORGEJO_OAUTH_VERIFIER_COOKIE, { path: "/" });
  deleteCookie(event, FORGEJO_OAUTH_RETURN_COOKIE, { path: "/" });

  if (!code || !state || !expectedState || state !== expectedState || !codeVerifier) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or expired Forgejo OAuth2 state/PKCE session.",
    });
  }

  const reqUrl = getRequestURL(event);
  const config = getForgejoConfig(reqUrl.origin);

  const accessToken = await exchangeForgejoOAuthCode({
    code,
    codeVerifier,
    redirectUri: config.oauthRedirectUri,
  });

  await verifyForgejoUser(accessToken);
  setForgejoSessionCookie(event, accessToken);

  const safeReturnTo =
    returnToCookie.startsWith("/") && !returnToCookie.startsWith("//") ? returnToCookie : "/";
  const separator = safeReturnTo.includes("?") ? "&" : "?";
  return sendRedirect(event, `${safeReturnTo}${separator}forgejo_auth=1`, 302);
});
