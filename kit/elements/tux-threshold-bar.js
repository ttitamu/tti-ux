/**
 * <tux-threshold-bar> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxThresholdBarElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "segments", "limit", "unit", "unit-position", "decimals", "warning-ratio", "show-legend"];
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
      <div class="tux-threshold-bar">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-threshold-bar')) {
  customElements.define('tux-threshold-bar', TuxThresholdBarElement);
}
