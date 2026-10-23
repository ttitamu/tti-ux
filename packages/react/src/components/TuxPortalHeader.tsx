/**
 * TuxPortalHeader — Two-Tier Institutional Header matching tti.tamu.edu & my.tti.tamu.edu.
 * React port of app/components/TuxPortalHeader.vue.
 */
import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { TuxButton } from "./TuxButton";
import { TuxSpectrumRibbon } from "./TuxSpectrumRibbon";

export interface PortalUtilityLink {
  label: string;
  href?: string;
  to?: string;
  icon?: string;
  external?: boolean;
}

export interface PortalNavChild {
  label: string;
  to?: string;
  href?: string;
  description?: string;
  badge?: string;
}

export interface PortalNavItem {
  label: string;
  to?: string;
  href?: string;
  children?: PortalNavChild[];
}

export interface PortalIntranetApp {
  label: string;
  href?: string;
  to?: string;
  icon?: string;
  description?: string;
}

export interface TuxPortalHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Visual & functional mode: 'comm' (public maroon utility bar) or 'intranet' (charcoal bar with social icons + MY APPS launcher). */
  mode?: "comm" | "intranet";
  /** Agency name in Tier 1 utility bar. */
  agencyName?: string;
  /** Agency URL link in Tier 1 utility bar. */
  agencyUrl?: string;
  /** Root home URL when clicking logo. */
  homeUrl?: string;
  /** Sub-brand, research center, or portal title displayed adjacent to the logo. */
  portalTitle?: string;
  /** Optional badge pill next to portal title. */
  portalBadge?: string;
  /** Badge color variant. */
  portalBadgeVariant?: "neutral" | "maroon" | "gold" | "info" | "success";
  /** Tier 1 utility navigation links. */
  utilityLinks?: PortalUtilityLink[];
  /** Whether to render the Tier 1 search trigger button. */
  showSearch?: boolean;
  /** Whether to show the 5-band institutional spectrum ribbon beneath the header. Defaults to true in intranet mode. */
  showSpectrumRibbon?: boolean;
  /** Intranet app links shown in the MY APPS launcher menu (intranet mode). */
  intranetApps?: PortalIntranetApp[];
  /** Primary navigation items in Tier 2. */
  navItems?: PortalNavItem[];
  /** Primary action CTA button label. */
  actionText?: string;
  /** Primary action CTA destination route. */
  actionTo?: string;
  /** Primary action CTA external URL. */
  actionHref?: string;
  /** Sticky-position the header at the top of the viewport. */
  sticky?: boolean;
  /** Max-width container mode: standard (80rem / 7xl), wide (96rem), or full. */
  maxWidth?: "standard" | "wide" | "full";
  /** Accessible label for the navigation landmark (default 'Portal Navigation'). */
  navAriaLabel?: string;
  /** Current active route path for active nav item underline indicator. */
  activePath?: string;
  /** Callback fired when the search button is clicked. */
  onSearchClick?: () => void;
  /** Callback fired when the primary action CTA button is clicked. */
  onActionClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Custom brand logo node override. */
  brand?: ReactNode;
  /** Custom extra content inside the Tier 1 utility bar. */
  utilityExtra?: ReactNode;
  /** Custom CTA action slot override. */
  action?: ReactNode;
  /** Custom footer inside the mobile slideover drawer. */
  mobileDrawerFooter?: ReactNode;
  children?: ReactNode;
}

const DEFAULT_UTILITY_LINKS: PortalUtilityLink[] = [
  { label: "Jobs", href: "https://tti.tamu.edu/careers/" },
  { label: "Pressroom", href: "https://tti.tamu.edu/news/" },
  { label: "Directory", href: "https://tti.tamu.edu/people/" },
  { label: "Contact", href: "https://tti.tamu.edu/contact/" },
];

const DEFAULT_INTRANET_APPS: PortalIntranetApp[] = [
  {
    label: "App Catalog",
    href: "https://my.tti.tamu.edu/app-catalog/",
    description: "Directory of all TTI web apps & internal services",
  },
  {
    label: "People Finder",
    href: "https://my.tti.tamu.edu/directory/",
    description: "Staff directory, phone numbers, and office locations",
  },
  {
    label: "Timecard (SSO)",
    href: "https://sso.tamus.edu/",
    description: "Employee Single Sign-On, Workday, and leave balances",
  },
  {
    label: "Concur Travel",
    href: "https://sso.tamus.edu/",
    description: "Travel authorization, booking, and expense reports",
  },
  {
    label: "Facilities & Safety",
    href: "https://my.tti.tamu.edu/fss/",
    description: "Work orders, building access, and incident reporting",
  },
  {
    label: "IT Helpdesk",
    href: "https://my.tti.tamu.edu/it/",
    description: "Technical support, ticket tracking, and software requests",
  },
];

