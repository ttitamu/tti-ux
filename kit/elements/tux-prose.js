/**
 * <tux-prose> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxProseElement extends HTMLElement {
  static get observedAttributes() {
    return ["as"];
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
      <component class="tux-prose">
        <slot></slot>
      </component>
    `;
  }
}

if (!customElements.get('tux-prose')) {
  customElements.define('tux-prose', TuxProseElement);
}
