/**
 * <tux-staleness-banner> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxStalenessBannerElement extends HTMLElement {
  static get observedAttributes() {
    return ["stale", "verified-until", "last-verified", "review-cadence-days", "owner", "page-id", "dismissable", "show-verified-badge"];
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
      <div class="tux-staleness-banner">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-staleness-banner')) {
  customElements.define('tux-staleness-banner', TuxStalenessBannerElement);
}
