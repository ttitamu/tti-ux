import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import fs from "node:fs";
import path from "node:path";
import {
  TuxSidebar,
  TuxDocsSidebar,
  TuxSidebarBlock,
  TuxPortalHeader,
  TuxPortalShell,
  TuxAnnouncementBanner,
} from "../index";

describe("TuxSidebar / TuxDocsSidebar", () => {
  const sampleTree = [
    {
      label: "Foundations",
      defaultOpen: true,
      children: [
        { label: "Color Tokens", to: "/tokens/colors", badge: "AAA" },
        { label: "Typography", to: "/tokens/typography" },
      ],
    },
    {
      label: "Components",
      defaultOpen: false,
      children: [{ label: "Portal Shell", to: "/components/portal-shell" }],
    },
  ];

  it("exports TuxSidebar as an alias for TuxDocsSidebar and renders navigation items", () => {
    expect(TuxSidebar).toBe(TuxDocsSidebar);
    render(<TuxSidebar tree={sampleTree} activePath="/tokens/colors" />);
    expect(screen.getByText("Foundations")).toBeTruthy();
    const activeLink = screen.getByText("Color Tokens").closest("a");
    expect(activeLink?.getAttribute("aria-current")).toBe("page");
  });

  it("filters sidebar items via the search input", () => {
    render(<TuxSidebar tree={sampleTree} />);
    const input = screen.getByPlaceholderText("Filter navigation…");
    fireEvent.change(input, { target: { value: "Portal Shell" } });
    expect(screen.getByText("Portal Shell")).toBeTruthy();
    expect(screen.queryByText("Color Tokens")).toBeNull();
  });
});

describe("TuxSidebarBlock", () => {
  it("renders eyebrow, title, variant class, and children", () => {
    const { container } = render(
      <TuxSidebarBlock title="Quick Links" eyebrow="Resources" variant="bordered">
        <p>Corridor telemetry links</p>
      </TuxSidebarBlock>,
    );
    expect(screen.getByText("Resources")).toBeTruthy();
    expect(screen.getByText("Quick Links")).toBeTruthy();
    expect(screen.getByText("Corridor telemetry links")).toBeTruthy();
    expect(container.querySelector(".tux-sidebar-block--bordered")).toBeTruthy();
  });
});

describe("TuxPortalHeader & TuxPortalShell", () => {
  const navItems = [
    {
      label: "Research",
      children: [{ label: "Connected Infrastructure", to: "/research/v2x", badge: "FY26" }],
    },
    { label: "Publications", to: "/publications" },
  ];

  it("renders TuxPortalHeader with camelCase props and fires onSearchClick / onActionClick", () => {
    const onSearch = vi.fn();
    const onAction = vi.fn();
    render(
      <TuxPortalHeader
        portalTitle="Connected Corridors Initiative"
        portalBadge="Lab Portal"
        navItems={navItems}
        actionText="Launch Portal"
        onSearchClick={onSearch}
        onActionClick={onAction}
      />,
    );

    expect(screen.getByText("Connected Corridors Initiative")).toBeTruthy();
    expect(screen.getByText("Lab Portal")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Open search dialog"));
    expect(onSearch).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Launch Portal"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders TuxPortalShell with hero prop, breadcrumbs, children, and feedback callback", () => {
    const onFeedback = vi.fn();
    render(
      <TuxPortalShell
        portalTitle="Connected Corridors Initiative"
        navItems={navItems}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Telemetry" }]}
        onFeedbackClick={onFeedback}
        hero={<div>Research Portal Hero Banner</div>}
      >
        <div>Main Portal Content</div>
      </TuxPortalShell>,
    );

    expect(screen.getByText("Research Portal Hero Banner")).toBeTruthy();
    expect(screen.getByText("Main Portal Content")).toBeTruthy();
    expect(screen.getByText("Telemetry")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Feedback"));
    expect(onFeedback).toHaveBeenCalledTimes(1);
  });
});

describe("@tti/tti-ux-react standalone package & CSS bundle integrity", () => {
  const pkgRoot = path.resolve(__dirname, "../..");

  it("has zero Vue or @tti/tti-ux dependencies in package.json", () => {
    const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgRoot, "package.json"), "utf8"));
    const allDeps = {
      ...(pkgJson.dependencies ?? {}),
      ...(pkgJson.peerDependencies ?? {}),
    };
    expect(allDeps["@tti/tti-ux"]).toBeUndefined();
    expect(allDeps.vue).toBeUndefined();
    expect(allDeps.nuxt).toBeUndefined();
    expect(Object.keys(pkgJson.peerDependencies ?? {})).toEqual(["react"]);
  });

  it("copies all imported CSS files into dist/ so bundlers have zero unresolved imports", () => {
    const distDir = path.join(pkgRoot, "dist");
    expect(fs.existsSync(path.join(distDir, "styles.css"))).toBe(true);
    expect(fs.existsSync(path.join(distDir, "tux-tokens.css"))).toBe(true);

    const distCompDir = path.join(distDir, "components");
    const jsFiles = fs.readdirSync(distCompDir).filter((f) => f.endsWith(".js"));
    for (const jf of jsFiles) {
      const code = fs.readFileSync(path.join(distCompDir, jf), "utf8");
      const matches = code.matchAll(/import\s+["'](\.\/[^"']+\.css)["']/g);
      for (const m of matches) {
        const cssFile = path.resolve(distCompDir, m[1]);
        expect(fs.existsSync(cssFile)).toBe(true);
      }
    }
  });

  it("renders auto-synced React components with their declared title/label/message props", () => {
    render(<TuxAnnouncementBanner message="SH-6 Corridor Maintenance Window" />);
    expect(screen.getByText("SH-6 Corridor Maintenance Window")).toBeTruthy();
  });

  it("keeps @tti/tti-ux-elements standalone with bundled CSS tokens and no @tti/tti-ux peerDependency", () => {
    const elementsRoot = path.resolve(pkgRoot, "../elements");
    const elementsPkg = JSON.parse(fs.readFileSync(path.join(elementsRoot, "package.json"), "utf8"));
    expect(elementsPkg.peerDependencies?.["@tti/tti-ux"]).toBeUndefined();
    expect(fs.existsSync(path.join(elementsRoot, "dist", "styles.css"))).toBe(true);
    expect(fs.existsSync(path.join(elementsRoot, "dist", "tux-tokens.css"))).toBe(true);
  });
});
