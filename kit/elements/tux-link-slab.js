/**
 * <tux-link-slab> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxLinkSlabElement extends HTMLElement {
  static get observedAttributes() {
    return ["links", "tone", "aria-label"];
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
      <nav class="tux-link-slab">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-link-slab')) {
  customElements.define('tux-link-slab', TuxLinkSlabElement);
}
