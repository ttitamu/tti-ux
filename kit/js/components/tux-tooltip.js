/**
 * TuxTooltip — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxTooltip(props = {}, children = '') {
  const el = document.createElement('TooltipProvider');
  el.className = 'tux-tooltip';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxTooltip;
