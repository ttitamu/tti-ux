/**
 * <tux-user-menu> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxUserMenuElement extends HTMLElement {
  static get observedAttributes() {
    return ["state", "identity", "sign-in-href", "sign-in-label", "items", "prefs", "show-sign-out", "placement", "status-line"];
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
      <div class="tux-user-menu">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-user-menu')) {
  customElements.define('tux-user-menu', TuxUserMenuElement);
}
