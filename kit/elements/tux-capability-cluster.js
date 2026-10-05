/**
 * <tux-capability-cluster> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCapabilityClusterElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "kicker", "subtitle", "capabilities", "columns"];
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
      <section class="tux-capability-cluster">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-capability-cluster')) {
  customElements.define('tux-capability-cluster', TuxCapabilityClusterElement);
}
