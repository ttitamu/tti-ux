/**
 * TuxChatMessage — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxChatMessage(props = {}, children = '') {
  const el = document.createElement('article');
  el.className = 'tux-chat-message';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxChatMessage;
