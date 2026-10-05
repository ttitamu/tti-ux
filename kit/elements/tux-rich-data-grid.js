/**
 * <tux-rich-data-grid> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRichDataGridElement extends HTMLElement {
  static get observedAttributes() {
    return ["columns", "rows", "row-key", "title", "meta", "search-placeholder", "show-search", "show-filter", "show-columns", "show-export", "filters", "selected", "selection-disabled", "bulk-actions", "expanded", "expansion-disabled", "sort-key", "sort-dir", "max-height", "virtualized", "virtual-row-height", "density", "pagination-label", "pagination-tokens"];
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
      <div class="tux-rich-data-grid">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-rich-data-grid')) {
  customElements.define('tux-rich-data-grid', TuxRichDataGridElement);
}
