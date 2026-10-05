/**
 * <tux-portal-shell> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPortalShellElement extends HTMLElement {
  static get observedAttributes() {
    return ["portal-title", "portal-badge", "portal-badge-variant", "nav-items", "action-text", "action-to", "action-href", "utility-links", "agency-name", "agency-url", "home-url", "show-search", "sticky-header", "breadcrumbs", "max-width", "show-feedback", "feedback-label", "show-footer", "header-props", "footer-props", "main-class", "as"];
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
      <div class="tux-portal-shell">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-portal-shell')) {
  customElements.define('tux-portal-shell', TuxPortalShellElement);
}
