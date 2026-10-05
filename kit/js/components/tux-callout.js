/**
 * TuxCallout — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxCallout(props = {}, children = '') {
  const el = document.createElement('aside');
  el.className = 'tux-callout';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxCallout;
