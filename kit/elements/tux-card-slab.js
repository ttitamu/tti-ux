/**
 * <tux-card-slab> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCardSlabElement extends HTMLElement {
  static get observedAttributes() {
    return ["cards", "columns", "aspect", "heading", "eyebrow", "inset"];
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
      <section class="tux-card-slab">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-card-slab')) {
  customElements.define('tux-card-slab', TuxCardSlabElement);
}
