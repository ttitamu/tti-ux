/**
 * TuxMcpEmbed — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxMcpEmbed(props = {}, children = '') {
  const el = document.createElement('section');
  el.className = 'tux-mcp-embed';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxMcpEmbed;
