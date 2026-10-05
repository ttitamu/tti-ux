/**
 * <tux-hero-canvas> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxHeroCanvasElement extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "blend", "interactive", "show-controls", "min-height"];
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
      <div class="tux-hero-canvas">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-hero-canvas')) {
  customElements.define('tux-hero-canvas', TuxHeroCanvasElement);
}
