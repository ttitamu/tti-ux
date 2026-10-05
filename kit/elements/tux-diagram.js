/**
 * <tux-diagram> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxDiagramElement extends HTMLElement {
  static get observedAttributes() {
    return ["code", "caption", "eyebrow"];
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
      <figure class="tux-diagram">
        <slot></slot>
      </figure>
    `;
  }
}

if (!customElements.get('tux-diagram')) {
  customElements.define('tux-diagram', TuxDiagramElement);
}
