/**
 * <tux-record-highlights> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRecordHighlightsElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "eyebrow", "icon", "items"];
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
      <div class="tux-record-highlights">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-record-highlights')) {
  customElements.define('tux-record-highlights', TuxRecordHighlightsElement);
}
