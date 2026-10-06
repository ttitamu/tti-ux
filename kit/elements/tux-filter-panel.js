/**
 * <tux-filter-panel> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFilterPanelElement extends HTMLElement {
  static get observedAttributes() {
    return ["facets", "model-value", "title"];
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
      <aside class="tux-filter-panel">
        <slot></slot>
      </aside>
    `;
  }
}

if (!customElements.get('tux-filter-panel')) {
  customElements.define('tux-filter-panel', TuxFilterPanelElement);
}
