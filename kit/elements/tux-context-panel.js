/**
 * <tux-context-panel> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxContextPanelElement extends HTMLElement {
  static get observedAttributes() {
    return ["width"];
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
      <aside class="tux-context-panel">
        <slot></slot>
      </aside>
    `;
  }
}

if (!customElements.get('tux-context-panel')) {
  customElements.define('tux-context-panel', TuxContextPanelElement);
}
