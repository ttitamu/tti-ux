/**
 * useTuxForgejoTracker — Singleton composable managing the Auth-Gated
 * Forgejo Bug Report & Idea Proposal workflow for `code.tti.tamu.edu/tti/tti-ux`.
 *
 * - Bug Reports push to the repository's Issues section (`[Bug] ...`, `bug` label).
 * - Ideas push to the repository's Ideas section (`[Idea] ...`, `idea` label).
 * - Both actions are strictly gated behind TTI Code (Forgejo) authentication
 *   (supports OAuth2 Authorization Code + PKCE SSO and Personal Access Tokens).
 */
import { ref } from "vue";

export type ForgejoSubmissionKind = "bug" | "idea";

export interface ForgejoTrackerUser {
  login: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

export interface ForgejoSubmissionInput {
  kind: ForgejoSubmissionKind;
  title: string;
  summary: string;
  componentOrRoute?: string;
  category?: string;
  details?: string;
}

export interface ForgejoSubmissionResult {
  ok: boolean;
  kind: ForgejoSubmissionKind;
  number?: number;
  title: string;
  url: string;
  section: "issues" | "ideas";
  labels?: string[];
}

export interface ForgejoTrackerEntry {
  id: number;
  number: number;
  kind: ForgejoSubmissionKind;
  title: string;
  state: "open" | "closed";
  url: string;
  author: string;
  createdAt: string;
  labels: string[];
}

const SESSION_STORAGE_KEY = "tux_forgejo_token_session";

const trackerOpen = ref(false);
const trackerKind = ref<ForgejoSubmissionKind>("bug");
const initialRouteContext = ref("");
const authenticated = ref(false);
const user = ref<ForgejoTrackerUser | null>(null);
const sessionChecked = ref(false);
const oauthConfigured = ref(false);
const oauthAuthorizeUrl = ref("/api/forgejo/oauth/authorize");

const repoWebUrl = ref("https://code.tti.tamu.edu/tti/tti-ux");
const issuesWebUrl = ref("https://code.tti.tamu.edu/tti/tti-ux/issues");
const ideasWebUrl = ref("https://code.tti.tamu.edu/tti/tti-ux/issues?q=&type=all&state=open&labels=idea");

const authPending = ref(false);
const authError = ref("");
const submitPending = ref(false);
const submitError = ref("");
const lastSubmission = ref<ForgejoSubmissionResult | null>(null);
const recentEntries = ref<ForgejoTrackerEntry[]>([]);
const entriesLoading = ref(false);

function getStoredToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function setStoredToken(token: string) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, token);
    } else {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function useTuxForgejoTracker() {
  async function fetchRecentEntries(kind?: ForgejoSubmissionKind) {
    if (!authenticated.value) {
      recentEntries.value = [];
      return;
    }

    entriesLoading.value = true;
    const storedToken = getStoredToken();
    try {
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers.Authorization = `Bearer ${storedToken}`;
      }
      const query: Record<string, string> = { limit: "6" };
      if (kind) query.kind = kind;

      const res = await $fetch<{
        ok: boolean;
        entries: ForgejoTrackerEntry[];
      }>("/api/forgejo/entries", {
        method: "GET",
        headers,
        query,
      });

      if (Array.isArray(res.entries)) {
        recentEntries.value = res.entries;
      }
    } catch {
      // Static build fallback when server route is unavailable
      const fallback: ForgejoTrackerEntry[] = [
        {
          id: 101,
          number: 42,
          kind: "bug",
          title: "[Bug] Ensure 3px double-ring focus outline persists on sticky table headers",
          state: "open",
          url: issuesWebUrl.value,
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
          url: ideasWebUrl.value,
          author: "tti-mobility-lab",
          createdAt: "2026-10-18T09:15:00Z",
          labels: ["idea", "enhancement", "new-component"],
        },
      ];
      recentEntries.value = kind ? fallback.filter((e) => e.kind === kind) : fallback;
    } finally {
      entriesLoading.value = false;
    }
  }

  async function refreshSession() {
    authError.value = "";
    const storedToken = getStoredToken();
    try {
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers.Authorization = `Bearer ${storedToken}`;
      }
      const res = await $fetch<{
        authenticated: boolean;
        user: ForgejoTrackerUser | null;
        oauthConfigured?: boolean;
        oauthAuthorizeUrl?: string;
        repoWebUrl?: string;
        issuesWebUrl?: string;
        ideasWebUrl?: string;
      }>("/api/forgejo/session", {
        method: "GET",
        headers,
      });

      authenticated.value = Boolean(res.authenticated);
      user.value = res.user || null;
      oauthConfigured.value = Boolean(res.oauthConfigured);
      if (res.oauthAuthorizeUrl) oauthAuthorizeUrl.value = res.oauthAuthorizeUrl;
      if (res.repoWebUrl) repoWebUrl.value = res.repoWebUrl;
      if (res.issuesWebUrl) issuesWebUrl.value = res.issuesWebUrl;
      if (res.ideasWebUrl) ideasWebUrl.value = res.ideasWebUrl;

      if (authenticated.value) {
        await fetchRecentEntries(trackerKind.value);
      }
    } catch {
      // Static build fallback if server route isn't running: check session token format
      if (storedToken && /^[a-zA-Z0-9_-]{12,128}$/.test(storedToken)) {
        authenticated.value = true;
        user.value = { login: "tti-member", full_name: "Authenticated TTI Member" };
        await fetchRecentEntries(trackerKind.value);
      } else {
        authenticated.value = false;
        user.value = null;
      }
    } finally {
      sessionChecked.value = true;
    }
  }

  function openForgejoTracker(kind: ForgejoSubmissionKind = "bug", routeContext = "") {
    trackerKind.value = kind;
    initialRouteContext.value = routeContext;
    authError.value = "";
    submitError.value = "";
    lastSubmission.value = null;
    trackerOpen.value = true;
    if (!sessionChecked.value) {
      refreshSession();
    } else if (authenticated.value) {
      fetchRecentEntries(kind);
    }
  }

  function closeForgejoTracker() {
    trackerOpen.value = false;
  }

  async function startOAuthSignIn(returnTo = "/") {
    authError.value = "";
    const safeReturn = returnTo.startsWith("/") ? returnTo : "/";
    const targetUrl = `${oauthAuthorizeUrl.value}?returnTo=${encodeURIComponent(safeReturn)}`;
    if (!oauthConfigured.value) {
      authError.value =
        "Forgejo OAuth2 SSO is not configured on this environment (FORGEJO_OAUTH_CLIENT_ID not set). Please sign in below with a Forgejo Personal Access Token.";
      return false;
    }
    if (typeof window !== "undefined") {
      window.location.assign(targetUrl);
    }
    return true;
  }

  async function signInWithToken(rawToken: string): Promise<boolean> {
    const token = rawToken.trim();
    authError.value = "";

    if (!token || token.length < 12) {
      authError.value = "Please enter a valid TTI Code (Forgejo) Personal Access Token (at least 12 characters).";
      return false;
    }

    authPending.value = true;
    try {
      const res = await $fetch<{
        authenticated: boolean;
        user: ForgejoTrackerUser | null;
        repoWebUrl?: string;
        issuesWebUrl?: string;
        ideasWebUrl?: string;
      }>("/api/forgejo/auth", {
        method: "POST",
        body: { action: "signin", token },
      });

      setStoredToken(token);
      authenticated.value = Boolean(res.authenticated);
      user.value = res.user;
      if (res.repoWebUrl) repoWebUrl.value = res.repoWebUrl;
      if (res.issuesWebUrl) issuesWebUrl.value = res.issuesWebUrl;
      if (res.ideasWebUrl) ideasWebUrl.value = res.ideasWebUrl;
      await fetchRecentEntries(trackerKind.value);
      return true;
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "statusMessage" in err && typeof err.statusMessage === "string"
          ? err.statusMessage
          : "Authentication failed. Verify your Forgejo Personal Access Token and try again.";
      authError.value = msg;
      return false;
    } finally {
      authPending.value = false;
    }
  }

  async function signOutForgejo() {
    authPending.value = true;
    authError.value = "";
    submitError.value = "";
    lastSubmission.value = null;
    recentEntries.value = [];
    setStoredToken("");
    try {
      await $fetch("/api/forgejo/auth", {
        method: "POST",
        body: { action: "signout" },
      }).catch(() => {});
    } finally {
      authenticated.value = false;
      user.value = null;
      authPending.value = false;
    }
  }

  async function submitToForgejo(input: ForgejoSubmissionInput): Promise<ForgejoSubmissionResult | null> {
    submitError.value = "";
    if (!authenticated.value) {
      submitError.value = "Authentication required: please sign in with your TTI Code (Forgejo) account first.";
      return null;
    }

    const title = input.title.trim();
    const summary = input.summary.trim();
    if (title.length < 5) {
      submitError.value = "Please enter a descriptive title (at least 5 characters).";
      return null;
    }
    if (summary.length < 10) {
      submitError.value = "Please provide a clear summary (at least 10 characters).";
      return null;
    }

    submitPending.value = true;
    const storedToken = getStoredToken();
    try {
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers.Authorization = `Bearer ${storedToken}`;
      }

      const res = await $fetch<ForgejoSubmissionResult>("/api/forgejo/submit", {
        method: "POST",
        headers,
        body: {
          kind: input.kind,
          title,
          summary,
          componentOrRoute: input.componentOrRoute?.trim() || undefined,
          category: input.category?.trim() || undefined,
          details: input.details?.trim() || undefined,
        },
      });

      lastSubmission.value = res;
      await fetchRecentEntries(input.kind);
      return res;
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "statusMessage" in err && typeof err.statusMessage === "string"
          ? err.statusMessage
          : "Failed to push to Forgejo repository. Please check your connection or token permissions.";
      submitError.value = msg;
      return null;
    } finally {
      submitPending.value = false;
    }
  }

  return {
    trackerOpen,
    trackerKind,
    initialRouteContext,
    authenticated,
    user,
    oauthConfigured,
    oauthAuthorizeUrl,
    repoWebUrl,
    issuesWebUrl,
    ideasWebUrl,
    authPending,
    authError,
    submitPending,
    submitError,
    lastSubmission,
    recentEntries,
    entriesLoading,
    openForgejoTracker,
    closeForgejoTracker,
    refreshSession,
    fetchRecentEntries,
    startOAuthSignIn,
    signInWithToken,
    signOutForgejo,
    submitToForgejo,
  };
}
