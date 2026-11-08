/**
 * TuxSimulator — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxSimulator(props = {}, children = '') {
  const el = document.createElement('section');
  el.className = 'tux-simulator';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxSimulator;
