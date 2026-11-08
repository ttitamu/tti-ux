/**
 * <tux-statement-sheet> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxStatementSheetElement extends HTMLElement {
  static get observedAttributes() {
    return ["statement-id", "title", "period-label", "issue-date", "status", "issuer", "recipient", "lines", "adjustments", "approvals", "remittance-ref", "digest", "currency-symbol", "show-print-action"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-body, system-ui);
        }
      </style>
      <article class="tux-statement-sheet">
        <slot></slot>
      </article>
    `;
  }
}

if (!customElements.get('tux-statement-sheet')) {
  customElements.define('tux-statement-sheet', TuxStatementSheetElement);
}
