/**
 * TuxStepper — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxStepper(props = {}, children = '') {
  const el = document.createElement('nav');
  el.className = 'tux-stepper';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxStepper;
