/**
 * TuxAlphaNav — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxAlphaNav(props = {}, children = '') {
  const el = document.createElement('nav');
  el.className = 'tux-alpha-nav';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxAlphaNav;
