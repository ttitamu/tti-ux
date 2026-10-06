/**
 * <tux-corridor-strip> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCorridorStripElement extends HTMLElement {
  static get observedAttributes() {
    return ["name", "from-mile", "to-mile", "segments", "events", "values", "values-label", "direction", "width", "height", "tick-every"];
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
      <figure class="tux-corridor-strip">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-corridor-strip')) {
  customElements.define('tux-corridor-strip', TuxCorridorStripElement);
}
