// @vitest-environment nuxt
/**
 * TuxExample's HTML (DOM) tab is the only tab whose source changes
 * after mount: it is the preview's live markup. Capturing it
 * (tuxFormatHtml over innerHTML) and highlighting it with Shiki cost
 * about 100 ms a batch, so the wrapper must do that work only while
 * the HTML tab is shown. A preview that mutates constantly (the
 * architecture map's trailing cursor, an animation) must cost nothing
 * while another tab is open.
 */
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import TuxExample from "../app/components/TuxExample.vue";

const { highlight } = vi.hoisted(() => ({
  highlight: vi.fn(async (code: string, opts: { lang: string; theme: string }) =>
    `<pre class="shiki" data-theme="${opts.theme}" data-lang="${opts.lang}"><code>${code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</code></pre>`,
  ),
}));

mockNuxtImport("useTuxHighlighter", () => () => ({ highlight }));

// A reactive stand-in for @nuxtjs/color-mode's object: tests flip
// `.value` to change the Shiki theme.
const colorMode = ref("tti-light");
mockNuxtImport("useColorMode", () => () => ({
  get value() {
    return colorMode.value;
  },
  set value(v: string) {
    colorMode.value = v;
  },
  get preference() {
    return colorMode.value;
  },
}));

/** Resolve the idle/timeout the wrapper coalesces work into, then promises. */
async function settle() {
  await new Promise((r) => setTimeout(r, 50));
  await flushPromises();
  await new Promise((r) => setTimeout(r, 0));
  await flushPromises();
}

/** Highlights of the preview's DOM markup (the Web Component tab is lang html too). */
function htmlCalls() {
  return highlight.mock.calls.filter(([code, opts]) => opts.lang === "html" && code.includes("probe body"));
}

const Preview = defineComponent({
  setup() {
    return () => h("div", { "data-testid": "probe", "data-step": "0" }, "probe body");
  },
});

const mounted: { unmount: () => void }[] = [];

async function mountExample() {
  const wrapper = await mountSuspended(TuxExample, {
    props: { vue: "<Probe />" },
    slots: { default: () => h(Preview) },
  });
  mounted.push(wrapper);
  await settle();
  return wrapper;
}

function tabButton(wrapper: Awaited<ReturnType<typeof mountExample>>, label: string) {
  const btn = wrapper.findAll("button").find((b) => b.text().trim() === label);
  if (!btn) throw new Error(`no ${label} tab`);
  return btn;
}

afterEach(() => {
  // An earlier test's wrapper with its HTML tab open would answer this
  // test's theme change.
  while (mounted.length) mounted.pop()!.unmount();
  highlight.mockClear();
  colorMode.value = "tti-light";
});

describe("TuxExample HTML (DOM) tab", () => {
  it("does no capture or highlight work for preview mutations while another tab is open", async () => {
    const wrapper = await mountExample();
    // The Vue tab is the default; nothing has asked for the DOM markup.
    expect(htmlCalls()).toHaveLength(0);
    highlight.mockClear();

    const probe = wrapper.find('[data-testid="probe"]').element as HTMLElement;
    for (let i = 1; i <= 50; i++) {
      probe.setAttribute("data-step", String(i));
      // Let each mutation batch deliver separately, as pointer moves do.
      await new Promise((r) => setTimeout(r, 0));
    }
    await settle();

    expect(highlight).toHaveBeenCalledTimes(0);
  });

  it("shows the current markup when the HTML tab is opened", async () => {
    const wrapper = await mountExample();
    const probe = wrapper.find('[data-testid="probe"]').element as HTMLElement;
    for (let i = 1; i <= 50; i++) probe.setAttribute("data-step", String(i));
    await settle();
    highlight.mockClear();

    await tabButton(wrapper, "HTML (DOM)").trigger("click");
    await settle();

    expect(htmlCalls()).toHaveLength(1);
    expect(htmlCalls()[0]![0]).toContain('data-step="50"');
    expect(wrapper.find(".shiki-wrap").text()).toContain('data-step="50"');
  });

  it("re-highlights a mutation while the HTML tab is open, coalesced", async () => {
    const wrapper = await mountExample();
    await tabButton(wrapper, "HTML (DOM)").trigger("click");
    await settle();
    highlight.mockClear();

    const probe = wrapper.find('[data-testid="probe"]').element as HTMLElement;
    for (let i = 1; i <= 20; i++) probe.setAttribute("data-step", `open-${i}`);
    await settle();

    expect(htmlCalls().length).toBeGreaterThanOrEqual(1);
    expect(htmlCalls().length).toBeLessThan(20);
    expect(htmlCalls().at(-1)![0]).toContain('data-step="open-20"');
  });

  it("re-highlights on a theme change while the HTML tab is open, and not while it is closed", async () => {
    const wrapper = await mountExample();

    colorMode.value = "tti-dark";
    await settle();
    expect(htmlCalls()).toHaveLength(0);

    await tabButton(wrapper, "HTML (DOM)").trigger("click");
    await settle();
    expect(htmlCalls().at(-1)![1].theme).toBe("github-dark");
    highlight.mockClear();

    colorMode.value = "tti-hc";
    await settle();
    expect(htmlCalls()).toHaveLength(1);
    expect(htmlCalls()[0]![1].theme).toBe("github-light-high-contrast");
    expect(wrapper.find('.shiki-wrap [data-theme="github-light-high-contrast"]').exists()).toBe(true);
  });
});
