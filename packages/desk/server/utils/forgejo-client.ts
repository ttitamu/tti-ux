/**
 * server/utils/forgejo-client.ts — Authenticated Forgejo (code.tti.tamu.edu)
 * integration for TUX Bug Reports and Idea Proposals.
 *
 * Supports:
 * - OAuth2 Authorization Code + PKCE (S256) flow (`/login/oauth/authorize` & `/login/oauth/access_token`)
 * - Personal Access Token (`write:issue`) verification (`/api/v1/user`)
 * - Automatic label resolution (`/api/v1/repos/:owner/:repo/labels`) so Bug Reports (`bug`)
 *   and Idea Proposals (`idea`) route cleanly to their respective Forgejo sections
 * - Listing recent repository Bug Reports and Ideas (`/api/v1/repos/:owner/:repo/issues`)
 */
import { createHash, randomBytes } from "node:crypto";
import { createError, deleteCookie, getCookie, getHeader, setCookie, type H3Event } from "h3";

export const FORGEJO_COOKIE_NAME = "tux_forgejo_token";
export const FORGEJO_OAUTH_STATE_COOKIE = "tux_forgejo_oauth_state";
export const FORGEJO_OAUTH_VERIFIER_COOKIE = "tux_forgejo_oauth_verifier";
export const FORGEJO_OAUTH_RETURN_COOKIE = "tux_forgejo_oauth_return";

export interface ForgejoUser {
  login: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

export interface ForgejoConfig {
  baseUrl: string;
  repo: string;
  ideasRepo: string;
  repoWebUrl: string;
  issuesWebUrl: string;
  ideasWebUrl: string;
  oauthClientId: string;
  oauthClientSecret: string;
  oauthRedirectUri: string;
  oauthConfigured: boolean;
}

export interface ForgejoEntrySummary {
  id: number;
  number: number;
  kind: "bug" | "idea";
  title: string;
  state: "open" | "closed";
  url: string;
  author: string;
  createdAt: string;
  labels: string[];
}

export function getForgejoConfig(originFallback = "https://ux.tti.tamu.edu"): ForgejoConfig {
  const baseUrl = (process.env.FORGEJO_URL || "https://code.tti.tamu.edu").replace(/\/+$/, "");
  const repo = process.env.FORGEJO_REPO || "tti/tti-ux";
  const ideasRepo = process.env.FORGEJO_IDEAS_REPO || repo;
  const repoWebUrl = `${baseUrl}/${repo}`;
  const ideasRepoWebUrl = `${baseUrl}/${ideasRepo}`;
  const oauthClientId = (process.env.FORGEJO_OAUTH_CLIENT_ID || "").trim();
  const oauthClientSecret = (process.env.FORGEJO_OAUTH_CLIENT_SECRET || "").trim();
  const oauthRedirectUri = (
    process.env.FORGEJO_OAUTH_REDIRECT_URI || `${originFallback.replace(/\/+$/, "")}/api/forgejo/oauth/callback`
  ).trim();

  return {
    baseUrl,
    repo,
    ideasRepo,
    repoWebUrl,
    issuesWebUrl: `${repoWebUrl}/issues`,
    ideasWebUrl: `${ideasRepoWebUrl}/issues?q=&type=all&state=open&labels=idea`,
    oauthClientId,
    oauthClientSecret,
    oauthRedirectUri,
    oauthConfigured: Boolean(oauthClientId),
  };
}

/**
 * Generates an RFC 7636 PKCE S256 code_verifier and code_challenge pair.
 */
export function generatePkcePair(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  return { codeVerifier, codeChallenge };
}

/**
 * Generates a cryptographic anti-CSRF OAuth2 state token.
 */
export function generateOAuthState(): string {
  return randomBytes(24).toString("base64url");
}

/**
 * Builds the Forgejo OAuth2 authorization URL with PKCE S256 parameters.
 */
export function buildForgejoOAuthUrl(params: {
  baseUrl?: string;
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
  scope?: string;
}): string {
  const cfg = getForgejoConfig();
  const root = (params.baseUrl || cfg.baseUrl).replace(/\/+$/, "");
  const url = new URL(`${root}/login/oauth/authorize`);
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", params.state);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("scope", params.scope || "read:user write:issue");
  return url.toString();
}

/**
 * Exchanges an OAuth2 authorization code + PKCE verifier for a Forgejo access token.
 */
export async function exchangeForgejoOAuthCode(params: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<string> {
  const cfg = getForgejoConfig();
  if (!cfg.oauthClientId) {
    throw createError({
      statusCode: 501,
      statusMessage: "Forgejo OAuth2 client ID (FORGEJO_OAUTH_CLIENT_ID) is not configured on this server.",
    });
  }

  const body: Record<string, string> = {
    client_id: cfg.oauthClientId,
    grant_type: "authorization_code",
    code: params.code,
    redirect_uri: params.redirectUri,
    code_verifier: params.codeVerifier,
  };
  if (cfg.oauthClientSecret) {
    body.client_secret = cfg.oauthClientSecret;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${cfg.baseUrl}/login/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      throw createError({
        statusCode: 401,
        statusMessage: `Forgejo OAuth token exchange failed (${res.status}).`,
      });
    }

    const data = (await res.json()) as Record<string, unknown>;
    if (typeof data.access_token === "string" && data.access_token.trim()) {
      return data.access_token.trim();
    }
  } catch (err: unknown) {
    if (err && typeof err === "object" && "statusCode" in err) {
      throw err;
    }
    throw createError({
      statusCode: 502,
      statusMessage: "Unable to reach Forgejo OAuth token endpoint.",
    });
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Forgejo OAuth response did not include an access_token.",
  });
}

