/**
 * <tux-conversation-list> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxConversationListElement extends HTMLElement {
  static get observedAttributes() {
    return ["groups", "active-id"];
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
      <nav class="tux-conversation-list">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-conversation-list')) {
  customElements.define('tux-conversation-list', TuxConversationListElement);
}
