/**
 * TuxSparkline — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxSparkline(props = {}, children = '') {
  const el = document.createElement('span');
  el.className = 'tux-sparkline';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxSparkline;
