/**
 * <tux-vision-preferences-modal> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxVisionPreferencesModalElement extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
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
      <div class="tux-vision-preferences-modal">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-vision-preferences-modal')) {
  customElements.define('tux-vision-preferences-modal', TuxVisionPreferencesModalElement);
}
