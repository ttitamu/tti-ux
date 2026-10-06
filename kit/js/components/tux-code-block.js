/**
 * TuxCodeBlock — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxCodeBlock(props = {}, children = '') {
  const el = document.createElement('figure');
  el.className = 'tux-code-block';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxCodeBlock;
