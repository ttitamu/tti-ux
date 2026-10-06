/**
 * <tux-button> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxButtonElement extends HTMLElement {
  static get observedAttributes() {
    return ["intent", "shape"];
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
      <UButton class="tux-button">
        <slot></slot>
      </UButton>
    `;
  }
}

if (!customElements.get('tux-button')) {
  customElements.define('tux-button', TuxButtonElement);
}
