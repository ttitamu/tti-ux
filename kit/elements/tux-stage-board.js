/**
 * <tux-stage-board> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxStageBoardElement extends HTMLElement {
  static get observedAttributes() {
    return ["stages", "items", "metric-prefix", "metric-suffix", "decimals", "movable"];
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
      <div class="tux-stage-board">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-stage-board')) {
  customElements.define('tux-stage-board', TuxStageBoardElement);
}
