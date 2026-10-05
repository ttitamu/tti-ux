/**
 * TuxAnnouncementBanner — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxAnnouncementBanner(props = {}, children = '') {
  const el = document.createElement('Transition');
  el.className = 'tux-announcement-banner';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxAnnouncementBanner;
