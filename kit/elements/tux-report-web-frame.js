/**
 * <tux-report-web-frame> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxReportWebFrameElement extends HTMLElement {
  static get observedAttributes() {
    return ["eyebrow", "title", "lede", "byline", "date", "reading-time", "toc", "width"];
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
      <article class="tux-report-web-frame">
        <slot></slot>
      </article>
    `;
  }
}

if (!customElements.get('tux-report-web-frame')) {
  customElements.define('tux-report-web-frame', TuxReportWebFrameElement);
}
