/**
 * <tux-architecture-map> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxArchitectureMapElement extends HTMLElement {
  static get observedAttributes() {
    return [];
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
      <figure class="tux-architecture-map">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-architecture-map')) {
  customElements.define('tux-architecture-map', TuxArchitectureMapElement);
}
