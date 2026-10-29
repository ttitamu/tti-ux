/**
 * <tux-record-matcher> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRecordMatcherElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "allow-rule-creation", "rule-checkbox-label", "accept-label", "dismiss-label"];
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
      <div class="tux-record-matcher">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-record-matcher')) {
  customElements.define('tux-record-matcher', TuxRecordMatcherElement);
}
