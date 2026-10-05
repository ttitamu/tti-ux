/**
 * TuxChartArea — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxChartArea(props = {}, children = '') {
  const el = document.createElement('figure');
  el.className = 'tux-chart-area';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxChartArea;
