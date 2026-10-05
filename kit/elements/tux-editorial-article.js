/**
 * <tux-editorial-article> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxEditorialArticleElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "category", "dek", "date", "date-label", "read-time", "author", "authors", "hero-image", "hero-alt", "hero-caption", "hero-layout", "stats", "highlights", "citation", "toc", "toc-target", "show-reading-progress", "show-scroll-top", "show-share", "tags", "contact", "back-to", "label", "to"];
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
      <div class="tux-editorial-article">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-editorial-article')) {
  customElements.define('tux-editorial-article', TuxEditorialArticleElement);
}
