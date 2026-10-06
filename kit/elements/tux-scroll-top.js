/**
 * <tux-scroll-top> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxScrollTopElement extends HTMLElement {
  static get observedAttributes() {
    return ["threshold", "position", "aria-label"];
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
      <button class="tux-scroll-top">
        <slot></slot>
      </button>
    `;
  }
}

if (!customElements.get('tux-scroll-top')) {
  customElements.define('tux-scroll-top', TuxScrollTopElement);
}
