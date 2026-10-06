/**
 * <tux-map-embed> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxMapEmbedElement extends HTMLElement {
  static get observedAttributes() {
    return ["src", "eyebrow", "title", "subtitle", "source", "aspect", "height", "iframe-title", "attribution", "skeleton"];
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
      <figure class="tux-map-embed">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-map-embed')) {
  customElements.define('tux-map-embed', TuxMapEmbedElement);
}
