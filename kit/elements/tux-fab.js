/**
 * <tux-fab> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFABElement extends HTMLElement {
  static get observedAttributes() {
    return ["icon", "extended", "size", "side", "aria-label", "disabled"];
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
      <button class="tux-fab">
        <slot></slot>
      </button>
    `;
  }
}

if (!customElements.get('tux-fab')) {
  customElements.define('tux-fab', TuxFABElement);
}
