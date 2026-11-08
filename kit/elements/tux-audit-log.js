/**
 * <tux-audit-log> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxAuditLogElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "entries", "searchable", "initial-category", "exportable"];
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
      <section class="tux-audit-log">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-audit-log')) {
  customElements.define('tux-audit-log', TuxAuditLogElement);
}
