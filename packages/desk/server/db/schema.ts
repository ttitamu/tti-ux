import { index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type {
  FeedbackReason,
  IssueKind,
  IssueStatus,
  MediaKind,
  PageStatus,
  Visibility,
} from "./types";

function id(name = "id") {
  return text(name).primaryKey().$defaultFn(() => crypto.randomUUID());
}

function timestamps() {
  return {
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  };
}

export const users = pgTable("desk_users", {
  id: id(),
  email: text("email"),
  name: text("name"),
  login: text("login").notNull(),
  groups: jsonb("groups").$type<string[]>().notNull().default([]),
  ...timestamps(),
}, (table) => [
  uniqueIndex("desk_users_login").on(table.login),
]);

export const orgUnits = pgTable("desk_org_units", {
  id: id(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  ownerUserId: text("owner_user_id").notNull(),
  defaultVisibility: text("default_visibility").$type<Visibility>().notNull().default("internal"),
  ...timestamps(),
}, (table) => [
  uniqueIndex("desk_org_units_slug").on(table.slug),
]);

export const pages = pgTable("desk_pages", {
  id: id(),
  orgUnitId: text("org_unit_id").notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  status: text("status").$type<PageStatus>().notNull().default("draft"),
  visibility: text("visibility").$type<Visibility>().notNull().default("internal"),
  ownerUserId: text("owner_user_id").notNull(),
  verifiedUntil: timestamp("verified_until", { withTimezone: true }),
  reviewCadenceDays: integer("review_cadence_days").notNull().default(90),
  liveRevisionId: text("live_revision_id"),
  draftRevisionId: text("draft_revision_id"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps(),
}, (table) => [
  uniqueIndex("desk_pages_slug").on(table.orgUnitId, table.slug),
  index("desk_pages_status").on(table.status),
  index("desk_pages_owner").on(table.ownerUserId),
]);

export const revisions = pgTable("desk_revisions", {
  id: id(),
  pageId: text("page_id").notNull(),
  bodyMd: text("body_md").notNull().default(""),
  bodyJson: jsonb("body_json").$type<Record<string, unknown>>(),
  authorUserId: text("author_user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("desk_revisions_page").on(table.pageId),
]);

export const issues = pgTable("desk_issues", {
  id: id(),
  pageId: text("page_id").notNull(),
  kind: text("kind").$type<IssueKind>().notNull(),
  status: text("status").$type<IssueStatus>().notNull().default("open"),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  ...timestamps(),
}, (table) => [
  index("desk_issues_page").on(table.pageId),
  index("desk_issues_status").on(table.status),
]);

export const media = pgTable("desk_media", {
  id: id(),
  filename: text("filename").notNull(),
  mime: text("mime").notNull(),
  bytes: integer("bytes").notNull(),
  kind: text("kind").$type<MediaKind>().notNull(),
  uploaderUserId: text("uploader_user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable("desk_events", {
  id: id(),
  pageId: text("page_id").notNull(),
  sessionId: text("session_id").notNull(),
  type: text("type").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("desk_events_page_created").on(table.pageId, table.createdAt),
]);
