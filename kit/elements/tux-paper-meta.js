/**
 * <tux-paper-meta> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPaperMetaElement extends HTMLElement {
  static get observedAttributes() {
    return ["doi", "license", "funders", "published", "version", "type", "pages", "venue"];
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
      <dl class="tux-paper-meta">
        <slot></slot>
      </dl>
    `;
  }
}

if (!customElements.get('tux-paper-meta')) {
  customElements.define('tux-paper-meta', TuxPaperMetaElement);
}
