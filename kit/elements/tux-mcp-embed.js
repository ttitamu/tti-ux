/**
 * <tux-mcp-embed> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxMcpEmbedElement extends HTMLElement {
  static get observedAttributes() {
    return ["app-name", "app-icon", "app-icon-url", "source", "loading", "collapsible", "expandable", "closable", "collapsed"];
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
      <section class="tux-mcp-embed">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-mcp-embed')) {
  customElements.define('tux-mcp-embed', TuxMcpEmbedElement);
}
