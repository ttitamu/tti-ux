/**
 * TuxMapMarker — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxMapMarker(props = {}, children = '') {
  const el = document.createElement('svg');
  el.className = 'tux-map-marker';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxMapMarker;
