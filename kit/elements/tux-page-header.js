/**
 * <tux-page-header> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPageHeaderElement extends HTMLElement {
  static get observedAttributes() {
    return ["eyebrow", "title", "level", "tone", "rhythm", "variant"];
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
      <header class="tux-page-header">
        <slot></slot>
      </header>
    `;
  }
}

if (!customElements.get('tux-page-header')) {
  customElements.define('tux-page-header', TuxPageHeaderElement);
}
