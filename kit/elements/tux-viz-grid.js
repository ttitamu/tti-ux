/**
 * <tux-viz-grid> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxVizGridElement extends HTMLElement {
  static get observedAttributes() {
    return ["cols", "eyebrow", "title", "dek"];
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
      <section class="tux-viz-grid">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-viz-grid')) {
  customElements.define('tux-viz-grid', TuxVizGridElement);
}
