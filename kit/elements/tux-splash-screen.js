/**
 * <tux-splash-screen> — HTML5 Web Component.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export class TuxSplashScreenElement extends HTMLElement {
  static get observedAttributes() {
    return ["loaded", "status", "hidden", "fade-delay"];
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
      <Transition class="tux-splash-screen">
        <slot></slot>
      </Transition>
    `;
  }
}

if (!customElements.get('tux-splash-screen')) {
  customElements.define('tux-splash-screen', TuxSplashScreenElement);
}
