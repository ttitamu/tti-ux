/**
 * <tux-period-picker> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPeriodPickerElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "presets", "label", "allow-compare", "step-days"];
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
      <div class="tux-period-picker">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-period-picker')) {
  customElements.define('tux-period-picker', TuxPeriodPickerElement);
}
