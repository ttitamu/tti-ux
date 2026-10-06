/**
 * <tux-comment-thread> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCommentThreadElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "authors", "current-user", "hide-resolved", "size"];
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
      <div class="tux-comment-thread">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-comment-thread')) {
  customElements.define('tux-comment-thread', TuxCommentThreadElement);
}
