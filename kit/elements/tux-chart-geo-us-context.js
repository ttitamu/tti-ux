/**
 * <tux-chart-geo-us-context> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartGeoUsContextElement extends HTMLElement {
  static get observedAttributes() {
    return ["states", "highlight", "legend-label", "legend-stops"];
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
      <svg class="tux-chart-geo-us-context">
        <slot></slot>
      </svg>
    `;
  }
}

if (!customElements.get('tux-chart-geo-us-context')) {
  customElements.define('tux-chart-geo-us-context', TuxChartGeoUsContextElement);
}
