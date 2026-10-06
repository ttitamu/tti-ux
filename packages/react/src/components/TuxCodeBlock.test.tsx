import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TuxCodeBlock } from "./TuxCodeBlock";

describe("TuxCodeBlock (React)", () => {
  const sampleCode = `import { ref } from "vue";\nconst count = ref(0);`;

  it("renders code block with fallback pre/code and filename", () => {
    const { container } = render(
      <TuxCodeBlock
        code={sampleCode}
        lang="ts"
        filename="src/counter.ts"
      />,
    );

    const figure = container.querySelector("figure");
    expect(figure).not.toBeNull();
    expect(figure?.classList.contains("tux-codeblock")).toBe(true);

    const caption = container.querySelector("figcaption");
    expect(caption).not.toBeNull();
    expect(caption?.textContent).toContain("src/counter.ts");
    expect(caption?.textContent).toContain("ts");

    const codeEl = container.querySelector("code");
    expect(codeEl).not.toBeNull();
    expect(codeEl?.textContent).toContain("const count = ref(0);");
  });

  it("renders line numbers when lineNumbers is true", () => {
    const { container } = render(
      <TuxCodeBlock
        code={sampleCode}
        lineNumbers
      />,
    );

    const lineNos = container.querySelectorAll(".tux-codeblock__line-no");
    expect(lineNos.length).toBe(2);
    expect(lineNos[0].textContent).toBe("1");
    expect(lineNos[1].textContent).toBe("2");
  });

  it("renders pre-highlighted html when provided", () => {
    const html = `<pre><code><span class="keyword">const</span> x = 1;</code></pre>`;
    const { container } = render(
      <TuxCodeBlock
        code="const x = 1;"
        highlightedHtml={html}
      />,
    );

    const rendered = container.querySelector(".tux-codeblock__rendered");
    expect(rendered).not.toBeNull();
    expect(rendered?.innerHTML).toContain("class=\"keyword\"");
  });
});
