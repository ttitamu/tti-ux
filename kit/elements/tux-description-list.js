/**
 * <tux-description-list> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxDescriptionListElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "layout", "emphasis", "title"];
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
      <div class="tux-description-list">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-description-list')) {
  customElements.define('tux-description-list', TuxDescriptionListElement);
}
