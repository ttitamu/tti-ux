/**
 * <tux-form-field> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFormFieldElement extends HTMLElement {
  static get observedAttributes() {
    return ["label", "help", "hint", "error", "required", "input-id", "layout"];
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
      <div class="tux-form-field">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-form-field')) {
  customElements.define('tux-form-field', TuxFormFieldElement);
}
