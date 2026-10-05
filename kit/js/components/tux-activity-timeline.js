/**
 * TuxActivityTimeline — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxActivityTimeline(props = {}, children = '') {
  const el = document.createElement('ol');
  el.className = 'tux-activity-timeline';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxActivityTimeline;
