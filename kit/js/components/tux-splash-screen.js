/**
 * TuxSplashScreen — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxSplashScreen(props = {}, children = '') {
  const el = document.createElement('Transition');
  el.className = 'tux-splash-screen';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxSplashScreen;
