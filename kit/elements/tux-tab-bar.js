/**
 * <tux-tab-bar> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxTabBarElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "aria-label"];
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
      <nav class="tux-tab-bar">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-tab-bar')) {
  customElements.define('tux-tab-bar', TuxTabBarElement);
}
