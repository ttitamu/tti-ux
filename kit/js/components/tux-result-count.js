/**
 * TuxResultCount — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxResultCount(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-result-count';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxResultCount;
