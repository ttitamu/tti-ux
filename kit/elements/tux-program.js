/**
 * <tux-program> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxProgramElement extends HTMLElement {
  static get observedAttributes() {
    return ["name", "eyebrow", "summary", "hero", "leads", "funders", "metrics"];
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
      <article class="tux-program">
        <slot></slot>
      </article>
    `;
  }
}

if (!customElements.get('tux-program')) {
  customElements.define('tux-program', TuxProgramElement);
}
