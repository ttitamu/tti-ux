/**
 * <tux-code-maroon> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCodeMaroonElement extends HTMLElement {
  static get observedAttributes() {
    return ["active", "tone", "title", "message", "details-url", "details-label", "dismissible", "model-value", "sticky"];
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
      <Transition class="tux-code-maroon">
        <slot></slot>
      </Transition>
    `;
  }
}

if (!customElements.get('tux-code-maroon')) {
  customElements.define('tux-code-maroon', TuxCodeMaroonElement);
}
