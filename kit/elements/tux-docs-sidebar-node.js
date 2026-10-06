/**
 * <tux-docs-sidebar-node> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxDocsSidebarNodeElement extends HTMLElement {
  static get observedAttributes() {
    return ["section", "path", "query", "open-map", "is-open", "is-active", "on-toggle", "depth"];
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
      <li class="tux-docs-sidebar-node">
        <slot></slot>
      </li>
    `;
  }
}

if (!customElements.get('tux-docs-sidebar-node')) {
  customElements.define('tux-docs-sidebar-node', TuxDocsSidebarNodeElement);
}
