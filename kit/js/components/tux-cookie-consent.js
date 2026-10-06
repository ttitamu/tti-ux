/**
 * TuxCookieConsent — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxCookieConsent(props = {}, children = '') {
  const el = document.createElement('Teleport');
  el.className = 'tux-cookie-consent';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxCookieConsent;
