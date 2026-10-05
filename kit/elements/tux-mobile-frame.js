/**
 * <tux-mobile-frame> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxMobileFrameElement extends HTMLElement {
  static get observedAttributes() {
    return ["platform", "width", "color", "status-bar", "time", "notch", "home-indicator", "nav-style", "aria-label"];
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
      <figure class="tux-mobile-frame">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-mobile-frame')) {
  customElements.define('tux-mobile-frame', TuxMobileFrameElement);
}
