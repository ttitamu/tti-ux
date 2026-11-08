/**
 * TuxAnomalyCard — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxAnomalyCard(props = {}, children = '') {
  const el = document.createElement('article');
  el.className = 'tux-anomaly-card';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxAnomalyCard;
