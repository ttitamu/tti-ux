/**
 * <tux-pagination> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPaginationElement extends HTMLElement {
  static get observedAttributes() {
    return ["total", "model-value", "page-size", "sibling-count", "boundary-count", "show-status", "noun", "plural-noun", "aria-label"];
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
      <nav class="tux-pagination">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-pagination')) {
  customElements.define('tux-pagination', TuxPaginationElement);
}
