/**
 * <tux-author-byline> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxAuthorBylineElement extends HTMLElement {
  static get observedAttributes() {
    return ["authors", "affiliations", "layout"];
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
      <section class="tux-author-byline">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-author-byline')) {
  customElements.define('tux-author-byline', TuxAuthorBylineElement);
}
