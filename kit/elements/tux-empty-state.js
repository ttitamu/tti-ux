/**
 * <tux-empty-state> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxEmptyStateElement extends HTMLElement {
  static get observedAttributes() {
    return ["kind", "icon", "title", "description", "no-card", "compact"];
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
      <div class="tux-empty-state">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-empty-state')) {
  customElements.define('tux-empty-state', TuxEmptyStateElement);
}
