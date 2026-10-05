/**
 * TuxChartGauge — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxChartGauge(props = {}, children = '') {
  const el = document.createElement('figure');
  el.className = 'tux-chart-gauge';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxChartGauge;
