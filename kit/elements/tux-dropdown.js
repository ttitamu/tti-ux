/**
 * <tux-dropdown> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxDropdownElement extends HTMLElement {
  static get observedAttributes() {
    return ["label", "items", "to"];
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
      <div class="tux-dropdown">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-dropdown')) {
  customElements.define('tux-dropdown', TuxDropdownElement);
}