export const TuxPortalHeader = forwardRef<HTMLElement, TuxPortalHeaderProps>(
  function TuxPortalHeader(
    {
      mode = "comm",
      agencyName = "Texas A&M Transportation Institute",
      agencyUrl = "https://tti.tamu.edu",
      homeUrl = "/",
      portalTitle = "",
      portalBadge = "",
      portalBadgeVariant = "gold",
      utilityLinks = DEFAULT_UTILITY_LINKS,
      showSearch = true,
      showSpectrumRibbon,
      intranetApps = DEFAULT_INTRANET_APPS,
      navItems = [],
      actionText = "",
      actionTo = "",
      actionHref = "",
      sticky = false,
      maxWidth = "standard",
      navAriaLabel = "Portal Navigation",
      activePath,
      onSearchClick,
      onActionClick,
      brand,
      utilityExtra,
      action,
      mobileDrawerFooter,
      children,
      className = "",
      style,
      ...restProps
    },
    ref,
  ) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [myAppsOpen, setMyAppsOpen] = useState(false);
    const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({});
    const mobileToggleBtnRef = useRef<HTMLButtonElement | null>(null);

    const effectiveShowSpectrumRibbon =
      showSpectrumRibbon !== undefined ? showSpectrumRibbon : mode === "intranet";

    const currentPath =
      activePath ?? (typeof window !== "undefined" ? window.location.pathname : "");

    const closeMobileDrawer = (restoreFocus = false) => {
      setMobileOpen(false);
      if (restoreFocus) {
        setTimeout(() => {
          mobileToggleBtnRef.current?.focus();
        }, 0);
      }
    };

    const closeDropdowns = () => {
      setActiveDropdown(null);
      setMyAppsOpen(false);
    };

    useEffect(() => {
      if (typeof window === "undefined") return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && (mobileOpen || activeDropdown || myAppsOpen)) {
          closeDropdowns();
          if (mobileOpen) {
            closeMobileDrawer(true);
          }
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [mobileOpen, activeDropdown, myAppsOpen]);

    const isItemActive = (item: PortalNavItem): boolean => {
      if (!currentPath) return false;
      const target = item.to ?? item.href;
      if (target && currentPath === target) return true;
      if (target && target !== "/" && currentPath.startsWith(target)) return true;
      if (
        item.children?.some((c) => {
          const ct = c.to ?? c.href;
          return ct && (currentPath === ct || (ct !== "/" && currentPath.startsWith(ct)));
        })
      ) {
        return true;
      }
      return false;
    };

    const toggleDropdown = (label: string) => {
      setActiveDropdown((prev) => {
        const next = prev === label ? null : label;
        if (next) setMyAppsOpen(false);
        return next;
      });
    };

    const toggleMyApps = () => {
      setMyAppsOpen((prev) => {
        const next = !prev;
        if (next) setActiveDropdown(null);
        return next;
      });
    };

    const toggleMobileSection = (label: string) => {
      setExpandedMobileSections((prev) => ({
        ...prev,
        [label]: !prev[label],
      }));
    };

    const maxContainerWidth =
      maxWidth === "wide" ? "96rem" : maxWidth === "full" ? "100%" : "80rem";

    return (
      <header
        ref={ref}
        className={`tux-portal-header ${sticky ? "tux-portal-header--sticky" : ""} ${className}`.trim()}
        style={{
          width: "100%",
          borderBottom: "1px solid var(--surface-border, #d6d3d1)",
          fontFamily: "var(--font-body, system-ui, sans-serif)",
          position: sticky ? "sticky" : "relative",
          top: sticky ? 0 : undefined,
          zIndex: 30,
          background: "var(--surface-raised, #ffffff)",
          ...style,
        }}
        {...restProps}
      >
        {/* TIER 1: Utility Bar */}
        <div
          className="tux-portal-header__utility"
          style={{
            background:
              mode === "intranet"
                ? "var(--neutral-900, #171717)"
                : "var(--brand-primary, #500000)",
            color: "var(--text-inverse, #ffffff)",
            fontSize: "0.75rem",
          }}
        >
          <div
            style={{
              maxWidth: maxContainerWidth,
              margin: "0 auto",
              padding: "0.375rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            {/* Left: Agency Mark or Intranet Socials */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {mode === "intranet" ? (
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {agencyName} — Intranet
                </span>
              ) : (
                <a
                  href={agencyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tux-portal-header__agency-link"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontWeight: 600,
                    color: "var(--text-inverse, #ffffff)",
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    fontSize: "0.6875rem",
                  }}
                >
                  <span>{agencyName}</span>
                </a>
              )}
            </div>

            {/* Right: Utility Links, Search & MY APPS Trigger */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
              {utilityLinks.length > 0 && (
                <ul
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {utilityLinks.map((link) => {
                    const url = link.to ?? link.href ?? "#";
                    return (
                      <li key={link.label}>
                        <a
                          href={url}
                          target={link.href && link.external !== false ? "_blank" : undefined}
                          rel={
                            link.href && link.external !== false
                              ? "noopener noreferrer"
                              : undefined
                          }
                          style={{
                            color: "rgba(255,255,255,0.92)",
                            textDecoration: "none",
                            fontSize: "0.6875rem",
                            fontWeight: 500,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}

              {utilityExtra}

              {showSearch && (
                <button
                  type="button"
                  className="tux-portal-header__search-btn"
                  aria-label="Open search dialog"
                  onClick={() => onSearchClick?.()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.15rem 0.625rem",
                    borderRadius: "0.25rem",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    color: "var(--text-inverse, #ffffff)",
                    background: "rgba(0,0,0,0.22)",
                    border: "1px solid rgba(255,255,255,0.24)",
                    cursor: "pointer",
                  }}
                >
                  <span>Search</span>
                  <span style={{ fontSize: "0.625rem", opacity: 0.75, fontFamily: "monospace" }}>
                    ⌘K
                  </span>
                </button>
              )}

              {mode === "intranet" && (
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="tux-portal-header__my-apps-btn"
                    aria-expanded={myAppsOpen}
                    aria-label="Toggle My Apps menu"
                    onClick={toggleMyApps}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.15rem 0.625rem",
                      background: "var(--brand-primary, #500000)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.6875rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      border: "1px solid rgba(214, 154, 45, 0.4)",
                      borderRadius: "0.125rem",
                      cursor: "pointer",
                    }}
                  >
                    <span>MY APPS</span>
                  </button>

                  {myAppsOpen && (
                    <div
                      className="tux-portal-header__my-apps-dropdown"
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        marginTop: "0.375rem",
                        width: "22rem",
                        background: "var(--surface-raised, #ffffff)",
                        border: "1px solid var(--surface-border, #d6d3d1)",
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)",
                        padding: "1rem",
                        zIndex: 50,
                        color: "var(--text-primary, #191919)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingBottom: "0.5rem",
                          marginBottom: "0.75rem",
                          borderBottom: "1px solid var(--surface-border, #d6d3d1)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          TTI Internal Apps
                        </span>
                        <a
                          href="https://my.tti.tamu.edu/app-catalog/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            color: "var(--brand-primary, #500000)",
                            textDecoration: "none",
                          }}
                        >
                          All Apps &rarr;
                        </a>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: "0.5rem",
                        }}
                      >
                        {intranetApps.map((app) => (
                          <a
                            key={app.label}
                            href={app.href ?? app.to ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "block",
                              padding: "0.5rem",
                              borderRadius: "0.25rem",
                              textDecoration: "none",
                              color: "var(--text-primary, #191919)",
                              background: "var(--surface-sunken, #f5f5f4)",
                            }}
                          >
                            <div style={{ fontSize: "0.75rem", fontWeight: 700 }}>{app.label}</div>
                            {app.description && (
                              <div
                                style={{
                                  fontSize: "0.625rem",
                                  color: "var(--text-muted, #57534e)",
                                  marginTop: "0.125rem",
                                }}
                              >
                                {app.description}
                              </div>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TIER 2: Crisp Brand Navigation Ribbon */}
        <div
          className="tux-portal-header__ribbon"
          style={{
            background: "var(--surface-raised, #ffffff)",
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: maxContainerWidth,
              margin: "0 auto",
              padding: "0.625rem 1rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem 1rem",
            }}
          >
            {/* Brand Lockup & Portal Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flexShrink: 0, maxWidth: "100%" }}>
              {brand ?? (
                <a
                  href={homeUrl}
                  title="Home"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontWeight: 800,
                    fontSize: "1.125rem",
                    color: "var(--brand-primary, #500000)",
                    textDecoration: "none",
                    letterSpacing: "-0.02em",
                  }}
                >
                  TTI
                </a>
              )}

              {portalTitle && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    minWidth: 0,
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      height: "1.5rem",
                      width: "1px",
                      background: "var(--surface-border, #d6d3d1)",
                      flexShrink: 0,
                    }}
                  />
                  <a
                    href={homeUrl}
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      color: "var(--text-primary, #191919)",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {portalTitle}
                  </a>
                  {portalBadge && (
                    <span
                      data-variant={portalBadgeVariant}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        background:
                          portalBadgeVariant === "maroon"
                            ? "var(--brand-primary, #500000)"
                            : portalBadgeVariant === "info"
                              ? "var(--spectrum-blue, #005480)"
                              : portalBadgeVariant === "neutral"
                                ? "var(--surface-sunken, #f5f5f4)"
                                : "rgba(214, 154, 45, 0.22)",
                        color:
                          portalBadgeVariant === "maroon" || portalBadgeVariant === "info"
                            ? "var(--text-on-brand, #ffffff)"
                            : "var(--text-primary, #191919)",
                        border:
                          portalBadgeVariant === "maroon"
                            ? "1px solid var(--brand-primary, #500000)"
                            : portalBadgeVariant === "info"
                              ? "1px solid var(--spectrum-blue, #005480)"
                              : portalBadgeVariant === "neutral"
                                ? "1px solid var(--surface-border, #d6d3d1)"
                                : "1px solid rgba(214, 154, 45, 0.6)",
                      }}
                    >
                      {portalBadge}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Primary Navigation */}
            {navItems.length > 0 && (
              <nav
                aria-label={navAriaLabel}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "0.25rem",
                  justifyContent: "flex-end",
                  marginLeft: "auto",
                }}
              >
                {navItems.map((item) => {
                  const active = isItemActive(item);
                  const hasChildren = Boolean(item.children && item.children.length > 0);
                  const isDropdownOpen = activeDropdown === item.label;

                  if (hasChildren) {
                    return (
                      <div key={item.label} style={{ position: "relative" }}>
                        <button
                          type="button"
                          className="tux-portal-nav__trigger"
                          aria-expanded={isDropdownOpen}
                          onClick={() => toggleDropdown(item.label)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            padding: "0.5rem 0.75rem",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            background: "transparent",
                            border: "none",
                            borderBottom: active
                              ? "2px solid var(--brand-accent, #d69a2d)"
                              : "2px solid transparent",
                            color:
                              active || isDropdownOpen
                                ? "var(--brand-primary, #500000)"
                                : "var(--text-secondary, #44403c)",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span>{item.label}</span>
                          <span aria-hidden="true" style={{ fontSize: "0.75rem" }}>
                            ▾
                          </span>
                        </button>

                        {isDropdownOpen && (
                          <div
                            className="tux-portal-nav__dropdown"
                            style={{
                              position: "absolute",
                              right: 0,
                              top: "100%",
                              marginTop: "0.375rem",
                              width: "16rem",
                              background: "var(--surface-raised, #ffffff)",
                              border: "1px solid var(--surface-border, #d6d3d1)",
                              boxShadow: "0 15px 25px -5px rgba(0,0,0,0.12)",
                              padding: "0.5rem 0",
                              zIndex: 40,
                            }}
                          >
                            {item.children!.map((child) => {
                              const childUrl = child.to ?? child.href ?? "#";
                              return (
                                <a
                                  key={child.label}
                                  href={childUrl}
                                  onClick={closeDropdowns}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: "0.5rem 1rem",
                                    textDecoration: "none",
                                    color: "var(--text-primary, #191919)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                                      {child.label}
                                    </span>
                                    {child.badge && (
                                      <span
                                        style={{
                                          fontSize: "0.625rem",
                                          fontFamily: "var(--font-mono, monospace)",
                                          textTransform: "uppercase",
                                          padding: "0.1rem 0.375rem",
                                          borderRadius: "0.25rem",
                                          background: "var(--surface-border, #d6d3d1)",
                                          color: "var(--text-muted, #57534e)",
                                        }}
                                      >
                                        {child.badge}
                                      </span>
                                    )}
                                  </div>
                                  {child.description && (
                                    <span
                                      style={{
                                        fontSize: "0.75rem",
                                        color: "var(--text-muted, #57534e)",
                                        marginTop: "0.125rem",
                                      }}
                                    >
                                      {child.description}
                                    </span>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const targetUrl = item.to ?? item.href ?? "#";
                  return (
                    <a
                      key={item.label}
                      href={targetUrl}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        textDecoration: "none",
                        borderBottom: active
                          ? "2px solid var(--brand-accent, #d69a2d)"
                          : "2px solid transparent",
                        color: active
                          ? "var(--brand-primary, #500000)"
                          : "var(--text-secondary, #44403c)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            )}

            {/* Action CTA Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {action ??
                (actionText ? (
                  <TuxButton
                    shape="sharp"
                    intent="primary"
                    href={actionHref || actionTo || undefined}
                    onClick={(e) => onActionClick?.(e)}
                  >
                    {actionText}
                  </TuxButton>
                ) : null)}

              {/* Mobile Hamburger Toggle */}
              <button
                ref={mobileToggleBtnRef}
                type="button"
                aria-expanded={mobileOpen}
                aria-controls="tux-portal-mobile-drawer"
                aria-label="Toggle navigation menu"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="tux-portal-header__mobile-toggle"
                style={{
                  minHeight: "44px",
                  minWidth: "44px",
                  padding: "0.5rem",
                  borderRadius: "0.125rem",
                  border: "1px solid var(--surface-border, #d6d3d1)",
                  background: "transparent",
                  color: "var(--text-primary, #191919)",
                  cursor: "pointer",
                }}
              >
                {mobileOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* 5-Band Institutional Spectrum Ribbon */}
        {effectiveShowSpectrumRibbon && (
          <TuxSpectrumRibbon className="tux-portal-header__spectrum-ribbon" />
        )}

        {/* Mobile Slideover Navigation Drawer */}
        {mobileOpen && (
          <div
            className="tux-portal-header__mobile-backdrop"
            onClick={() => closeMobileDrawer(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "rgba(10, 10, 10, 0.6)",
            }}
          >
            <div
              id="tux-portal-mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                top: 0,
                bottom: 0,
                right: 0,
                width: "100%",
                maxWidth: "24rem",
                background: "var(--surface-raised, #ffffff)",
                boxShadow: "-10px 0 25px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                padding: "1.5rem",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--surface-border, #d6d3d1)",
                }}
              >
                <span style={{ fontWeight: 800, color: "var(--brand-primary, #500000)" }}>
                  {portalTitle || agencyName}
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => closeMobileDrawer(true)}
                  style={{
                    minHeight: "44px",
                    minWidth: "44px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "1.125rem",
                  }}
                >
                  ✕
                </button>
              </div>

              <nav aria-label="Mobile Navigation" style={{ flex: 1, padding: "0.75rem 0" }}>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {navItems.map((item) => (
                    <li key={item.label} style={{ padding: "0.25rem 0" }}>
                      {item.children && item.children.length > 0 ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => toggleMobileSection(item.label)}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.5rem 0",
                              border: "none",
                              background: "transparent",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              textTransform: "uppercase",
                              cursor: "pointer",
                            }}
                          >
                            <span>{item.label}</span>
                            <span>{expandedMobileSections[item.label] ? "▴" : "▾"}</span>
                          </button>
                          {expandedMobileSections[item.label] && (
                            <div style={{ paddingLeft: "1rem" }}>
                              {item.children.map((child) => (
                                <a
                                  key={child.label}
                                  href={child.to ?? child.href ?? "#"}
                                  onClick={() => setMobileOpen(false)}
                                  style={{
                                    display: "block",
                                    padding: "0.375rem 0",
                                    fontSize: "0.8125rem",
                                    color: "var(--text-secondary, #44403c)",
                                    textDecoration: "none",
                                  }}
                                >
                                  {child.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={item.to ?? item.href ?? "#"}
                          onClick={() => setMobileOpen(false)}
                          style={{
                            display: "block",
                            padding: "0.5rem 0",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            textTransform: "uppercase",
                            color: "var(--text-primary, #191919)",
                            textDecoration: "none",
                          }}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              {mobileDrawerFooter}
            </div>
          </div>
        )}

        {children}
      </header>
    );
  },
);

export default TuxPortalHeader;
