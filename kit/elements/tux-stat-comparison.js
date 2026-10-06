/**
 * <tux-stat-comparison> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxStatComparisonElement extends HTMLElement {
  static get observedAttributes() {
    return ["eyebrow", "current", "previous", "suffix", "label", "layout", "decimals", "polarity", "delta-format"];
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
      <div class="tux-stat-comparison">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-stat-comparison')) {
  customElements.define('tux-stat-comparison', TuxStatComparisonElement);
}
