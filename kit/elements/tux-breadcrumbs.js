/**
 * <tux-breadcrumbs> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxBreadcrumbsElement extends HTMLElement {
  static get observedAttributes() {
    return ["trail", "home-icon", "chevron", "aria-label"];
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
      <nav class="tux-breadcrumbs">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-breadcrumbs')) {
  customElements.define('tux-breadcrumbs', TuxBreadcrumbsElement);
}
