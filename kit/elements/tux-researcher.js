/**
 * <tux-researcher> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxResearcherElement extends HTMLElement {
  static get observedAttributes() {
    return ["name", "role", "portrait", "center", "orcid", "email", "bio", "projects", "metrics", "layout", "to"];
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
      <article class="tux-researcher">
        <slot></slot>
      </article>
    `;
  }
}

if (!customElements.get('tux-researcher')) {
  customElements.define('tux-researcher', TuxResearcherElement);
}
