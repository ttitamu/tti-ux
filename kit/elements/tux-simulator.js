/**
 * <tux-simulator> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSimulatorElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "subtitle", "parameters", "presets", "primary-label", "comparison-label", "budget-limit", "currency-symbol", "show-comparison"];
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
      <section class="tux-simulator">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-simulator')) {
  customElements.define('tux-simulator', TuxSimulatorElement);
}
