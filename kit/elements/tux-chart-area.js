/**
 * <tux-chart-area> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartAreaElement extends HTMLElement {
  static get observedAttributes() {
    return ["labels", "series", "width", "height", "variant", "markers", "end-labels", "legend", "gridlines", "ticks", "format", "decimals", "aria-summary", "units", "tooltip"];
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
      <figure class="tux-chart-area">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-chart-area')) {
  customElements.define('tux-chart-area', TuxChartAreaElement);
}
