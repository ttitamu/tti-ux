/**
 * <tux-footnote> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFootnoteElement extends HTMLElement {
  static get observedAttributes() {
    return ["n", "text", "id-prefix"];
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
      <UPopover class="tux-footnote">
        <slot></slot>
      </UPopover>
    `;
  }
}

if (!customElements.get('tux-footnote')) {
  customElements.define('tux-footnote', TuxFootnoteElement);
}
