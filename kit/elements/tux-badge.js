/**
 * <tux-badge> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxBadgeElement extends HTMLElement {
  static get observedAttributes() {
    return ["tier", "status", "tone", "kind", "variant", "bold", "dot", "icon", "count", "label", "uppercase"];
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
      <UBadge class="tux-badge">
        <slot></slot>
      </UBadge>
    `;
  }
}

if (!customElements.get('tux-badge')) {
  customElements.define('tux-badge', TuxBadgeElement);
}
