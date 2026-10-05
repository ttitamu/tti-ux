/**
 * <tux-signup-feature> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSignupFeatureElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "eyebrow", "dek", "action-label", "placeholder", "consent", "model-value", "tone", "variant"];
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
      <section class="tux-signup-feature">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-signup-feature')) {
  customElements.define('tux-signup-feature', TuxSignupFeatureElement);
}
