/**
 * <tux-slideover> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSlideoverElement extends HTMLElement {
  static get observedAttributes() {
    return ["side", "size", "title", "eyebrow", "show-close", "close-on-backdrop"];
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
      <dialog class="tux-slideover">
        <slot></slot>
      </dialog>
    `;
  }
}

if (!customElements.get('tux-slideover')) {
  customElements.define('tux-slideover', TuxSlideoverElement);
}
