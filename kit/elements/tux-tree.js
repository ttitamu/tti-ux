/**
 * <tux-tree> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxTreeElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "default-expanded", "storage-key", "show-guides", "aria-label"];
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
      <ul class="tux-tree">
        <slot></slot>
      </ul>
    `;
  }
}

if (!customElements.get('tux-tree')) {
  customElements.define('tux-tree', TuxTreeElement);
}
