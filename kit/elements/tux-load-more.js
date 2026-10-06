/**
 * <tux-load-more> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxLoadMoreElement extends HTMLElement {
  static get observedAttributes() {
    return ["loaded", "total", "loading", "noun", "noun-plural", "label", "terminal-label"];
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
      <div class="tux-load-more">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-load-more')) {
  customElements.define('tux-load-more', TuxLoadMoreElement);
}
