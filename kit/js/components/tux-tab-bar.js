/**
 * TuxTabBar — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxTabBar(props = {}, children = '') {
  const el = document.createElement('nav');
  el.className = 'tux-tab-bar';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxTabBar;
