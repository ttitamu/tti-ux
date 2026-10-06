/**
 * <tux-chart-geographic> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChartGeographicElement extends HTMLElement {
  static get observedAttributes() {
    return ["kind", "palette", "title", "legend-label", "legend-stops", "show-legend", "counties", "districts", "states", "highlight", "dots", "dot-legend", "flows", "flow-legend"];
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
      <div class="tux-chart-geographic">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-chart-geographic')) {
  customElements.define('tux-chart-geographic', TuxChartGeographicElement);
}
