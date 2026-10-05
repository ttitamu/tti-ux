/**
 * TuxTabs — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxTabs(props = {}, children = '') {
  const el = document.createElement('UTabs');
  el.className = 'tux-tabs';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxTabs;
