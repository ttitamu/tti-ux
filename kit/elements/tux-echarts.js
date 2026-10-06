/**
 * <tux-echarts> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxEChartsElement extends HTMLElement {
  static get observedAttributes() {
    return ["options", "height", "width", "aria-title", "aria-summary", "extensions", "maps", "loading", "not-merge"];
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
      <div class="tux-echarts">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-echarts')) {
  customElements.define('tux-echarts', TuxEChartsElement);
}
