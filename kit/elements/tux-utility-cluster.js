/**
 * <tux-utility-cluster> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxUtilityClusterElement extends HTMLElement {
  static get observedAttributes() {
    return ["current", "signed-in", "entitled", "hide-switcher", "hide-theme", "user-menu", "state", "identity", "sign-in-href", "sign-in-label", "items", "prefs", "status-line"];
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
      <div class="tux-utility-cluster">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-utility-cluster')) {
  customElements.define('tux-utility-cluster', TuxUtilityClusterElement);
}
