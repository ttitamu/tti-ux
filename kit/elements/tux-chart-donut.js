/**
 * <tux-chart-donut> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartDonutElement extends HTMLElement {
  static get observedAttributes() {
    return ["slices", "size", "thickness", "slice-labels", "legend", "center-label", "center-value", "min-slice", "format", "decimals", "aria-summary", "units", "tooltip"];
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
      <figure class="tux-chart-donut">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-chart-donut')) {
  customElements.define('tux-chart-donut', TuxChartDonutElement);
}
