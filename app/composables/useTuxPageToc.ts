export interface TuxPageTocItem {
  id: string;
  label: string;
  depth: number;
}

/**
 * Shared reactive state for page table-of-contents.
 * Pages or layouts can push headings or read the active list.
 */
export function useTuxPageToc() {
  return useState<TuxPageTocItem[]>("tux-page-toc", () => []);
}
