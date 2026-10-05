/**
 * <tux-kbd> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxKbdElement extends HTMLElement {
  static get observedAttributes() {
    return ["value", "keys", "size", "separator"];
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
      <span class="tux-kbd">
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get('tux-kbd')) {
  customElements.define('tux-kbd', TuxKbdElement);
}
