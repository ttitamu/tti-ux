/**
 * TuxCopyToken — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxCopyToken(props = {}, children = '') {
  const el = document.createElement('span');
  el.className = 'tux-copy-token';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxCopyToken;
