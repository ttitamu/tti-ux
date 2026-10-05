/**
 * <tux-feedback> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFeedbackElement extends HTMLElement {
  static get observedAttributes() {
    return ["page-id", "title", "endpoint", "allow-details"];
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
      <section class="tux-feedback">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-feedback')) {
  customElements.define('tux-feedback', TuxFeedbackElement);
}
