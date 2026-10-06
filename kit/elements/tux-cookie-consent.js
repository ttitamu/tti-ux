/**
 * <tux-cookie-consent> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCookieConsentElement extends HTMLElement {
  static get observedAttributes() {
    return ["storage-key", "position", "message", "privacy-href", "initially-expanded"];
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
      <Teleport class="tux-cookie-consent">
        <slot></slot>
      </Teleport>
    `;
  }
}

if (!customElements.get('tux-cookie-consent')) {
  customElements.define('tux-cookie-consent', TuxCookieConsentElement);
}
