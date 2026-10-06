/**
 * <tux-activity-timeline> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxActivityTimelineElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "dense"];
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
      <ol class="tux-activity-timeline">
        <slot></slot>
      </ol>
    `;
  }
}

if (!customElements.get('tux-activity-timeline')) {
  customElements.define('tux-activity-timeline', TuxActivityTimelineElement);
}
