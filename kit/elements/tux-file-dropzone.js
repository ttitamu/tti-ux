/**
 * <tux-file-dropzone> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxFileDropzoneElement extends HTMLElement {
  static get observedAttributes() {
    return ["model-value", "accept", "multiple", "max-size", "max-files", "disabled", "label", "hint"];
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
      <div class="tux-file-dropzone">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('tux-file-dropzone')) {
  customElements.define('tux-file-dropzone', TuxFileDropzoneElement);
}
