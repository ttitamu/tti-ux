/**
 * TuxSectionHeader — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxSectionHeader(props = {}, children = '') {
  const el = document.createElement('header');
  el.className = 'tux-section-header';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxSectionHeader;
