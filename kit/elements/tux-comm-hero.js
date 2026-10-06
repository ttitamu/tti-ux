/**
 * <tux-comm-hero> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCommHeroElement extends HTMLElement {
  static get observedAttributes() {
    return ["eyebrow", "title", "accent-title", "lead", "primary-action-text", "primary-action-to", "primary-action-href", "secondary-action-text", "secondary-action-to", "secondary-action-href", "image-src", "image-alt", "image-badge", "chamfer"];
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
      <section class="tux-comm-hero">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-comm-hero')) {
  customElements.define('tux-comm-hero', TuxCommHeroElement);
}
