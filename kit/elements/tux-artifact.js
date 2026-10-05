/**
 * <tux-artifact> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxArtifactElement extends HTMLElement {
  static get observedAttributes() {
    return ["title", "meta", "icon", "actions", "busy"];
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
      <section class="tux-artifact">
        <slot></slot>
      </section>
    `;
  }
}

if (!customElements.get('tux-artifact')) {
  customElements.define('tux-artifact', TuxArtifactElement);
}
