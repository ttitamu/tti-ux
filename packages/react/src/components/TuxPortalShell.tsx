/**
 * TuxPortalShell — Complete TTI Public Portal & Application Shell.
 * React port of app/components/TuxPortalShell.vue.
 */
import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { TuxBreadcrumbs, type TuxCrumb } from "./TuxBreadcrumbs";
import {
  TuxPortalHeader,
  type PortalNavItem,
  type PortalUtilityLink,
  type TuxPortalHeaderProps,
} from "./TuxPortalHeader";
import { TuxSpectrumRibbon } from "./TuxSpectrumRibbon";

export interface TuxPortalShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Sub-brand, research center, or portal title displayed adjacent to the logo. */
  portalTitle?: string;
  /** Optional badge pill next to portal title. */
  portalBadge?: string;
  /** Badge color variant. */
  portalBadgeVariant?: "neutral" | "maroon" | "gold" | "info" | "success";
  /** Primary navigation items in Tier 2. */
  navItems?: PortalNavItem[];
  /** Primary action CTA button label. */
  actionText?: string;
  /** Primary action CTA destination route. */
  actionTo?: string;
  /** Primary action CTA external URL. */
  actionHref?: string;
  /** Tier 1 utility navigation links. */
  utilityLinks?: PortalUtilityLink[];
  /** Agency name in Tier 1 utility bar. */
  agencyName?: string;
  /** Agency URL link in Tier 1 utility bar. */
  agencyUrl?: string;
  /** Root home URL when clicking logo. */
  homeUrl?: string;
  /** Whether to render the Tier 1 search trigger button. */
  showSearch?: boolean;
  /** Sticky-position the header at the top of the viewport. */
  stickyHeader?: boolean;
  /** Breadcrumb trail items rendered beneath the header / hero. */
  breadcrumbs?: TuxCrumb[];
  /** Max-width container mode: standard (80rem / 7xl), wide (96rem), or full. */
  maxWidth?: "standard" | "wide" | "full";
  /** Show vertical floating feedback tab on the right viewport edge. */
  showFeedback?: boolean;
  /** Label for the floating feedback tab. */
  feedbackLabel?: string;
  /** Render the institutional footer at the bottom of the shell. */
  showFooter?: boolean;
  /** Pass-through props to TuxPortalHeader. */
  headerProps?: Partial<TuxPortalHeaderProps>;
  /** Pass-through props to footer. */
  footerProps?: Record<string, unknown>;
  /** Extra classes for the main content wrapper. */
  mainClass?: string;
  /** HTML tag to use for the main content container ('main' by default, 'div' for nested previews). */
  as?: "main" | "div";
  /** Optional hero banner rendered directly below the header. */
  hero?: ReactNode;
  /** Optional custom header override. */
  header?: ReactNode;
  /** Optional custom footer override. */
  footer?: ReactNode;
  /** Callback fired when the search button in the header is clicked. */
  onSearchClick?: () => void;
  /** Callback fired when the primary CTA button in the header is clicked. */
  onActionClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Callback fired when the floating feedback tab is clicked. */
  onFeedbackClick?: () => void;
  children?: ReactNode;
}

