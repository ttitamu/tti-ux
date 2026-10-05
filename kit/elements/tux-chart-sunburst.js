/**
 * <tux-chart-sunburst> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartSunburstElement extends HTMLElement {
  static get observedAttributes() {
    return ["data", "size", "center-label", "format-total", "format-value", "show-legend", "palette", "tooltip"];
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
      <div class="tux-chart-sunburst">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-chart-sunburst')) {
  customElements.define('tux-chart-sunburst', TuxChartSunburstElement);
}
