/**
 * TuxChartGeoChoroplethLegend — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxChartGeoChoroplethLegend(props = {}, children = '') {
  const el = document.createElement('g');
  el.className = 'tux-chart-geo-choropleth-legend';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxChartGeoChoroplethLegend;
