/**
 * <tux-toc> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxTOCElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "target", "levels", "title", "no-title", "variant"];
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
      <nav class="tux-toc">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-toc')) {
  customElements.define('tux-toc', TuxTOCElement);
}
