/**
 * <tux-confirm-dialog> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxConfirmDialogElement extends HTMLElement {
  static get observedAttributes() {
    return ["open", "title", "eyebrow", "confirm-label", "cancel-label", "variant", "confirm-disabled", "loading", "size"];
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
      <TuxModal class="tux-confirm-dialog">
        <slot></slot>
      </TuxModal>
    `;
  }
}

if (!customElements.get('tux-confirm-dialog')) {
  customElements.define('tux-confirm-dialog', TuxConfirmDialogElement);
}
