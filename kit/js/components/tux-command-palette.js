/**
 * TuxCommandPalette — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxCommandPalette(props = {}, children = '') {
  const el = document.createElement('dialog');
  el.className = 'tux-command-palette';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxCommandPalette;
