/**
 * <tux-event-calendar-row> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxEventCalendarRowElement extends HTMLElement {
  static get observedAttributes() {
    return ["day", "month", "title", "time", "location", "category", "to", "href", "action-text", "chip-tone"];
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
      <article class="tux-event-calendar-row">
        <slot></slot>
      </article>
    `;
  }
}

if (!customElements.get('tux-event-calendar-row')) {
  customElements.define('tux-event-calendar-row', TuxEventCalendarRowElement);
}
