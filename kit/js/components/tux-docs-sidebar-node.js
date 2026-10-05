/**
 * TuxDocsSidebarNode — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxDocsSidebarNode(props = {}, children = '') {
  const el = document.createElement('li');
  el.className = 'tux-docs-sidebar-node';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxDocsSidebarNode;
