/**
 * <tux-card-carousel> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCardCarouselElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "eyebrow", "title", "bare", "arrows", "dots", "loop", "slides-to-scroll", "align", "gap", "aria-label"];
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
      <div class="tux-card-carousel">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-card-carousel')) {
  customElements.define('tux-card-carousel', TuxCardCarouselElement);
}
