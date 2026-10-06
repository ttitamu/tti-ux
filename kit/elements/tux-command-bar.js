/**
 * <tux-command-bar> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCommandBarElement extends HTMLElement {
  static get observedAttributes() {
    return ["selected-count", "density", "bordered"];
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
      <div class="tux-command-bar">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-command-bar')) {
  customElements.define('tux-command-bar', TuxCommandBarElement);
}
