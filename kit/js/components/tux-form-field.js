/**
 * TuxFormField — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxFormField(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-form-field';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxFormField;
