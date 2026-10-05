/**
 * TuxReportFrame — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxReportFrame(props = {}, children = '') {
  const el = document.createElement('article');
  el.className = 'tux-report-frame';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxReportFrame;
