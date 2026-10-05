/**
 * <tux-map-marker> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxMapMarkerElement extends HTMLElement {
  static get observedAttributes() {
    return ["kind", "number", "tone-index", "size", "title"];
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
      <svg class="tux-map-marker">
        <slot></slot>
      </svg>
    `;
  }
}

if (!customElements.get('tux-map-marker')) {
  customElements.define('tux-map-marker', TuxMapMarkerElement);
}
