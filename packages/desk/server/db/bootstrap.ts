export const BOOTSTRAP_SQL = `
CREATE TABLE IF NOT EXISTS desk_users (
  id text PRIMARY KEY,
  email text,
  name text,
  login text NOT NULL,
  groups jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS desk_users_login ON desk_users (login);

CREATE TABLE IF NOT EXISTS desk_org_units (
  id text PRIMARY KEY,
  slug text NOT NULL,
  title text NOT NULL,
  owner_user_id text NOT NULL,
  default_visibility text NOT NULL DEFAULT 'internal',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS desk_org_units_slug ON desk_org_units (slug);

CREATE TABLE IF NOT EXISTS desk_pages (
  id text PRIMARY KEY,
  org_unit_id text NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  visibility text NOT NULL DEFAULT 'internal',
  owner_user_id text NOT NULL,
  verified_until timestamptz,
  review_cadence_days integer NOT NULL DEFAULT 90,
  live_revision_id text,
  draft_revision_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS desk_pages_slug ON desk_pages (org_unit_id, slug);
CREATE INDEX IF NOT EXISTS desk_pages_status ON desk_pages (status);
CREATE INDEX IF NOT EXISTS desk_pages_owner ON desk_pages (owner_user_id);

CREATE TABLE IF NOT EXISTS desk_revisions (
  id text PRIMARY KEY,
  page_id text NOT NULL,
  body_md text NOT NULL DEFAULT '',
  body_json jsonb,
  author_user_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS desk_revisions_page ON desk_revisions (page_id);

CREATE TABLE IF NOT EXISTS desk_issues (
  id text PRIMARY KEY,
  page_id text NOT NULL,
  kind text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS desk_issues_page ON desk_issues (page_id);
CREATE INDEX IF NOT EXISTS desk_issues_status ON desk_issues (status);

CREATE TABLE IF NOT EXISTS desk_media (
  id text PRIMARY KEY,
  filename text NOT NULL,
  mime text NOT NULL,
  bytes integer NOT NULL,
  kind text NOT NULL,
  uploader_user_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS desk_events (
  id text PRIMARY KEY,
  page_id text NOT NULL,
  session_id text NOT NULL,
  type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS desk_events_page_created ON desk_events (page_id, created_at);
`;
