/**
 * <tux-validation-summary> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxValidationSummaryElement extends HTMLElement {
  static get observedAttributes() {
    return ["errors", "title", "variant"];
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
      <div class="tux-validation-summary">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-validation-summary')) {
  customElements.define('tux-validation-summary', TuxValidationSummaryElement);
}
