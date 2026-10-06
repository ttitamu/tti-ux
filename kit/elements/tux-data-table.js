/**
 * <tux-data-table> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxDataTableElement extends HTMLElement {
  static get observedAttributes() {
    return ["columns", "rows", "groups", "row-key", "table-number", "caption", "description", "sort-key", "sort-dir", "sticky", "max-height", "density", "banded", "footnotes", "source", "totals"];
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
      <figure class="tux-data-table">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-data-table')) {
  customElements.define('tux-data-table', TuxDataTableElement);
}
