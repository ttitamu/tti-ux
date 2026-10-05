/**
 * <tux-context-meter> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxContextMeterElement extends HTMLElement {
  static get observedAttributes() {
    return ["used", "max", "breakdown"];
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
      <UPopover class="tux-context-meter">
        <slot></slot>
      </UPopover>
    `;
  }
}

if (!customElements.get('tux-context-meter')) {
  customElements.define('tux-context-meter', TuxContextMeterElement);
}
