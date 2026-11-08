/**
 * <tux-uptime-strip> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxUptimeStripElement extends HTMLElement {
  static get observedAttributes() {
    return ["service-name", "service-group", "buckets", "window-label", "sla-target-pct", "current-latency-ms"];
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
      <div class="tux-uptime-strip">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-uptime-strip')) {
  customElements.define('tux-uptime-strip', TuxUptimeStripElement);
}
