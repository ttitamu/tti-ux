/**
 * TuxRichTextEditor — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxRichTextEditor(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-rich-text-editor';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxRichTextEditor;
