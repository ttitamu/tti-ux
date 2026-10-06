/**
 * <tux-playground> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxPlaygroundElement extends HTMLElement {
  static get observedAttributes() {
    return ["tag", "component-name", "controls", "presets", "title", "eyebrow", "slot-prop", "default-slot-text", "self-closing", "code-template", "preview-padding", "enable-deep-linking"];
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
      <div class="tux-playground">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-playground')) {
  customElements.define('tux-playground', TuxPlaygroundElement);
}
