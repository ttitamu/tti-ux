// @vitest-environment nuxt
/**
 * TuxBreadcrumbs without a router: crumbs with neither `to` nor `href`
 * are buttons that emit navigate(crumb, index); `href` crumbs are plain
 * links; existing pages are unchanged (a home crumb with no `to` still
 * links to "/" when nobody listens for navigate).
 */
import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxBreadcrumbs from "../../app/components/TuxBreadcrumbs.vue";

describe("TuxBreadcrumbs", () => {
  it("emits navigate from button crumbs", async () => {
    const trail = [{ label: "Roadmap" }, { label: "Forgejo v17 upgrade" }, { label: "#184" }];
    const w = await mountSuspended(TuxBreadcrumbs, { props: { trail, homeIcon: false, chevron: true, onNavigate: () => {} } });
    const buttons = w.findAll("button");
    expect(buttons.map((b) => b.text())).toEqual(["Roadmap", "Forgejo v17 upgrade"]);
    await buttons[1]!.trigger("click");
    expect(w.emitted("navigate")).toEqual([[trail[1], 1]]);
    expect(w.find('[aria-current="page"]').text()).toBe("#184");
  });

  it("renders href crumbs as plain links", async () => {
    const w = await mountSuspended(TuxBreadcrumbs, {
      props: { trail: [{ label: "Code", href: "https://code.example/tti" }, { label: "Here" }], homeIcon: false },
    });
    expect(w.find("a").attributes("href")).toBe("https://code.example/tti");
    expect(w.findAll("button")).toHaveLength(0);
  });

  it("keeps the old default: a home crumb with no `to` links to /", async () => {
    const w = await mountSuspended(TuxBreadcrumbs, { props: { trail: [{ label: "Home" }, { label: "Page" }] } });
    expect(w.find("a").attributes("href")).toBe("/");
    expect(w.findAll("button")).toHaveLength(0);
  });
});
