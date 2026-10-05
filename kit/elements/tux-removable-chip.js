/**
 * <tux-removable-chip> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRemovableChipElement extends HTMLElement {
  static get observedAttributes() {
    return ["icon", "removable", "size", "selected", "disabled", "remove-label", "click-to-remove"];
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
      <span class="tux-removable-chip">
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get('tux-removable-chip')) {
  customElements.define('tux-removable-chip', TuxRemovableChipElement);
}
