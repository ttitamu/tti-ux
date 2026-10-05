/**
 * <tux-info-label> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxInfoLabelElement extends HTMLElement {
  static get observedAttributes() {
    return ["for", "required", "trigger", "info-aria-label"];
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
      <label class="tux-info-label">
        <slot></slot>
      </label>
    `;
  }
}

if (!customElements.get('tux-info-label')) {
  customElements.define('tux-info-label', TuxInfoLabelElement);
}
