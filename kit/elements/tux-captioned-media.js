/**
 * <tux-captioned-media> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCaptionedMediaElement extends HTMLElement {
  static get observedAttributes() {
    return ["src", "alt", "caption", "credit", "eyebrow", "aspect", "align", "tone"];
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
      <figure class="tux-captioned-media">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-captioned-media')) {
  customElements.define('tux-captioned-media', TuxCaptionedMediaElement);
}
