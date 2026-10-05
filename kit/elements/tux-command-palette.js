/**
 * <tux-command-palette> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCommandPaletteElement extends HTMLElement {
  static get observedAttributes() {
    return ["groups", "placeholder", "disable-hotkey", "hotkey", "show-tabs", "default-tab"];
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
      <dialog class="tux-command-palette">
        <slot></slot>
      </dialog>
    `;
  }
}

if (!customElements.get('tux-command-palette')) {
  customElements.define('tux-command-palette', TuxCommandPaletteElement);
}
