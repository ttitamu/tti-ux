/**
 * <tux-sparkline> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSparklineElement extends HTMLElement {
  static get observedAttributes() {
    return ["data", "width", "height", "tone", "stroke-width", "show-area", "show-last-point", "show-delta", "delta-format", "aria-summary", "units"];
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
      <span class="tux-sparkline">
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get('tux-sparkline')) {
  customElements.define('tux-sparkline', TuxSparklineElement);
}
