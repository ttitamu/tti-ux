/**
 * <tux-app-switcher> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxAppSwitcherElement extends HTMLElement {
  static get observedAttributes() {
    return ["apps", "aria-label", "heading", "footer-text", "presentation"];
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
      <UPopover class="tux-app-switcher">
        <slot></slot>
      </UPopover>
    `;
  }
}

if (!customElements.get('tux-app-switcher')) {
  customElements.define('tux-app-switcher', TuxAppSwitcherElement);
}
