/**
 * <tux-metro-inset> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxMetroInsetElement extends HTMLElement {
  static get observedAttributes() {
    return ["name", "highway-label", "height", "palette", "seed", "cols", "rows"];
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
      <div class="tux-metro-inset">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-metro-inset')) {
  customElements.define('tux-metro-inset', TuxMetroInsetElement);
}
