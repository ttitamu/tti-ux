/**
 * <tux-branch-nav> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxBranchNavElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "total", "loop", "hide-singleton", "aria-label"];
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
      <nav class="tux-branch-nav">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-branch-nav')) {
  customElements.define('tux-branch-nav', TuxBranchNavElement);
}
