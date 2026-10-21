/**
 * TuxDocsSidebar (also exported as TuxSidebar) — Hierarchical documentation & application sidebar.
 * React port of app/components/TuxDocsSidebar.vue.
 */
import React, { forwardRef, useEffect, useMemo, useState, type HTMLAttributes, type ReactNode } from "react";

export interface TuxSidebarNode {
  label: string;
  to?: string;
  href?: string;
  icon?: ReactNode;
  badge?: string;
  count?: number;
  defaultOpen?: boolean;
  children?: TuxSidebarNode[];
}

export interface TuxDocsSidebarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Hierarchical navigation tree. */
  tree?: TuxSidebarNode[];
  /** Currently active route path for highlighting active items and auto-expanding parent groups. */
  activePath?: string;
  /** Accessible landmark label & optional visual title. */
  title?: string;
  /** Show filter search input at top of sidebar. */
  search?: boolean;
  /** Placeholder text for the filter input. */
  searchPlaceholder?: string;
  /** LocalStorage key to persist open/closed group state. */
  storageKey?: string;
  /** When true, opening one top-level group closes sibling top-level groups. */
  exclusiveTopLevel?: boolean;
  /** Optional footer slot content rendered at the bottom of the sidebar. */
  footer?: ReactNode;
  children?: ReactNode;
}

function nodeContainsPath(node: TuxSidebarNode, currentPath?: string): boolean {
  if (!currentPath) return false;
  const target = node.to ?? node.href;
  if (target && currentPath === target) return true;
  if (node.children) {
    return node.children.some((c) => nodeContainsPath(c, currentPath));
  }
  return false;
}

