/**
 * <tux-center-badge> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCenterBadgeElement extends HTMLElement {
  static get observedAttributes() {
    return ["center", "label", "icon", "tone-index", "short", "size", "layout"];
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
      <span class="tux-center-badge">
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get('tux-center-badge')) {
  customElements.define('tux-center-badge', TuxCenterBadgeElement);
}
