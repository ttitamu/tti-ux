/**
 * <tux-modal> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxModalElement extends HTMLElement {
  static get observedAttributes() {
    return ["open", "title", "eyebrow", "size", "variant"];
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
      <UModal class="tux-modal">
        <slot></slot>
      </UModal>
    `;
  }
}

if (!customElements.get('tux-modal')) {
  customElements.define('tux-modal', TuxModalElement);
}
