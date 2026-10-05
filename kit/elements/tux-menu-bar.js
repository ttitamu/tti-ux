/**
 * <tux-menu-bar> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxMenuBarElement extends HTMLElement {
  static get observedAttributes() {
    return ["menus", "render-on-mac"];
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
      <div class="tux-menu-bar">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-menu-bar')) {
  customElements.define('tux-menu-bar', TuxMenuBarElement);
}
