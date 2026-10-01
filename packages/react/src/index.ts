/**
 * @tti/tti-ux-react — TUX component ports and hooks for React.
 *
 * Ports are tracked against their Vue sources by the port ledger
 * (kit/ports/manifest.json in the repo root); the queue of unported
 * components lives at kit/ports/QUEUE.md. Consumers also load
 * "@tti/tti-ux-react/styles.css" (tokens) once at app root.
 */

// Components
export { TuxBigStat } from "./components/TuxBigStat";
export type { TuxBigStatProps } from "./components/TuxBigStat";

export { TuxButton } from "./components/TuxButton";
export type {
  TuxButtonProps,
  TuxButtonIntent,
  TuxButtonShape,
  TuxButtonSize,
} from "./components/TuxButton";

export { TuxBadge } from "./components/TuxBadge";
export type {
  TuxBadgeProps,
  TuxBadgeTier,
  TuxBadgeStatus,
  TuxBadgeTone,
  TuxBadgeKind,
  TuxBadgeVariant,
  TuxBadgeSize,
} from "./components/TuxBadge";

export { TuxAlert } from "./components/TuxAlert";
export type {
  TuxAlertProps,
  TuxAlertVariant,
} from "./components/TuxAlert";

export { TuxCard } from "./components/TuxCard";
export type { TuxCardProps } from "./components/TuxCard";

export { TuxAccordion } from "./components/TuxAccordion";
export type { TuxAccordionProps, AccordionItem } from "./components/TuxAccordion";

export { TuxAvatar } from "./components/TuxAvatar";
export type { TuxAvatarProps } from "./components/TuxAvatar";

export { TuxDropdown } from "./components/TuxDropdown";
export type { TuxDropdownProps, DropdownItem } from "./components/TuxDropdown";

export { TuxTabs } from "./components/TuxTabs";
export type { TuxTabsProps, TabItem } from "./components/TuxTabs";

export { TuxSkeleton } from "./components/TuxSkeleton";
export type {
  TuxSkeletonProps,
  TuxSkeletonVariant,
  TuxSkeletonKind,
  TuxSkeletonAnimation,
} from "./components/TuxSkeleton";

export { TuxKbd } from "./components/TuxKbd";
export type { TuxKbdProps } from "./components/TuxKbd";

export { TuxTableCaption } from "./components/TuxTableCaption";
export type { TuxTableCaptionProps } from "./components/TuxTableCaption";

export { TuxStatComparison } from "./components/TuxStatComparison";
export type { TuxStatComparisonProps } from "./components/TuxStatComparison";

export { TuxCodeBlock } from "./components/TuxCodeBlock";
export type { TuxCodeBlockProps } from "./components/TuxCodeBlock";

export { TuxCallout } from "./components/TuxCallout";
export type {
  TuxCalloutProps,
  TuxCalloutKind,
  TuxCalloutVariant,
} from "./components/TuxCallout";

export { TuxFormField } from "./components/TuxFormField";
export type {
  TuxFormFieldProps,
  TuxFormFieldRenderProps,
} from "./components/TuxFormField";

export { TuxDescriptionList } from "./components/TuxDescriptionList";
export type {
  TuxDescriptionListProps,
  TuxDescriptionListItem,
  TuxDescriptionListLayout,
  TuxDescriptionListEmphasis,
} from "./components/TuxDescriptionList";

export { TuxLinkList } from "./components/TuxLinkList";
export type {
  TuxLinkListProps,
  TuxLinkListItem,
  TuxLinkListGroup,
} from "./components/TuxLinkList";

export { TuxLinkSlab } from "./components/TuxLinkSlab";
export type {
  TuxLinkSlabProps,
  TuxLinkSlabLink,
} from "./components/TuxLinkSlab";

export { TuxFactoid } from "./components/TuxFactoid";
export type {
  TuxFactoidProps,
  TuxFactoidItem,
  TuxFactoidVariant,
} from "./components/TuxFactoid";

export { TuxBetaRibbon } from "./components/TuxBetaRibbon";
export type {
  TuxBetaRibbonProps,
  TuxBetaRibbonVariant,
  TuxBetaRibbonKind,
  TuxBetaRibbonCorner,
} from "./components/TuxBetaRibbon";

export { TuxBreadcrumbs } from "./components/TuxBreadcrumbs";
export type {
  TuxBreadcrumbsProps,
  TuxCrumb,
} from "./components/TuxBreadcrumbs";

export { TuxSectionHeader } from "./components/TuxSectionHeader";
export type {
  TuxSectionHeaderProps,
  TuxSectionHeaderVariant,
  TuxSectionHeaderLevel,
} from "./components/TuxSectionHeader";

export { TuxEmptyState } from "./components/TuxEmptyState";
export type {
  TuxEmptyStateProps,
  TuxEmptyStateKind,
} from "./components/TuxEmptyState";

export { TuxStatus, TUX_OPS_STATES } from "./components/TuxStatus";
export type {
  TuxStatusProps,
  TuxOpsState,
  TuxOpsKind,
} from "./components/TuxStatus";

// Hooks
export { useTuxTheme } from "./hooks/useTuxTheme";
export type { TuxTheme } from "./hooks/useTuxTheme";

