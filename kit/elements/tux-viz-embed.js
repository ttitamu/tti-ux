/**
 * <tux-viz-embed> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxVizEmbedElement extends HTMLElement {
  static get observedAttributes() {
    return ["src", "provider", "title", "eyebrow", "ratio", "sandbox", "referrerpolicy", "open-in-new", "poster-src", "poster-alt"];
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
      <figure class="tux-viz-embed">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-viz-embed')) {
  customElements.define('tux-viz-embed', TuxVizEmbedElement);
}
