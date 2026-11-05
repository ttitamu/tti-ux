/**
 * <tux-log-viewer> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxLogViewerElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "lines", "initial-level", "wrap-lines", "show-line-numbers", "max-height"];
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
      <div class="tux-log-viewer">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-log-viewer')) {
  customElements.define('tux-log-viewer', TuxLogViewerElement);
}
