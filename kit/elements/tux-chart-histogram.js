/**
 * <tux-chart-histogram> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartHistogramElement extends HTMLElement {
  static get observedAttributes() {
    return ["values", "width", "height", "bin-count", "percentiles", "normalize", "gridlines", "ticks", "x-label", "format", "decimals", "aria-summary", "units", "tooltip"];
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
      <figure class="tux-chart-histogram">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-chart-histogram')) {
  customElements.define('tux-chart-histogram', TuxChartHistogramElement);
}
