/**
 * <tux-stepper> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxStepperElement extends HTMLElement {
  static get observedAttributes() {
    return ["steps", "current-index", "orientation", "show-descriptions", "aria-label"];
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
      <nav class="tux-stepper">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-stepper')) {
  customElements.define('tux-stepper', TuxStepperElement);
}
