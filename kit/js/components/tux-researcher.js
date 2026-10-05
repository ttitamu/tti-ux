/**
 * TuxResearcher — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxResearcher(props = {}, children = '') {
  const el = document.createElement('article');
  el.className = 'tux-researcher';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxResearcher;
