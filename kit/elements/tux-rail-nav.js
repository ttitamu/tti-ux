/**
 * <tux-rail-nav> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRailNavElement extends HTMLElement {
  static get observedAttributes() {
    return ["items", "collapsed", "aria-label"];
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
      <nav class="tux-rail-nav">
        <slot></slot>
      </nav>
    `;
  }
}

if (!customElements.get('tux-rail-nav')) {
  customElements.define('tux-rail-nav', TuxRailNavElement);
}
