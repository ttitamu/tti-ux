/**
 * <tux-segmented-input> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSegmentedInputElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "segments", "separator", "label", "help-text", "uppercase", "disabled"];
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
      <div class="tux-segmented-input">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-segmented-input')) {
  customElements.define('tux-segmented-input', TuxSegmentedInputElement);
}
