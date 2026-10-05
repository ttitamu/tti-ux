/**
 * <tux-error-page> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxErrorPageElement extends HTMLElement {
  static get observedAttributes() {
    return ["code", "title", "lede", "actions", "inline", "icon", "details"];
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
      <section class="tux-error-page">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-error-page')) {
  customElements.define('tux-error-page', TuxErrorPageElement);
}
