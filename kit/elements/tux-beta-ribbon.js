/**
 * <tux-beta-ribbon> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxBetaRibbonElement extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "kind", "label", "corner", "message"];
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
      <div class="tux-beta-ribbon">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-beta-ribbon')) {
  customElements.define('tux-beta-ribbon', TuxBetaRibbonElement);
}
