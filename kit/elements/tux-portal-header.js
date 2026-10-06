/**
 * <tux-portal-header> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPortalHeaderElement extends HTMLElement {
  static get observedAttributes() {
    return ["mode", "agency-name", "agency-url", "home-url", "portal-title", "portal-badge", "portal-badge-variant", "utility-links", "show-search", "show-spectrum-ribbon", "intranet-apps"];
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
      <header class="tux-portal-header">
        <slot></slot>
      </header>
    `;
  }
}

if (!customElements.get('tux-portal-header')) {
  customElements.define('tux-portal-header', TuxPortalHeaderElement);
}
