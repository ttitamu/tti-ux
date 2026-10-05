/**
 * <tux-inline-citation> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxInlineCitationElement extends HTMLElement {
  static get observedAttributes() {
    return ["n", "title", "href", "excerpt", "score", "label"];
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
      <UPopover class="tux-inline-citation">
        <slot></slot>
      </UPopover>
    `;
  }
}

if (!customElements.get('tux-inline-citation')) {
  customElements.define('tux-inline-citation', TuxInlineCitationElement);
}
