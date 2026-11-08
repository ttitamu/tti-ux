/**
 * <tux-feed-status> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFeedStatusElement extends HTMLElement {
  static get observedAttributes() {
    return ["feeds", "title", "layout", "syncable"];
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
      <div class="tux-feed-status">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-feed-status')) {
  customElements.define('tux-feed-status', TuxFeedStatusElement);
}
