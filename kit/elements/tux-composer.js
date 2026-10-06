/**
 * <tux-composer> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxComposerElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "placeholder", "models", "model-id", "max-length", "hint", "hide-attach", "attach-label", "attach-icon", "cancelable", "cancel-label"];
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
      <div class="tux-composer">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-composer')) {
  customElements.define('tux-composer', TuxComposerElement);
}
