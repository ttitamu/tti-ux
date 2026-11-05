/**
 * <tux-anomaly-card> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxAnomalyCardElement extends HTMLElement {
  static get observedAttributes() {
    return ["id", "title", "metric-label", "current-value", "baseline-label", "delta-label", "projection-label", "severity", "state", "rule-summary", "series", "target-entity"];
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
      <article class="tux-anomaly-card">
        <slot></slot>
      </article>
    `;
  }
}

if (!customElements.get('tux-anomaly-card')) {
  customElements.define('tux-anomaly-card', TuxAnomalyCardElement);
}
