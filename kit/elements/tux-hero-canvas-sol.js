/**
 * <tux-hero-canvas-sol> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxHeroCanvasSolElement extends HTMLElement {
  static get observedAttributes() {
    return ["blend", "interactive", "show-controls", "min-height", "mode"];
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
      <div class="tux-hero-canvas-sol">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-hero-canvas-sol')) {
  customElements.define('tux-hero-canvas-sol', TuxHeroCanvasSolElement);
}
