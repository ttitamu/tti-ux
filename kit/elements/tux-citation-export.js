/**
 * <tux-citation-export> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCitationExportElement extends HTMLElement {
  static get observedAttributes() {
    return ["citation", "label", "variant"];
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
      <UDropdownMenu class="tux-citation-export">
        <slot></slot>
      </UDropdownMenu>
    `;
  }
}

if (!customElements.get('tux-citation-export')) {
  customElements.define('tux-citation-export', TuxCitationExportElement);
}
