/**
 * TuxFilterPanel — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxFilterPanel(props = {}, children = '') {
  const el = document.createElement('aside');
  el.className = 'tux-filter-panel';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxFilterPanel;
