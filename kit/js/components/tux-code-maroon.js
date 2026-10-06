/**
 * TuxCodeMaroon — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxCodeMaroon(props = {}, children = '') {
  const el = document.createElement('Transition');
  el.className = 'tux-code-maroon';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxCodeMaroon;
