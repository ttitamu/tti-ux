/**
 * <tux-result-count> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxResultCountElement extends HTMLElement {
  static get observedAttributes() {
    return ["page", "page-size", "total", "noun", "noun-plural", "page-size-options", "hide-range", "page-size-label"];
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
      <div class="tux-result-count">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-result-count')) {
  customElements.define('tux-result-count', TuxResultCountElement);
}
