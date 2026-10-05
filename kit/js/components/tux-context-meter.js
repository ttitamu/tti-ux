/**
 * TuxContextMeter — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxContextMeter(props = {}, children = '') {
  const el = document.createElement('UPopover');
  el.className = 'tux-context-meter';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxContextMeter;
