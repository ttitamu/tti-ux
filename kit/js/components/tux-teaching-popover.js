/**
 * TuxTeachingPopover — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxTeachingPopover(props = {}, children = '') {
  const el = document.createElement('Teleport');
  el.className = 'tux-teaching-popover';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxTeachingPopover;