export const TuxDocsSidebar = forwardRef<HTMLElement, TuxDocsSidebarProps>(
  function TuxDocsSidebar(
    {
      tree = [],
      activePath,
      title = "Documentation navigation",
      search = true,
      searchPlaceholder = "Filter navigation…",
      storageKey = "tux-docs-sidebar",
      exclusiveTopLevel = false,
      footer,
      children,
      className = "",
      style,
      ...restProps
    },
    ref,
  ) {
    const [query, setQuery] = useState("");
    const currentPath =
      activePath ?? (typeof window !== "undefined" ? window.location.pathname : "");

    const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
      const initial: Record<string, boolean> = {};
      const walk = (nodes: TuxSidebarNode[], prefix = "") => {
        for (const n of nodes) {
          const key = `${prefix}/${n.label}`;
          if (n.children?.length) {
            initial[key] = n.defaultOpen ?? nodeContainsPath(n, currentPath);
            walk(n.children, key);
          }
        }
      };
      walk(tree);
      return initial;
    });

    useEffect(() => {
      if (!storageKey || typeof window === "undefined") return;
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, boolean>;
          setOpenMap((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // Ignore storage errors
      }
    }, [storageKey]);

    const toggleNode = (key: string) => {
      const parts = key.split("/").filter(Boolean);
      const isTopLevel = parts.length === 1;
      const willOpen = !openMap[key];

      setOpenMap((prev) => {
        const next = { ...prev };
        if (exclusiveTopLevel && isTopLevel && willOpen) {
          for (const existingKey of Object.keys(next)) {
            const existingParts = existingKey.split("/").filter(Boolean);
            if (existingParts.length === 1 && existingKey !== key) {
              next[existingKey] = false;
            }
          }
        }
        next[key] = willOpen;
        if (storageKey && typeof window !== "undefined") {
          try {
            window.localStorage.setItem(storageKey, JSON.stringify(next));
          } catch {
            // Ignore storage errors
          }
        }
        return next;
      });
    };

    const filteredTree = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return tree;

      const filterNodes = (nodes: TuxSidebarNode[]): TuxSidebarNode[] => {
        const out: TuxSidebarNode[] = [];
        for (const n of nodes) {
          const selfMatch = n.label.toLowerCase().includes(q);
          const childMatches = n.children ? filterNodes(n.children) : [];
          if (selfMatch || childMatches.length > 0) {
            out.push({
              ...n,
              children: childMatches.length > 0 ? childMatches : n.children,
            });
          }
        }
        return out;
      };
      return filterNodes(tree);
    }, [tree, query]);

    const isOpen = (key: string) => {
      if (query.trim()) return true;
      return Boolean(openMap[key]);
    };

    const isActive = (node: TuxSidebarNode) => {
      const target = node.to ?? node.href;
      if (!target || !currentPath) return false;
      return currentPath === target;
    };

    return (
      <nav
        ref={ref}
        aria-label={title}
        className={`tux-docs-sidebar tux-sidebar ${className}`.trim()}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          fontFamily: "var(--font-body, system-ui, sans-serif)",
          color: "var(--text-primary, #191919)",
          ...style,
        }}
        {...restProps}
      >
        {search && tree.length > 0 && (
          <div className="tux-docs-sidebar__search" style={{ position: "relative" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="tux-docs-sidebar__search-input"
              style={{
                width: "100%",
                padding: "0.45rem 0.75rem",
                fontSize: "0.875rem",
                borderRadius: "0.375rem",
                border: "1px solid var(--surface-border, #d6d3d1)",
                background: "var(--surface-sunken, #f5f5f4)",
                color: "var(--text-primary, #191919)",
              }}
            />
          </div>
        )}

        {tree.length > 0 && (
          <ul
            className="tux-docs-sidebar__list"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              fontSize: "0.875rem",
            }}
          >
            {filteredTree.map((section) => {
              const sectionKey = `/${section.label}`;
              const sectionOpen = isOpen(sectionKey);
              const activeSection = isActive(section);
              const targetUrl = section.to ?? section.href;

              return (
                <li key={section.label} className="tux-docs-sidebar__section">
                  {section.children && section.children.length > 0 ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={sectionOpen}
                        onClick={() => toggleNode(sectionKey)}
                        className="tux-docs-sidebar__group-btn"
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.5rem",
                          padding: "0.45rem 0.625rem",
                          borderRadius: "0.375rem",
                          border: "none",
                          background: "transparent",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: "var(--text-primary, #191919)",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                          {section.icon}
                          <span>{section.label}</span>
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                          {section.count != null && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontFamily: "var(--font-mono, monospace)",
                                color: "var(--text-muted, #57534e)",
                              }}
                            >
                              {section.count}
                            </span>
                          )}
                          <span
                            aria-hidden="true"
                            style={{
                              display: "inline-block",
                              transition: "transform 150ms ease",
                              transform: sectionOpen ? "rotate(90deg)" : "rotate(0deg)",
                            }}
                          >
                            ▸
                          </span>
                        </span>
                      </button>

                      {sectionOpen && (
                        <ul
                          className="tux-docs-sidebar__sublist"
                          style={{
                            listStyle: "none",
                            margin: "0.25rem 0 0.25rem 0.75rem",
                            padding: "0 0 0 0.625rem",
                            borderLeft: "1px solid var(--surface-border, #d6d3d1)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.125rem",
                          }}
                        >
                          {section.children.map((leaf) => {
                            const leafKey = `${sectionKey}/${leaf.label}`;
                            const leafOpen = isOpen(leafKey);
                            const leafActive = isActive(leaf);
                            const leafUrl = leaf.to ?? leaf.href ?? "#";

                            if (leaf.children && leaf.children.length > 0) {
                              return (
                                <li key={leaf.label}>
                                  <button
                                    type="button"
                                    aria-expanded={leafOpen}
                                    onClick={() => toggleNode(leafKey)}
                                    style={{
                                      width: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      padding: "0.35rem 0.5rem",
                                      border: "none",
                                      background: "transparent",
                                      fontSize: "0.8125rem",
                                      fontWeight: 600,
                                      color: "var(--text-secondary, #44403c)",
                                      cursor: "pointer",
                                      textAlign: "left",
                                    }}
                                  >
                                    <span>{leaf.label}</span>
                                    <span
                                      aria-hidden="true"
                                      style={{
                                        display: "inline-block",
                                        transform: leafOpen ? "rotate(90deg)" : "rotate(0deg)",
                                      }}
                                    >
                                      ▸
                                    </span>
                                  </button>
                                  {leafOpen && (
                                    <ul
                                      style={{
                                        listStyle: "none",
                                        margin: "0.125rem 0 0.25rem 0.5rem",
                                        padding: "0 0 0 0.5rem",
                                        borderLeft: "1px solid var(--surface-border, #d6d3d1)",
                                      }}
                                    >
                                      {leaf.children.map((sub) => {
                                        const subActive = isActive(sub);
                                        const subUrl = sub.to ?? sub.href ?? "#";
                                        return (
                                          <li key={sub.label}>
                                            <a
                                              href={subUrl}
                                              aria-current={subActive ? "page" : undefined}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: "0.35rem 0.5rem",
                                                borderRadius: "0.25rem",
                                                textDecoration: "none",
                                                fontSize: "0.8125rem",
                                                fontWeight: subActive ? 600 : 400,
                                                color: subActive
                                                  ? "var(--brand-primary, #500000)"
                                                  : "var(--text-secondary, #44403c)",
                                                background: subActive
                                                  ? "var(--surface-sunken, #f5f5f4)"
                                                  : "transparent",
                                              }}
                                            >
                                              <span>{sub.label}</span>
                                              {sub.badge && (
                                                <span
                                                  style={{
                                                    fontSize: "0.6875rem",
                                                    fontFamily: "var(--font-mono, monospace)",
                                                    padding: "0.1rem 0.35rem",
                                                    borderRadius: "0.25rem",
                                                    background: "var(--surface-sunken, #f5f5f4)",
                                                  }}
                                                >
                                                  {sub.badge}
                                                </span>
                                              )}
                                            </a>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </li>
                              );
                            }

                            return (
                              <li key={leaf.label}>
                                <a
                                  href={leafUrl}
                                  aria-current={leafActive ? "page" : undefined}
                                  className="tux-docs-sidebar__link"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "0.5rem",
                                    padding: "0.375rem 0.625rem",
                                    borderRadius: "0.375rem",
                                    textDecoration: "none",
                                    fontWeight: leafActive ? 600 : 400,
                                    color: leafActive
                                      ? "var(--brand-primary, #500000)"
                                      : "var(--text-secondary, #44403c)",
                                    background: leafActive
                                      ? "var(--surface-sunken, #f5f5f4)"
                                      : "transparent",
                                  }}
                                >
                                  <span>{leaf.label}</span>
                                  {leaf.badge && (
                                    <span
                                      style={{
                                        fontSize: "0.6875rem",
                                        fontFamily: "var(--font-mono, monospace)",
                                        padding: "0.1rem 0.375rem",
                                        borderRadius: "0.25rem",
                                        background: "var(--surface-sunken, #f5f5f4)",
                                        color: "var(--text-muted, #57534e)",
                                      }}
                                    >
                                      {leaf.badge}
                                    </span>
                                  )}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <a
                      href={targetUrl ?? "#"}
                      aria-current={activeSection ? "page" : undefined}
                      className="tux-docs-sidebar__link"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        padding: "0.45rem 0.625rem",
                        borderRadius: "0.375rem",
                        textDecoration: "none",
                        fontWeight: activeSection ? 700 : 500,
                        color: activeSection
                          ? "var(--brand-primary, #500000)"
                          : "var(--text-primary, #191919)",
                        background: activeSection
                          ? "var(--surface-sunken, #f5f5f4)"
                          : "transparent",
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        {section.icon}
                        <span>{section.label}</span>
                      </span>
                      {section.badge && (
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontFamily: "var(--font-mono, monospace)",
                            padding: "0.1rem 0.375rem",
                            borderRadius: "0.25rem",
                            background: "var(--surface-sunken, #f5f5f4)",
                            color: "var(--text-muted, #57534e)",
                          }}
                        >
                          {section.badge}
                        </span>
                      )}
                    </a>
                  )}
                </li>
              );
            })}

            {filteredTree.length === 0 && (
              <li
                style={{
                  padding: "0.75rem",
                  fontSize: "0.75rem",
                  color: "var(--text-muted, #57534e)",
                }}
              >
                No navigation items match &ldquo;{query}&rdquo;.
              </li>
            )}
          </ul>
        )}

        {children}

        {footer && (
          <div
            className="tux-docs-sidebar__footer"
            style={{
              paddingTop: "0.75rem",
              borderTop: "1px solid var(--surface-border, #d6d3d1)",
            }}
          >
            {footer}
          </div>
        )}
      </nav>
    );
  },
);

/** Alias `TuxSidebar` -> `TuxDocsSidebar` for ergonomic imports (`import { TuxSidebar } from "@tti/tti-ux-react"`). */
export const TuxSidebar = TuxDocsSidebar;
export type TuxSidebarProps = TuxDocsSidebarProps;

export default TuxDocsSidebar;
