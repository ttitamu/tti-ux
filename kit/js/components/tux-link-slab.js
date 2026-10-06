/**
 * TuxLinkSlab — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxLinkSlab(props = {}, children = '') {
  const el = document.createElement('nav');
  el.className = 'tux-link-slab';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxLinkSlab;
