/**
 * <tux-tile-grid> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxTileGridElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "subtitle", "tiles", "columns", "surface"];
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
      <section class="tux-tile-grid">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-tile-grid')) {
  customElements.define('tux-tile-grid', TuxTileGridElement);
}
