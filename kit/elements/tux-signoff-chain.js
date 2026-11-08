/**
 * <tux-signoff-chain> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSignoffChainElement extends HTMLElement {
  static get observedAttributes() {
    return ["stages", "active-stage-id", "attestation-text", "decision-options", "decision-label", "model-value", "show-actions", "approve-label", "reject-label"];
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
      <div class="tux-signoff-chain">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-signoff-chain')) {
  customElements.define('tux-signoff-chain', TuxSignoffChainElement);
}
