/**
 * TuxReportWebFrame — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxReportWebFrame(props = {}, children = '') {
  const el = document.createElement('article');
  el.className = 'tux-report-web-frame';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxReportWebFrame;
