/**
 * TuxCapabilityCluster — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxCapabilityCluster(props = {}, children = '') {
  const el = document.createElement('section');
  el.className = 'tux-capability-cluster';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxCapabilityCluster;
