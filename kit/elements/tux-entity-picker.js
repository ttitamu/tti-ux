/**
 * <tux-entity-picker> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxEntityPickerElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "options", "label", "placeholder", "clearable"];
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
      <div class="tux-entity-picker">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-entity-picker')) {
  customElements.define('tux-entity-picker', TuxEntityPickerElement);
}
