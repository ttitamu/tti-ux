/**
 * <tux-tooltip> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxTooltipElement extends HTMLElement {
  static get observedAttributes() {
    return ["text", "title", "kbds", "side", "arrow", "disabled"];
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
      <TooltipProvider class="tux-tooltip">
        <slot></slot>
      </TooltipProvider>
    `;
  }
}

if (!customElements.get('tux-tooltip')) {
  customElements.define('tux-tooltip', TuxTooltipElement);
}
