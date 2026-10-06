/**
 * <tux-example> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxExampleElement extends HTMLElement {
  static get observedAttributes() {
    return ["vue", "react", "wc", "razor", "source", "css", "powerbi", "title", "preview-padding"];
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
      <div class="tux-example">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-example')) {
  customElements.define('tux-example', TuxExampleElement);
}
