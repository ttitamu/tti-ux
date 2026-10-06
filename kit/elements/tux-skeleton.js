/**
 * <tux-skeleton> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSkeletonElement extends HTMLElement {
  static get observedAttributes() {
    return ["kind", "variant", "width", "height", "radius", "count", "animated", "label"];
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
      <div class="tux-skeleton">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-skeleton')) {
  customElements.define('tux-skeleton', TuxSkeletonElement);
}
