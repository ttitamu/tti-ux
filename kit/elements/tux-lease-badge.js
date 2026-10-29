/**
 * <tux-lease-badge> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxLeaseBadgeElement extends HTMLElement {
  static get observedAttributes() {
    return ["label", "remaining-hours", "expires-label", "warning-hours", "extendable", "releasable", "extend-label", "release-label"];
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
      <div class="tux-lease-badge">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-lease-badge')) {
  customElements.define('tux-lease-badge', TuxLeaseBadgeElement);
}
