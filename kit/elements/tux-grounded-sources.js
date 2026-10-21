/**
 * <tux-grounded-sources> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxGroundedSourcesElement extends HTMLElement {
  static get observedAttributes() {
    return ["sources", "dlp-label"];
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
      <div class="tux-grounded-sources">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-grounded-sources')) {
  customElements.define('tux-grounded-sources', TuxGroundedSourcesElement);
}
