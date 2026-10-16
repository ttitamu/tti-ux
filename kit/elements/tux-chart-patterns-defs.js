/**
 * <tux-chart-patterns-defs> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartPatternsDefsElement extends HTMLElement {
  static get observedAttributes() {
    return ["prefix"];
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
      <defs class="tux-chart-patterns-defs">
        <slot></slot>
      </defs>
    `;
  }
}

if (!customElements.get('tux-chart-patterns-defs')) {
  customElements.define('tux-chart-patterns-defs', TuxChartPatternsDefsElement);
}
