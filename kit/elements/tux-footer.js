/**
 * <tux-footer> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFooterElement extends HTMLElement {
  static get observedAttributes() {
    return ["name", "address", "phone", "logo", "logo-size", "brand-lockup", "brand-lockup-alt", "social", "columns", "tagline", "year"];
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
      <footer class="tux-footer">
        <slot></slot>
      </footer>
    `;
  }
}

if (!customElements.get('tux-footer')) {
  customElements.define('tux-footer', TuxFooterElement);
}
