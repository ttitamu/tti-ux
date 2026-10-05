/**
 * <tux-section-header> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSectionHeaderElement extends HTMLElement {
  static get observedAttributes() {
    return ["level", "title", "secondary-title", "subtitle", "kicker", "variant"];
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
      <header class="tux-section-header">
        <slot></slot>
      </header>
    `;
  }
}

if (!customElements.get('tux-section-header')) {
  customElements.define('tux-section-header', TuxSectionHeaderElement);
}
