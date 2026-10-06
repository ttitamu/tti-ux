/**
 * <tux-media-slab> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxMediaSlabElement extends HTMLElement {
  static get observedAttributes() {
    return ["src", "alt", "eyebrow", "title", "dek", "layout", "image-side", "height", "tone"];
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
      <section class="tux-media-slab">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-media-slab')) {
  customElements.define('tux-media-slab', TuxMediaSlabElement);
}
