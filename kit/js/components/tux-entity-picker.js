/**
 * TuxEntityPicker — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxEntityPicker(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-entity-picker';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxEntityPicker;