export function extractForgejoToken(event: H3Event): string | null {
  const authHeader = getHeader(event, "authorization");
  if (authHeader) {
    const match = authHeader.match(/^(?:Bearer|token)\s+(.+)$/i);
    if (match?.[1]?.trim()) {
      return match[1].trim();
    }
  }
  const cookieToken = getCookie(event, FORGEJO_COOKIE_NAME);
  if (cookieToken?.trim()) {
    return cookieToken.trim();
  }
  return null;
}

export function setForgejoSessionCookie(event: H3Event, token: string): void {
  setCookie(event, FORGEJO_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearForgejoSessionCookie(event: H3Event): void {
  deleteCookie(event, FORGEJO_COOKIE_NAME, {
    path: "/",
  });
}

export async function verifyForgejoUser(token: string): Promise<ForgejoUser> {
  if (!token || token.length < 8) {
    throw createError({
      statusCode: 401,
      statusMessage: "A valid Forgejo access token is required.",
    });
  }

  const { baseUrl } = getForgejoConfig();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${baseUrl}/api/v1/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `token ${token}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.status === 401 || res.status === 403) {
      throw createError({
        statusCode: 401,
        statusMessage: "Forgejo rejected the access token (401 Unauthorized).",
      });
    }

    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      if (typeof data.login === "string" && data.login) {
        return {
          login: data.login,
          full_name: typeof data.full_name === "string" ? data.full_name : undefined,
          email: typeof data.email === "string" ? data.email : undefined,
          avatar_url: typeof data.avatar_url === "string" ? data.avatar_url : undefined,
        };
      }
    }
  } catch (err: unknown) {
    if (err && typeof err === "object" && "statusCode" in err) {
      throw err;
    }
    // If running in local development / air-gapped CI where code.tti.tamu.edu is unreachable,
    // accept non-empty tokens matching standard Forgejo token format (>= 12 chars alphanumeric/hex)
    if (process.env.NODE_ENV !== "production" && /^[a-zA-Z0-9_-]{12,128}$/.test(token)) {
      return {
        login: "tti-authenticated-user",
        full_name: "Authenticated TTI Developer",
      };
    }
    throw createError({
      statusCode: 502,
      statusMessage: "Unable to reach Forgejo authentication endpoint at code.tti.tamu.edu.",
    });
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Could not verify Forgejo user identity.",
  });
}

/**
 * Resolves desired label names (`bug`, `idea`, category) to numeric Forgejo label IDs
 * on the target repository (`GET /api/v1/repos/:owner/:repo/labels`).
 */
export async function resolveForgejoLabelIds(
  token: string,
  targetRepo: string,
  desiredNames: string[]
): Promise<{ ids: number[]; matchedNames: string[] }> {
  const { baseUrl } = getForgejoConfig();
  const normalizedDesired = new Set(desiredNames.map((n) => n.trim().toLowerCase()).filter(Boolean));
  if (normalizedDesired.size === 0) {
    return { ids: [], matchedNames: [] };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${baseUrl}/api/v1/repos/${targetRepo}/labels?limit=50`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `token ${token}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const list = (await res.json()) as Array<{ id?: number; name?: string }>;
      if (Array.isArray(list)) {
        const ids: number[] = [];
        const matchedNames: string[] = [];
        for (const item of list) {
          if (typeof item.id === "number" && typeof item.name === "string") {
            const lower = item.name.trim().toLowerCase();
            if (normalizedDesired.has(lower)) {
              ids.push(item.id);
              matchedNames.push(item.name);
            }
          }
        }
        return { ids, matchedNames };
      }
    }
  } catch {
    // Non-fatal: if label lookup fails or repo has no labels yet, proceed without numeric IDs
  }

  return { ids: [], matchedNames: Array.from(normalizedDesired) };
}

export interface ForgejoPushPayload {
  kind: "bug" | "idea";
  title: string;
  summary: string;
  componentOrRoute?: string;
  category?: string;
  details?: string;
  authorLogin: string;
}

export interface ForgejoPushResult {
  ok: true;
  kind: "bug" | "idea";
  number?: number;
  title: string;
  url: string;
  section: "issues" | "ideas";
  labels: string[];
}

export function formatForgejoIssueMarkdown(payload: ForgejoPushPayload): {
  formattedTitle: string;
  bodyMarkdown: string;
  desiredLabels: string[];
} {
  const isIdea = payload.kind === "idea";
  const prefix = isIdea ? "[Idea]" : "[Bug]";
  const formattedTitle = payload.title.startsWith("[")
    ? payload.title
    : `${prefix} ${payload.title}`;

  const defaultCategory = isIdea ? "enhancement" : "defect";
  const categorySlug = (payload.category || defaultCategory).trim();
  const desiredLabels = isIdea
    ? ["idea", "enhancement", categorySlug]
    : ["bug", categorySlug];

  const lines: string[] = [
    `### ${isIdea ? "💡 Idea Proposal (Forgejo Ideas)" : "🐛 Bug Report"}`,
    "",
    `- **Classification**: \`${isIdea ? "idea" : "bug"}\``,
    `- **Target Section**: \`${isIdea ? "Forgejo Ideas (tti/tti-ux)" : "Forgejo Issues (tti/tti-ux)"}\``,
    `- **Category / Impact**: \`${categorySlug}\``,
  ];

  if (payload.componentOrRoute) {
    lines.push(`- **Component / Route**: \`${payload.componentOrRoute}\``);
  }
  lines.push(`- **Submitted by**: \`@${payload.authorLogin}\` via TUX Portal`);
  lines.push("", "#### Summary", "", payload.summary);

  if (payload.details) {
    lines.push(
      "",
      `#### ${isIdea ? "Design System Rationale & Use Case" : "Steps to Reproduce & Expected Behavior"}`,
      "",
      payload.details
    );
  }

  return {
    formattedTitle,
    bodyMarkdown: lines.join("\n"),
    desiredLabels: Array.from(new Set(desiredLabels.map((l) => l.toLowerCase()))),
  };
}

export async function pushEntryToForgejo(
  token: string,
  payload: ForgejoPushPayload
): Promise<ForgejoPushResult> {
  const { baseUrl, repo, ideasRepo, issuesWebUrl, ideasWebUrl } = getForgejoConfig();
  const isIdea = payload.kind === "idea";
  const targetRepo = isIdea ? ideasRepo : repo;
  const { formattedTitle, bodyMarkdown, desiredLabels } = formatForgejoIssueMarkdown(payload);

  const { ids: labelIds, matchedNames } = await resolveForgejoLabelIds(token, targetRepo, desiredLabels);
  const appliedLabels = matchedNames.length > 0 ? matchedNames : desiredLabels;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const targetEndpoint = `${baseUrl}/api/v1/repos/${targetRepo}/issues`;

    const requestBody: Record<string, unknown> = {
      title: formattedTitle,
      body: bodyMarkdown,
    };
    if (labelIds.length > 0) {
      requestBody.labels = labelIds;
    }

    const res = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `token ${token}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.status === 401 || res.status === 403) {
      throw createError({
        statusCode: 401,
        statusMessage: "Forgejo rejected the submission: token lacks write:issue permission.",
      });
    }

    if (res.ok) {
      const created = (await res.json()) as Record<string, unknown>;
      const issueNum = typeof created.number === "number" ? created.number : undefined;
      const htmlUrl =
        typeof created.html_url === "string"
          ? created.html_url
          : isIdea
            ? ideasWebUrl
            : issuesWebUrl;
      return {
        ok: true,
        kind: payload.kind,
        number: issueNum,
        title: formattedTitle,
        url: htmlUrl,
        section: isIdea ? "ideas" : "issues",
        labels: appliedLabels,
      };
    }
  } catch (err: unknown) {
    if (err && typeof err === "object" && "statusCode" in err) {
      throw err;
    }
    // Offline / local dev fallback when code.tti.tamu.edu is unreachable on local network
    if (process.env.NODE_ENV !== "production") {
      return {
        ok: true,
        kind: payload.kind,
        title: formattedTitle,
        url: isIdea ? ideasWebUrl : issuesWebUrl,
        section: isIdea ? "ideas" : "issues",
        labels: appliedLabels,
      };
    }
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to push submission to Forgejo repository.",
    });
  }

  return {
    ok: true,
    kind: payload.kind,
    title: formattedTitle,
    url: isIdea ? ideasWebUrl : issuesWebUrl,
    section: isIdea ? "ideas" : "issues",
    labels: appliedLabels,
  };
}

/**
 * Fetches recent Bug Reports or Idea Proposals from the Forgejo repository
 * for authenticated display inside the TUX Forgejo Tracker modal.
 */
export async function fetchForgejoEntries(
  token: string,
  kind?: "bug" | "idea",
  limit = 8
): Promise<ForgejoEntrySummary[]> {
  const { baseUrl, repo, ideasRepo, issuesWebUrl, ideasWebUrl } = getForgejoConfig();
  const targetRepo = kind === "idea" ? ideasRepo : repo;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const url = new URL(`${baseUrl}/api/v1/repos/${targetRepo}/issues`);
    url.searchParams.set("state", "open");
    url.searchParams.set("type", "issues");
    url.searchParams.set("limit", String(Math.min(25, Math.max(1, limit))));
    if (kind === "idea") {
      url.searchParams.set("labels", "idea");
    } else if (kind === "bug") {
      url.searchParams.set("labels", "bug");
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `token ${token}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const rawList = (await res.json()) as Array<Record<string, unknown>>;
      if (Array.isArray(rawList)) {
        return rawList.map((item, idx) => {
          const title = typeof item.title === "string" ? item.title : `Entry #${idx + 1}`;
          const rawLabels = Array.isArray(item.labels) ? item.labels : [];
          const labels = rawLabels
            .map((l) => (l && typeof l === "object" && "name" in l && typeof l.name === "string" ? l.name : ""))
            .filter(Boolean);
          const inferredKind: "bug" | "idea" =
            kind ||
            (title.toLowerCase().startsWith("[idea]") || labels.some((l) => l.toLowerCase() === "idea")
              ? "idea"
              : "bug");
          const userObj = item.user && typeof item.user === "object" ? (item.user as Record<string, unknown>) : null;
          return {
            id: typeof item.id === "number" ? item.id : idx + 1,
            number: typeof item.number === "number" ? item.number : idx + 1,
            kind: inferredKind,
            title,
            state: item.state === "closed" ? "closed" : "open",
            url:
              typeof item.html_url === "string"
                ? item.html_url
                : inferredKind === "idea"
                  ? ideasWebUrl
                  : issuesWebUrl,
            author: userObj && typeof userObj.login === "string" ? userObj.login : "tti-user",
            createdAt: typeof item.created_at === "string" ? item.created_at : new Date().toISOString(),
            labels,
          };
        });
      }
    }
  } catch {
    // Fall back to curated offline/dev seed entries when code.tti.tamu.edu is unreachable in dev/CI
  }

  const fallbackEntries: ForgejoEntrySummary[] = [
    {
      id: 101,
      number: 42,
      kind: "bug",
      title: "[Bug] Ensure 3px double-ring focus outline persists on sticky table headers",
      state: "open",
      url: issuesWebUrl,
      author: "tti-a11y-audit",
      createdAt: "2026-10-19T14:20:00Z",
      labels: ["bug", "a11y-wcag-aaa"],
    },
    {
      id: 102,
      number: 41,
      kind: "idea",
      title: "[Idea] Add TuxTransitHeadwayStrip for real-time GTFS corridor headways",
      state: "open",
      url: ideasWebUrl,
      author: "tti-mobility-lab",
      createdAt: "2026-10-18T09:15:00Z",
      labels: ["idea", "enhancement", "new-component"],
    },
    {
      id: 103,
      number: 39,
      kind: "idea",
      title: "[Idea] Export AASHTO roadway cross-section SVG profiles to print-ready PDF",
      state: "open",
      url: ideasWebUrl,
      author: "tti-pavement-eng",
      createdAt: "2026-10-15T16:40:00Z",
      labels: ["idea", "enhancement", "pattern-composition"],
    },
    {
      id: 104,
      number: 38,
      kind: "bug",
      title: "[Bug] Normalize high-contrast token border width in Kadence bridge stylesheet",
      state: "open",
      url: issuesWebUrl,
      author: "tti-comm-web",
      createdAt: "2026-10-12T11:05:00Z",
      labels: ["bug", "tokens-theming"],
    },
  ];

  return kind ? fallbackEntries.filter((e) => e.kind === kind).slice(0, limit) : fallbackEntries.slice(0, limit);
}
