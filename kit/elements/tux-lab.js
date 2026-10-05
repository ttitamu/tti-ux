/**
 * <tux-lab> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxLabElement extends HTMLElement {
  static get observedAttributes() {
    return ["name", "summary", "logo", "projects-count", "people-count", "location", "leaders", "focus", "to"];
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
      <article class="tux-lab">
        <slot></slot>
      </article>
    `;
  }
}

if (!customElements.get('tux-lab')) {
  customElements.define('tux-lab', TuxLabElement);
}
