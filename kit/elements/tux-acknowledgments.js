/**
 * <tux-acknowledgments> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxAcknowledgmentsElement extends HTMLElement {
  static get observedAttributes() {
    return ["funding", "acknowledgments", "conflicts", "ethics", "level"];
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
      <section class="tux-acknowledgments">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-acknowledgments')) {
  customElements.define('tux-acknowledgments', TuxAcknowledgmentsElement);
}
