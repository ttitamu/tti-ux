/**
 * TuxScrollTop — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxScrollTop(props = {}, children = '') {
  const el = document.createElement('button');
  el.className = 'tux-scroll-top';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxScrollTop;