export const TuxPortalShell = forwardRef<HTMLDivElement, TuxPortalShellProps>(
  function TuxPortalShell(
    {
      portalTitle = "",
      portalBadge = "",
      portalBadgeVariant = "gold",
      navItems = [],
      actionText = "",
      actionTo = "",
      actionHref = "",
      utilityLinks,
      agencyName = "Texas A&M Transportation Institute",
      agencyUrl = "https://tti.tamu.edu",
      homeUrl = "/",
      showSearch = true,
      stickyHeader = true,
      breadcrumbs = [],
      maxWidth = "standard",
      showFeedback = true,
      feedbackLabel = "Feedback",
      showFooter = true,
      headerProps,
      mainClass = "",
      as: MainTag = "main",
      hero,
      header,
      footer,
      onSearchClick,
      onActionClick,
      onFeedbackClick,
      children,
      className = "",
      style,
      ...restProps
    },
    ref,
  ) {
    const maxContainerWidth =
      maxWidth === "wide" ? "96rem" : maxWidth === "full" ? "100%" : "80rem";

    return (
      <div
        ref={ref}
        className={`tux-portal-shell ${className}`.trim()}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--surface-base, #fafaf9)",
          color: "var(--text-primary, #191919)",
          fontFamily: "var(--font-body, system-ui, sans-serif)",
          ...style,
        }}
        {...restProps}
      >
        {/* Skip to Main Content */}
        <a
          href="#tux-portal-main-content"
          className="tux-portal-shell__skip-link sr-only"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Skip to main content
        </a>

        {/* Two-Tier Institutional Header */}
        {header ?? (
          <TuxPortalHeader
            portalTitle={portalTitle}
            portalBadge={portalBadge}
            portalBadgeVariant={portalBadgeVariant}
            navItems={navItems}
            actionText={actionText}
            actionTo={actionTo}
            actionHref={actionHref}
            utilityLinks={utilityLinks}
            agencyName={agencyName}
            agencyUrl={agencyUrl}
            homeUrl={homeUrl}
            showSearch={showSearch}
            sticky={stickyHeader}
            maxWidth={maxWidth}
            onSearchClick={onSearchClick}
            onActionClick={onActionClick}
            {...headerProps}
          />
        )}

        {/* Optional Hero Banner */}
        {hero && <div className="tux-portal-shell__hero">{hero}</div>}

        {/* Breadcrumb Bar */}
        {breadcrumbs.length > 0 && (
          <div
            className="tux-portal-shell__breadcrumbs"
            style={{
              background: "var(--surface-sunken, #f5f5f4)",
              borderBottom: "1px solid var(--surface-border, #d6d3d1)",
            }}
          >
            <div
              style={{
                maxWidth: maxContainerWidth,
                margin: "0 auto",
                padding: "0.625rem 1rem",
              }}
            >
              <TuxBreadcrumbs trail={breadcrumbs} />
            </div>
          </div>
        )}

        {/* Primary Main Content Area */}
        <MainTag
          id="tux-portal-main-content"
          tabIndex={-1}
          className={`tux-portal-shell__main ${mainClass}`.trim()}
          style={{ flex: 1, outline: "none" }}
        >
          {children}
        </MainTag>

        {/* Floating Vertical Feedback Tab */}
        {showFeedback && (
          <button
            type="button"
            className="tux-portal-shell__feedback-tab"
            aria-label={feedbackLabel}
            onClick={() => onFeedbackClick?.()}
            style={{
              position: "fixed",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 40,
              background: "var(--brand-primary, #500000)",
              color: "var(--text-inverse, #ffffff)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "0.75rem 0.5rem",
              border: "none",
              borderTopLeftRadius: "0.25rem",
              borderBottomLeftRadius: "0.25rem",
              writingMode: "vertical-rl",
              cursor: "pointer",
            }}
          >
            {feedbackLabel}
          </button>
        )}

        {/* Institutional Footer */}
        {showFooter &&
          (footer ?? (
            <footer
              className="tux-portal-shell__footer"
              style={{
                background: "var(--neutral-900, #171717)",
                color: "var(--text-inverse, #ffffff)",
                marginTop: "auto",
              }}
            >
              <TuxSpectrumRibbon />
              <div
                style={{
                  maxWidth: maxContainerWidth,
                  margin: "0 auto",
                  padding: "2rem 1rem",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  fontSize: "0.8125rem",
                }}
              >
                <div>
                  <strong style={{ color: "#ffffff" }}>{agencyName}</strong>
                  {portalTitle ? ` — ${portalTitle}` : ""}
                </div>
                <div style={{ color: "rgba(255,255,255,0.75)" }}>
                  A member of The Texas A&amp;M University System
                </div>
              </div>
            </footer>
          ))}
      </div>
    );
  },
);

export default TuxPortalShell;
