/**
 * TuxAvatar — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxAvatar(props = {}, children = '') {
  const el = document.createElement('span');
  el.className = 'tux-avatar';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxAvatar;
