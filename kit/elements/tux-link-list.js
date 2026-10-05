/**
 * <tux-link-list> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxLinkListElement extends HTMLElement {
  static get observedAttributes() {
    return ["groups", "layout", "columns"];
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
      <div class="tux-link-list">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-link-list')) {
  customElements.define('tux-link-list', TuxLinkListElement);
}
