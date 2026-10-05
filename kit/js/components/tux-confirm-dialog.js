/**
 * TuxConfirmDialog — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxConfirmDialog(props = {}, children = '') {
  const el = document.createElement('TuxModal');
  el.className = 'tux-confirm-dialog';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxConfirmDialog;
