/**
 * <tux-chart-heatmap> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartHeatmapElement extends HTMLElement {
  static get observedAttributes() {
    return ["rows", "cols", "values", "width", "height", "ramp", "bins", "value-labels", "legend", "col-label-every", "format", "decimals", "aria-summary", "units", "tooltip"];
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
      <figure class="tux-chart-heatmap">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-chart-heatmap')) {
  customElements.define('tux-chart-heatmap', TuxChartHeatmapElement);
}
