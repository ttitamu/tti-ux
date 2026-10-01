import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { runComponentAxe } from "../axe-helper";
import TuxCodeBlock from "../../app/components/TuxCodeBlock.vue";

describe("TuxCodeBlock Component", () => {
  const sampleCode = `import { TuxButton } from "@tti/tti-ux";\n\nexport default function App() {\n  return <TuxButton intent="primary">Click</TuxButton>;\n}`;

  it("renders code content, caption filename, and passes axe audit", async () => {
    const wrapper = await mountSuspended(TuxCodeBlock, {
      props: {
        code: sampleCode,
        lang: "tsx",
        filename: "App.tsx",
      },
    });

    expect(wrapper.text()).toContain("App.tsx");
    expect(wrapper.text()).toContain("TuxButton");

    const copyBtn = wrapper.find("button");
    expect(copyBtn.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports line numbers toggle", async () => {
    const wrapper = await mountSuspended(TuxCodeBlock, {
      props: {
        code: "const x = 1;\nconst y = 2;",
        lang: "ts",
        lineNumbers: true,
      },
    });

    expect(wrapper.classes()).toContain("tux-codeblock--with-lines");
  });

  it("hides copy and download buttons when configured", async () => {
    const wrapper = await mountSuspended(TuxCodeBlock, {
      props: {
        code: "echo 'hello'",
        noCopy: true,
        noDownload: true,
      },
    });

    const buttons = wrapper.findAll("button");
    expect(buttons.length).toBe(0);
  });
});
