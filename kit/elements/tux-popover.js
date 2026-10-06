/**
 * <tux-popover> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPopoverElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "body", "mode", "side", "arrow", "disabled", "width"];
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
      <UPopover class="tux-popover">
        <slot></slot>
      </UPopover>
    `;
  }
}

if (!customElements.get('tux-popover')) {
  customElements.define('tux-popover', TuxPopoverElement);
}
