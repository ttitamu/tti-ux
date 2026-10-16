/**
 * <tux-page-container> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPageContainerElement extends HTMLElement {
  static get observedAttributes() {
    return ["width", "flush", "as"];
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
      <div class="tux-page-container">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-page-container')) {
  customElements.define('tux-page-container', TuxPageContainerElement);
}
