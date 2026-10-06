/**
 * <tux-reactive-sidebar> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxReactiveSidebarElement extends HTMLElement {
  static get observedAttributes() {
    return ["sections", "all-sections", "collapsed", "active-area-title", "active-area-icon", "search", "search-placeholder", "show-all", "default-expanded", "exclusive"];
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
      <nav class="tux-reactive-sidebar">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-reactive-sidebar')) {
  customElements.define('tux-reactive-sidebar', TuxReactiveSidebarElement);
}
