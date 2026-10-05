/**
 * TuxShortcutsHelp — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxShortcutsHelp(props = {}, children = '') {
  const el = document.createElement('dialog');
  el.className = 'tux-shortcuts-help';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxShortcutsHelp;
