/**
 * TuxChartDonut — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxChartDonut(props = {}, children = '') {
  const el = document.createElement('figure');
  el.className = 'tux-chart-donut';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxChartDonut;
