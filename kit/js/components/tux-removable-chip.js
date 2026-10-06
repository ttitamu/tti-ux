/**
 * TuxRemovableChip — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxRemovableChip(props = {}, children = '') {
  const el = document.createElement('span');
  el.className = 'tux-removable-chip';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxRemovableChip;
