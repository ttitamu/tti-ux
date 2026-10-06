/**
 * <tux-card> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxCardElement extends HTMLElement {
  static get observedAttributes() {
    return ["to", "padded", "linked"];
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
      <NuxtLink class="tux-card">
        <slot></slot>
      </NuxtLink>
    `;
  }
}

if (!customElements.get('tux-card')) {
  customElements.define('tux-card', TuxCardElement);
}
