/**
 * <tux-status-toast> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxStatusToastElement extends HTMLElement {
  static get observedAttributes() {
    return ["edge"];
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
      <div class="tux-status-toast">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-status-toast')) {
  customElements.define('tux-status-toast', TuxStatusToastElement);
}
