/**
 * <tux-pivot-matrix> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPivotMatrixElement extends HTMLElement {
  static get observedAttributes() {
    return ["caption", "row-labels", "col-labels", "values", "row-header-label", "value-prefix", "value-suffix", "decimals", "shaded"];
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
      <div class="tux-pivot-matrix">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-pivot-matrix')) {
  customElements.define('tux-pivot-matrix', TuxPivotMatrixElement);
}
