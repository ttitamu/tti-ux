/**
 * <tux-docs-sidebar> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxDocsSidebarElement extends HTMLElement {
  static get observedAttributes() {
    return ["tree", "title", "search", "search-placeholder", "storage-key", "exclusive-top-level"];
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
      <div class="tux-docs-sidebar">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-docs-sidebar')) {
  customElements.define('tux-docs-sidebar', TuxDocsSidebarElement);
}
