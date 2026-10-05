/**
 * <tux-split-pane> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSplitPaneElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "initial-list-width", "min-list-width", "max-list-width", "id", "initial-bottom-height", "show-bottom", "list-label", "detail-label"];
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
      <div class="tux-split-pane">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-split-pane')) {
  customElements.define('tux-split-pane', TuxSplitPaneElement);
}
