/**
 * <tux-unit-value> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxUnitValueElement extends HTMLElement {
  static get observedAttributes() {
    return ["value", "unit", "ci", "decimals", "label", "station", "variant", "interactive", "system", "division"];
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
      <span class="tux-unit-value">
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get('tux-unit-value')) {
  customElements.define('tux-unit-value', TuxUnitValueElement);
}
