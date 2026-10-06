/**
 * <tux-contact-card> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxContactCardElement extends HTMLElement {
  static get observedAttributes() {
    return ["name", "role", "affiliation", "credentials", "image", "initial", "tone", "contacts", "layout"];
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
      <article class="tux-contact-card">
        <slot></slot>
      </article>
    `;
  }
}

if (!customElements.get('tux-contact-card')) {
  customElements.define('tux-contact-card', TuxContactCardElement);
}
