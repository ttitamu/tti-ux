/**
 * <tux-report-frame> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxReportFrameElement extends HTMLElement {
  static get observedAttributes() {
    return ["size", "density", "break-after", "title", "eyebrow"];
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
      <article class="tux-report-frame">
        <slot></slot>
      </article>
    `;
  }
}

if (!customElements.get('tux-report-frame')) {
  customElements.define('tux-report-frame', TuxReportFrameElement);
}
