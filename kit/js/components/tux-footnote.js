/**
 * TuxFootnote — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxFootnote(props = {}, children = '') {
  const el = document.createElement('UPopover');
  el.className = 'tux-footnote';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxFootnote;
