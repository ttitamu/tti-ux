/**
 * <tux-viz-rplot> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxVizRPlotElement extends HTMLElement {
  static get observedAttributes() {
    return ["src", "kind", "title", "eyebrow", "ratio", "alt", "src2x", "source", "level"];
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
      <figure class="tux-viz-rplot">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-viz-rplot')) {
  customElements.define('tux-viz-rplot', TuxVizRPlotElement);
}
