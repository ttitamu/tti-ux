/**
 * TuxRailNav — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxRailNav(props = {}, children = '') {
  const el = document.createElement('nav');
  el.className = 'tux-rail-nav';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxRailNav;
