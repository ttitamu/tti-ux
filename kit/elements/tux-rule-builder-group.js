/**
 * <tux-rule-builder-group> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRuleBuilderGroupElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "depth", "is-root"];
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
      <div class="tux-rule-builder-group">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-rule-builder-group')) {
  customElements.define('tux-rule-builder-group', TuxRuleBuilderGroupElement);
}
