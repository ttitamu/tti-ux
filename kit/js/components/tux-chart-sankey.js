/**
 * TuxChartSankey — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxChartSankey(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-chart-sankey';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxChartSankey;
