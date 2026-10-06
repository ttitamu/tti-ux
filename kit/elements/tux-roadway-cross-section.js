/**
 * <tux-roadway-cross-section> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRoadwayCrossSectionElement extends HTMLElement {
  static get observedAttributes() {
    return ["preset", "initial-view", "height", "interactive", "initial-pitch", "initial-yaw"];
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
      <div class="tux-roadway-cross-section">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-roadway-cross-section')) {
  customElements.define('tux-roadway-cross-section', TuxRoadwayCrossSectionElement);
}
