/**
 * TuxTestimonial — Vanilla JavaScript DOM helper.
 * Synchronized via Universal Component Sync Engine (scripts/sync-engine.mjs).
 */
export function createTuxTestimonial(props = {}, children = '') {
  const el = document.createElement('ul');
  el.className = 'tux-testimonial';
  if (typeof children === 'string') {
    el.innerHTML = children;
  } else if (children instanceof Node) {
    el.appendChild(children);
  }
  return el;
}

export default createTuxTestimonial;
