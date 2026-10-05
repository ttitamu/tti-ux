/**
 * <tux-abstract> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxAbstractElement extends HTMLElement {
  static get observedAttributes() {
    return ["background", "methods", "results", "conclusion", "keywords", "variant", "level"];
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
      <section class="tux-abstract">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-abstract')) {
  customElements.define('tux-abstract', TuxAbstractElement);
}
