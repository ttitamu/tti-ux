/**
 * <tux-infinite-scroll> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxInfiniteScrollElement extends HTMLElement {
  static get observedAttributes() {
    return ["loaded", "total", "loading", "keyboard-fallback", "root-margin", "noun", "noun-plural"];
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
      <div class="tux-infinite-scroll">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-infinite-scroll')) {
  customElements.define('tux-infinite-scroll', TuxInfiniteScrollElement);
}
