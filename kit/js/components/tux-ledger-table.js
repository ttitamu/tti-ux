/**
 * TuxLedgerTable — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxLedgerTable(props = {}, children = '') {
  const el = document.createElement('div');
  el.className = 'tux-ledger-table';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxLedgerTable;
