/**
 * <tux-record-diff> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRecordDiffElement extends HTMLElement {
  static get observedAttributes() {
    return ["fields", "before-label", "after-label", "changes-only-default", "title"];
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
      <div class="tux-record-diff">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-record-diff')) {
  customElements.define('tux-record-diff', TuxRecordDiffElement);
}
