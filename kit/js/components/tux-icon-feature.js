/**
 * TuxIconFeature — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxIconFeature(props = {}, children = '') {
  const el = document.createElement('ul');
  el.className = 'tux-icon-feature';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxIconFeature;
