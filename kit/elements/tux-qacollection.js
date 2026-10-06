/**
 * <tux-qacollection> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxQACollectionElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "variant"];
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
      <ol class="tux-qacollection">
        <slot></slot>
      </ol>
    `;
  }
}

if (!customElements.get('tux-qacollection')) {
  customElements.define('tux-qacollection', TuxQACollectionElement);
}
