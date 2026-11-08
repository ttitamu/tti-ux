/**
 * TuxLeaseBadge — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxLeaseBadge(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-lease-badge';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxLeaseBadge;
