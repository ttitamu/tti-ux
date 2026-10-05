/**
 * TuxMegaMenu — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxMegaMenu(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-mega-menu';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxMegaMenu;
