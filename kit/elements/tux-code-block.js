/**
 * <tux-code-block> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCodeBlockElement extends HTMLElement {
  static get observedAttributes() {
    return ["code", "lang", "filename", "line-numbers", "no-copy", "no-download"];
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
      <figure class="tux-code-block">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-code-block')) {
  customElements.define('tux-code-block', TuxCodeBlockElement);
}
