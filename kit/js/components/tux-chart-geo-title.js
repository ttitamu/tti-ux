/**
 * TuxChartGeoTitle — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxChartGeoTitle(props = {}, children = '') {
  const el = document.createElement('text');
  el.className = 'tux-chart-geo-title';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxChartGeoTitle;
