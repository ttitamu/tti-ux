/**
 * <tux-key-value-input> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxKeyValueInputElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "schema", "strict-keys", "key-placeholder", "value-placeholder", "add-label"];
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
      <div class="tux-key-value-input">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-key-value-input')) {
  customElements.define('tux-key-value-input', TuxKeyValueInputElement);
}
