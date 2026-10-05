/**
 * <tux-spectrum-facts> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSpectrumFactsElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "subtitle", "items", "tone", "show-top-ribbon"];
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
      <section class="tux-spectrum-facts">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-spectrum-facts')) {
  customElements.define('tux-spectrum-facts', TuxSpectrumFactsElement);
}
