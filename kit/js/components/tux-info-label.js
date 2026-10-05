/**
 * TuxInfoLabel — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxInfoLabel(props = {}, children = '') {
  const el = document.createElement('label');
  el.className = 'tux-info-label';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxInfoLabel;
