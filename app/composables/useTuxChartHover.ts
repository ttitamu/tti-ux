/**
 * useTuxChartHover — the shared roving-cursor hover/keyboard state for
 * the native chart family's plot-level interaction model (the
 * components.md "Chart tooltips" contract): pointer move sets the
 * active index, Arrow keys cycle it, Escape clears it, and every
 * change reports through `onChange` so the chart can emit its own
 * `hover` payload.
 *
 * Line / Area / Bar previously carried near-identical copies of this
 * quartet with drifted details (Bar seeded arrow navigation at index 0
 * while Line/Area seeded at the midpoint — mid is now canonical).
 * Per-chart geometry stays in the chart: callers pass `indexFromPointer`
 * (usually built on `tuxIndexFromPointer`).
 */
import { ref } from "vue";

export interface TuxChartHoverOptions {
  /** Number of hoverable positions (labels/categories), as a getter so
   *  it tracks reactive data. */
  count: () => number;
  /** Whether interaction is enabled (the `tooltip` prop), as a getter. */
  enabled: () => boolean;
  /** Chart-specific pointer→index projection (see tuxIndexFromPointer). */
  indexFromPointer: (e: PointerEvent) => number | null;
  /** Called on every change with the new index (null = cleared). */
  onChange: (index: number | null) => void;
}

export function useTuxChartHover(opts: TuxChartHoverOptions) {
  const hoverIndex = ref<number | null>(null);

  function setHoverIndex(idx: number | null) {
    if (idx === hoverIndex.value) return;
    hoverIndex.value = idx;
    opts.onChange(idx);
  }

  function onPointerMove(e: PointerEvent) {
    if (!opts.enabled()) return;
    const idx = opts.indexFromPointer(e);
    if (idx !== null) setHoverIndex(idx);
  }

  function onPointerLeave() {
    setHoverIndex(null);
  }

  function onKeydown(e: KeyboardEvent) {
    if (!opts.enabled()) return;
    const n = opts.count();
    if (n === 0) return;
    const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
    const fwd = e.key === "ArrowRight" || e.key === "ArrowDown";
    if (back || fwd) {
      e.preventDefault();
      const cur = hoverIndex.value ?? Math.floor(n / 2);
      const next = back ? Math.max(0, cur - 1) : Math.min(n - 1, cur + 1);
      setHoverIndex(next);
    } else if (e.key === "Escape") {
      setHoverIndex(null);
    }
  }

  return { hoverIndex, setHoverIndex, onPointerMove, onPointerLeave, onKeydown };
}
