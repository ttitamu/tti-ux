/**
 * <tux-site-nav> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSiteNavElement extends HTMLElement {
  static get observedAttributes() {
    return ["identity", "primary-nav", "utility-nav", "search", "sticky", "aria-label"];
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
      <header class="tux-site-nav">
        <slot></slot>
      </header>
    `;
  }
}

if (!customElements.get('tux-site-nav')) {
  customElements.define('tux-site-nav', TuxSiteNavElement);
}
