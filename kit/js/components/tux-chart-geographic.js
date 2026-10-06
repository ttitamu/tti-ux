/**
 * TuxChartGeographic — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxChartGeographic(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-chart-geographic';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxChartGeographic;
