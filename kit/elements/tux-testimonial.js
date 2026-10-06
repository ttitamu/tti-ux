/**
 * <tux-testimonial> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxTestimonialElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "layout", "columns", "variant"];
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
      <ul class="tux-testimonial">
        <slot></slot>
      </ul>
    `;
  }
}

if (!customElements.get('tux-testimonial')) {
  customElements.define('tux-testimonial', TuxTestimonialElement);
}
