/**
 * <tux-factoid> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFactoidElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "variant", "columns", "eyebrow", "title", "dek"];
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
      <section class="tux-factoid">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-factoid')) {
  customElements.define('tux-factoid', TuxFactoidElement);
}
