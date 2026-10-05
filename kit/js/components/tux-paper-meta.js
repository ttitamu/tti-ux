/**
 * TuxPaperMeta — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxPaperMeta(props = {}, children = '') {
  const el = document.createElement('dl');
  el.className = 'tux-paper-meta';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxPaperMeta;
