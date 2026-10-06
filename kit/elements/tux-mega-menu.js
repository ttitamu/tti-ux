/**
 * <tux-mega-menu> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxMegaMenuElement extends HTMLElement {
  static get observedAttributes() {
    return ["label", "columns", "featured", "to"];
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
      <div class="tux-mega-menu">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-mega-menu')) {
  customElements.define('tux-mega-menu', TuxMegaMenuElement);
}
