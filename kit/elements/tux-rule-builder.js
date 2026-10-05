/**
 * <tux-rule-builder> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRuleBuilderElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "fields", "show-actions", "max-depth"];
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
      <div class="tux-rule-builder">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-rule-builder')) {
  customElements.define('tux-rule-builder', TuxRuleBuilderElement);
}
