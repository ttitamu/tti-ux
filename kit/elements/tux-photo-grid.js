/**
 * <tux-photo-grid> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPhotoGridElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "kind", "columns", "aspect"];
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
      <ul class="tux-photo-grid">
        <slot></slot>
      </ul>
    `;
  }
}

if (!customElements.get('tux-photo-grid')) {
  customElements.define('tux-photo-grid', TuxPhotoGridElement);
}
