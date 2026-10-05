/**
 * <tux-alpha-nav> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxAlphaNavElement extends HTMLElement {
  static get observedAttributes() {
    return ["letters", "available", "mode", "sticky", "show-all", "model-value", "aria-label"];
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
      <nav class="tux-alpha-nav">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-alpha-nav')) {
  customElements.define('tux-alpha-nav', TuxAlphaNavElement);
}
