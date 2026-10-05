/**
 * <tux-cta> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCTAElement extends HTMLElement {
  static get observedAttributes() {
    return ["eyebrow", "title", "dek", "tone", "variant"];
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
      <section class="tux-cta">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-cta')) {
  customElements.define('tux-cta', TuxCTAElement);
}
