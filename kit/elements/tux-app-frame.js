/**
 * <tux-app-frame> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxAppFrameElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "eyebrow", "use-system-accent", "unified-toolbar", "force-chrome"];
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
      <header class="tux-app-frame">
        <slot></slot>
      </header>
    `;
  }
}

if (!customElements.get('tux-app-frame')) {
  customElements.define('tux-app-frame', TuxAppFrameElement);
}
