/**
 * <tux-tabs> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxTabsElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "model-value", "orientation", "size", "variant"];
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
      <UTabs class="tux-tabs">
        <slot></slot>
      </UTabs>
    `;
  }
}

if (!customElements.get('tux-tabs')) {
  customElements.define('tux-tabs', TuxTabsElement);
}
