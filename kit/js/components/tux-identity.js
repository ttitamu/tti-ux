/**
 * TuxIdentity — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxIdentity(props = {}, children = '') {
  const el = document.createElement('component');
  el.className = 'tux-identity';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxIdentity;
