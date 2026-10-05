/**
 * TuxFileDropzone — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxFileDropzone(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-file-dropzone';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxFileDropzone;
