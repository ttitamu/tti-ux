/**
 * TuxReportPrintSheet — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxReportPrintSheet(props = {}, children = '') {
  const el = document.createElement('span');
  el.className = 'tux-report-print-sheet';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxReportPrintSheet;
