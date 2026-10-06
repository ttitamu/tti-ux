/**
 * <tux-chart-gauge> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartGaugeElement extends HTMLElement {
  static get observedAttributes() {
    return ["value", "min", "max", "size", "variant", "bands", "center-label", "center-value", "units", "format", "decimals", "aria-summary"];
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
      <figure class="tux-chart-gauge">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-chart-gauge')) {
  customElements.define('tux-chart-gauge', TuxChartGaugeElement);
}
