/**
 * TuxValidationSummary — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxValidationSummary(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-validation-summary';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxValidationSummary;
