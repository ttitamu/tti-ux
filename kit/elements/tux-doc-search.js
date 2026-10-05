/**
 * <tux-doc-search> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxDocSearchElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "placeholder", "max-results"];
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
      <div class="tux-doc-search">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-doc-search')) {
  customElements.define('tux-doc-search', TuxDocSearchElement);
}
