/**
 * <tux-icon-feature> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxIconFeatureElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "layout", "columns"];
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
      <ul class="tux-icon-feature">
        <slot></slot>
      </ul>
    `;
  }
}

if (!customElements.get('tux-icon-feature')) {
  customElements.define('tux-icon-feature', TuxIconFeatureElement);
}
