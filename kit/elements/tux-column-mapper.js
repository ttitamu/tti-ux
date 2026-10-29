/**
 * <tux-column-mapper> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxColumnMapperElement extends HTMLElement {
  static get observedAttributes() {
    return ["source-columns", "sample-rows", "target-fields", "model-value", "confirm-label"];
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
      <div class="tux-column-mapper">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-column-mapper')) {
  customElements.define('tux-column-mapper', TuxColumnMapperElement);
}
