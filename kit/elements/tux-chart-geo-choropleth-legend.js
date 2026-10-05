/**
 * <tux-chart-geo-choropleth-legend> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartGeoChoroplethLegendElement extends HTMLElement {
  static get observedAttributes() {
    return ["ramp", "label", "stops", "x", "y"];
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
      <g class="tux-chart-geo-choropleth-legend">
        <slot></slot>
      </g>
    `;
  }
}

if (!customElements.get('tux-chart-geo-choropleth-legend')) {
  customElements.define('tux-chart-geo-choropleth-legend', TuxChartGeoChoroplethLegendElement);
}
