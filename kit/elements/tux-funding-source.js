/**
 * <tux-funding-source> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFundingSourceElement extends HTMLElement {
  static get observedAttributes() {
    return ["funder", "abbrev", "logo", "grant", "to", "size", "layout"];
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
      <component class="tux-funding-source">
        <slot></slot>
      </component>
    `;
  }
}

if (!customElements.get('tux-funding-source')) {
  customElements.define('tux-funding-source', TuxFundingSourceElement);
}
