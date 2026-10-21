import { defineEventHandler } from "h3";
import {
  clearForgejoSessionCookie,
  extractForgejoToken,
  getForgejoConfig,
  verifyForgejoUser,
} from "../../utils/forgejo-client";

export default defineEventHandler(async (event) => {
  const config = getForgejoConfig();
  const token = extractForgejoToken(event);

  if (!token) {
    return {
      authenticated: false,
      user: null,
      oauthConfigured: config.oauthConfigured,
      oauthAuthorizeUrl: "/api/forgejo/oauth/authorize",
      repoWebUrl: config.repoWebUrl,
      issuesWebUrl: config.issuesWebUrl,
      ideasWebUrl: config.ideasWebUrl,
    };
  }

  try {
    const user = await verifyForgejoUser(token);
    return {
      authenticated: true,
      user,
      oauthConfigured: config.oauthConfigured,
      oauthAuthorizeUrl: "/api/forgejo/oauth/authorize",
      repoWebUrl: config.repoWebUrl,
      issuesWebUrl: config.issuesWebUrl,
      ideasWebUrl: config.ideasWebUrl,
    };
  } catch {
    clearForgejoSessionCookie(event);
    return {
      authenticated: false,
      user: null,
      oauthConfigured: config.oauthConfigured,
      oauthAuthorizeUrl: "/api/forgejo/oauth/authorize",
      repoWebUrl: config.repoWebUrl,
      issuesWebUrl: config.issuesWebUrl,
      ideasWebUrl: config.ideasWebUrl,
    };
  }
});
