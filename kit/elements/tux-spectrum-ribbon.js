/**
 * <tux-spectrum-ribbon> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSpectrumRibbonElement extends HTMLElement {
  static get observedAttributes() {
    return ["size", "orientation", "show-labels", "rounded", "aria-label", "bands"];
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
      <div class="tux-spectrum-ribbon">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-spectrum-ribbon')) {
  customElements.define('tux-spectrum-ribbon', TuxSpectrumRibbonElement);
}
