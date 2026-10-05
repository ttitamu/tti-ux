/**
 * <tux-rich-text-editor> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxRichTextEditorElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "placeholder", "disabled", "min-height", "max-height", "toolbar", "heading-levels", "show-count", "fullscreenable", "aria-label"];
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
      <div class="tux-rich-text-editor">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-rich-text-editor')) {
  customElements.define('tux-rich-text-editor', TuxRichTextEditorElement);
}
