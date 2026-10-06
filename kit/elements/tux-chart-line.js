/**
 * <tux-chart-line> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartLineElement extends HTMLElement {
  static get observedAttributes() {
    return ["labels", "series", "width", "height", "markers", "end-labels", "legend", "gridlines", "y-ticks"];
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
      <figure class="tux-chart-line">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-chart-line')) {
  customElements.define('tux-chart-line', TuxChartLineElement);
}
