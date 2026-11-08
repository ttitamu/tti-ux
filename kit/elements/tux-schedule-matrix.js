/**
 * <tux-schedule-matrix> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxScheduleMatrixElement extends HTMLElement {
  static get observedAttributes() {
    return [];
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
      <div class="tux-schedule-matrix">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-schedule-matrix')) {
  customElements.define('tux-schedule-matrix', TuxScheduleMatrixElement);
}
