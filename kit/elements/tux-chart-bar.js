/**
 * <tux-chart-bar> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartBarElement extends HTMLElement {
  static get observedAttributes() {
    return ["labels", "series", "width", "height", "orientation", "variant", "value-labels", "in-bar-labels", "gridlines", "legend", "ticks", "format", "decimals", "aria-summary", "units", "tooltip"];
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
      <figure class="tux-chart-bar">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-chart-bar')) {
  customElements.define('tux-chart-bar', TuxChartBarElement);
}
