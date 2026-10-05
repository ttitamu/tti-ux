/**
 * <tux-map-legend> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxMapLegendElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "eyebrow", "entries", "layout", "gradient", "min-label", "max-label", "css", "stops"];
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
      <div class="tux-map-legend">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-map-legend')) {
  customElements.define('tux-map-legend', TuxMapLegendElement);
}
