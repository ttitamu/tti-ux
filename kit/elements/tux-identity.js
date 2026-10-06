/**
 * <tux-identity> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxIdentityElement extends HTMLElement {
  static get observedAttributes() {
    return ["name", "superhead", "level", "orientation", "kind", "href", "logo-size"];
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
      <component class="tux-identity">
        <slot></slot>
      </component>
    `;
  }
}

if (!customElements.get('tux-identity')) {
  customElements.define('tux-identity', TuxIdentityElement);
}
