/**
 * <tux-chart-geo-flow> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartGeoFlowElement extends HTMLElement {
  static get observedAttributes() {
    return ["flows", "flow-legend"];
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
      <svg class="tux-chart-geo-flow">
        <slot></slot>
      </svg>
    `;
  }
}

if (!customElements.get('tux-chart-geo-flow')) {
  customElements.define('tux-chart-geo-flow', TuxChartGeoFlowElement);
}
