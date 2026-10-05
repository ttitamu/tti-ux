/**
 * TuxAlert — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxAlert(props = {}, children = '') {
  const el = document.createElement('UAlert');
  el.className = 'tux-alert';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxAlert;
