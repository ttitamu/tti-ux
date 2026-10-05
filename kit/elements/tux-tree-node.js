/**
 * <tux-tree-node> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxTreeNodeElement extends HTMLElement {
  static get observedAttributes() {
    return ["node", "depth", "selected-id", "is-expanded", "show-guides"];
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
      <li class="tux-tree-node">
        <slot></slot>
      </li>
    `;
  }
}

if (!customElements.get('tux-tree-node')) {
  customElements.define('tux-tree-node', TuxTreeNodeElement);
}
