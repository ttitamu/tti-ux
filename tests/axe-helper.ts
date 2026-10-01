import axe from "axe-core";

export const AXE_COMPONENT_OPTIONS = {
  resultTypes: ["violations"],
  iframes: false,
  rules: {
    // Contrast requires full browser layout paint; audited in audit-wcag-aaa.mjs
    "color-contrast": { enabled: false },
    "color-contrast-enhanced": { enabled: false },
    // Isolated components are tested outside whole-page landmark regions
    region: { enabled: false },
  },
};

/**
 * Runs axe-core accessibility audit on a mounted component element
 * by attaching it to the document body (required by axe-core) and cleaning up.
 */
export async function runComponentAxe(element: Element, options: axe.RunOptions = AXE_COMPONENT_OPTIONS) {
  document.body.appendChild(element);
  try {
    const { violations } = await axe.run(element, options);
    return violations;
  } finally {
    element.remove();
  }
}
