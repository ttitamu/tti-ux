/**
 * <tux-chart-geo-title> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartGeoTitleElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "x", "y"];
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
      <text class="tux-chart-geo-title">
        <slot></slot>
      </text>
    `;
  }
}

if (!customElements.get('tux-chart-geo-title')) {
  customElements.define('tux-chart-geo-title', TuxChartGeoTitleElement);
}
