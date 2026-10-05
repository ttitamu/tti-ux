/**
 * <tux-chat-message> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxChatMessageElement extends HTMLElement {
  static get observedAttributes() {
    return ["role", "author", "timestamp", "meta", "initials"];
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
      <article class="tux-chat-message">
        <slot></slot>
      </article>
    `;
  }
}

if (!customElements.get('tux-chat-message')) {
  customElements.define('tux-chat-message', TuxChatMessageElement);
}
