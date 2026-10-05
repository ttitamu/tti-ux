/**
 * TuxPageContainer — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxPageContainer(props = {}, children = '') {
  const el = document.createElement('component');
  el.className = 'tux-page-container';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxPageContainer;
