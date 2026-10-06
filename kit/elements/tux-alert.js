/**
 * <tux-alert> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxAlertElement extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "title", "description", "icon"];
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
      <UAlert class="tux-alert">
        <slot></slot>
      </UAlert>
    `;
  }
}

if (!customElements.get('tux-alert')) {
  customElements.define('tux-alert', TuxAlertElement);
}
