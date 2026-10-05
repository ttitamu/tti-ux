/**
 * TuxCitationExport — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxCitationExport(props = {}, children = '') {
  const el = document.createElement('UDropdownMenu');
  el.className = 'tux-citation-export';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxCitationExport;
