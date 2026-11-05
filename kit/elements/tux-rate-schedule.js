/**
 * <tux-rate-schedule> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRateScheduleElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "subtitle", "items", "currency-symbol", "sample-quantity", "editable", "status-filter"];
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
      <section class="tux-rate-schedule">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-rate-schedule')) {
  customElements.define('tux-rate-schedule', TuxRateScheduleElement);
}
