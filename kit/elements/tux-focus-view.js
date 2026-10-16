/**
 * <tux-focus-view> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFocusViewElement extends HTMLElement {
  static get observedAttributes() {
    return ["open", "title", "eyebrow", "dismiss-on-backdrop-click", "dismiss-on-escape", "back-label"];
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
      <div class="tux-focus-view">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-focus-view')) {
  customElements.define('tux-focus-view', TuxFocusViewElement);
}
