/**
 * <tux-reaction-bar> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxReactionBarElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "reactions", "counts", "size"];
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
      <div class="tux-reaction-bar">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-reaction-bar')) {
  customElements.define('tux-reaction-bar', TuxReactionBarElement);
}
