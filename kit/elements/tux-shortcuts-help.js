/**
 * <tux-shortcuts-help> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxShortcutsHelpElement extends HTMLElement {
  static get observedAttributes() {
    return ["groups", "sequence-separator"];
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
      <dialog class="tux-shortcuts-help">
        <slot></slot>
      </dialog>
    `;
  }
}

if (!customElements.get('tux-shortcuts-help')) {
  customElements.define('tux-shortcuts-help', TuxShortcutsHelpElement);
}
