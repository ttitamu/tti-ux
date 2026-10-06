/**
 * <tux-chat-bubble> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChatBubbleElement extends HTMLElement {
  static get observedAttributes() {
    return ["mode", "role", "title", "subtitle", "state", "teaser", "tail", "dismissible", "open", "suggestions"];
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
      <div class="tux-chat-bubble">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-chat-bubble')) {
  customElements.define('tux-chat-bubble', TuxChatBubbleElement);
}
