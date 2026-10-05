/**
 * TuxMediaSlab — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxMediaSlab(props = {}, children = '') {
  const el = document.createElement('section');
  el.className = 'tux-media-slab';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxMediaSlab;
