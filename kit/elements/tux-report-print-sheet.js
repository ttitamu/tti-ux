/**
 * <tux-report-print-sheet> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxReportPrintSheetElement extends HTMLElement {
  static get observedAttributes() {
    return ["size", "margin"];
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
      <span class="tux-report-print-sheet">
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get('tux-report-print-sheet')) {
  customElements.define('tux-report-print-sheet', TuxReportPrintSheetElement);
}
