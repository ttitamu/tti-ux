/**
 * TuxFeedStatus — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxFeedStatus(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-feed-status';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxFeedStatus;
