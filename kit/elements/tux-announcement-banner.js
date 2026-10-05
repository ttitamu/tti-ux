/**
 * <tux-announcement-banner> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxAnnouncementBannerElement extends HTMLElement {
  static get observedAttributes() {
    return ["id", "tone", "icon", "eyebrow", "message", "action", "dismissable"];
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
      <Transition class="tux-announcement-banner">
        <slot></slot>
      </Transition>
    `;
  }
}

if (!customElements.get('tux-announcement-banner')) {
  customElements.define('tux-announcement-banner', TuxAnnouncementBannerElement);
}
