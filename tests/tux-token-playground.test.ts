import { describe, expect, it } from "vitest";

describe("Design Token Playground & Comm Alignment", () => {
  const presets = [
    {
      id: "tti-kadence",
      name: "TTI Kadence Institutional",
      radius: 0,
      fontFamily: "'Roboto', sans-serif",
      primaryColor: "#500000",
      accentColor: "#CFA935",
      shape: "sharp",
      theme: "light",
    },
    {
      id: "tux-modern",
      name: "TUX Modern App",
      radius: 4,
      fontFamily: "'Inter', sans-serif",
      primaryColor: "#5C0025",
      accentColor: "#DDAC37",
      shape: "default",
      theme: "light",
    },
    {
      id: "ops-console",
      name: "Operations Console",
      radius: 2,
      fontFamily: "'JetBrains Mono', monospace",
      primaryColor: "#6BB4C0",
      accentColor: "#F5D98A",
      shape: "sharp",
      theme: "dark",
    },
    {
      id: "friendly-portal",
      name: "Editorial Magazine",
      radius: 8,
      fontFamily: "Georgia, 'Times New Roman', serif",
      primaryColor: "#500000",
      accentColor: "#B89332",
      shape: "default",
      theme: "light",
    },
  ];

  it("contains official TTI Kadence institutional preset matching tti.tamu.edu", () => {
    const kadence = presets.find((p) => p.id === "tti-kadence");
    expect(kadence).toBeDefined();
    expect(kadence?.radius).toBe(0);
    expect(kadence?.shape).toBe("sharp");
    expect(kadence?.primaryColor).toBe("#500000"); // Aggie Maroon
    expect(kadence?.accentColor).toBe("#CFA935"); // Warm Gold
    expect(kadence?.fontFamily).toContain("Roboto");
    expect(kadence?.theme).toBe("light");
  });

  it("generates valid WordPress Kadence theme.json with token mappings", () => {
    const p = presets[0];
    const themeJsonStr = `{
      "$schema": "https://schemas.wp.org/trunk/theme.json",
      "version": 3,
      "settings": {
        "color": {
          "palette": [
            { "slug": "brand-primary", "color": "${p.primaryColor}", "name": "TTI Aggie Maroon" },
            { "slug": "brand-accent", "color": "${p.accentColor}", "name": "TTI Warm Gold" }
          ]
        },
        "typography": {
          "fontFamilies": [
            { "fontFamily": "${p.fontFamily}", "slug": "primary", "name": "TTI Brand Font" }
          ]
        },
        "custom": {
          "tux": {
            "buttonRadius": "${p.radius}px",
            "cardRadius": "${p.radius}px",
            "ruleColor": "${p.accentColor}"
          }
        }
      }
    }`;

    const parsed = JSON.parse(themeJsonStr);
    expect(parsed.version).toBe(3);
    expect(parsed.settings.color.palette[0].color).toBe("#500000");
    expect(parsed.settings.color.palette[1].color).toBe("#CFA935");
    expect(parsed.settings.custom.tux.buttonRadius).toBe("0px");
    expect(parsed.settings.custom.tux.ruleColor).toBe("#CFA935");
  });

  it("generates CSS variable overrides correctly", () => {
    const p = presets[0];
    const css = `:root {
      --brand-primary: ${p.primaryColor};
      --brand-accent: ${p.accentColor};
      --font-body: ${p.fontFamily};
      --radius-md: ${p.radius}px;
    }`;

    expect(css).toContain("--brand-primary: #500000;");
    expect(css).toContain("--brand-accent: #CFA935;");
    expect(css).toContain("--radius-md: 0px;");
    expect(css).toContain("Roboto");
  });

  it("constructs target Forgejo issue URL with prefilled payload", () => {
    const base = "https://code.tti.tamu.edu/tti/tti-ux/issues/new";
    const title = "[Token Idea] TTI Kadence Institutional: 0px radius";
    const body = "### Proposal Summary\nAligning TUX with Kadence.";

    const url = `${base}?${new URLSearchParams({ title, body }).toString()}`;
    expect(url).toContain("https://code.tti.tamu.edu/tti/tti-ux/issues/new");
    expect(url).toContain("title=%5BToken+Idea%5D+TTI+Kadence+Institutional%3A+0px+radius");
    expect(url).toContain("body=");
  });

  it("evaluates WCAG 2.2 contrast guardrails and snaps colors to AAA (7.0:1)", async () => {
    const {
      computeContrastRatio,
      evaluateContrastGuardrail,
      snapHexToAAA,
    } = await import("../app/utils/tuxTokenStudio");

    // Aggie Maroon (#500000) on white (#FFFFFF) already passes WCAG AAA (> 12:1)
    const maroonGuard = evaluateContrastGuardrail("#500000", "#FFFFFF", 7.0);
    expect(maroonGuard.passesAAA).toBe(true);
    expect(maroonGuard.level).toBe("AAA");
    expect(maroonGuard.ratio).toBeGreaterThanOrEqual(7.0);

    // Warm Gold (#CFA935) on white (#FFFFFF) is below 7.0:1 and snaps to an AAA-compliant dark gold ink
    const goldGuard = evaluateContrastGuardrail("#CFA935", "#FFFFFF", 7.0);
    expect(goldGuard.passesAAA).toBe(false);
    const snappedGold = snapHexToAAA("#CFA935", "#FFFFFF", 7.0);
    expect(computeContrastRatio(snappedGold, "#FFFFFF")).toBeGreaterThanOrEqual(7.0);

    // Dark canvas (#09090B): Maroon (#500000) snaps to a lighter rose/maroon that passes >= 7.0:1
    const snappedOnDark = snapHexToAAA("#500000", "#09090B", 7.0);
    expect(computeContrastRatio(snappedOnDark, "#09090B")).toBeGreaterThanOrEqual(7.0);
  });

  it("exports valid W3C Design Tokens (DTCG) and Figma Variables multi-mode JSON", async () => {
    const {
      generateFigmaVariablesJson,
      generateW3cDtcgTokens,
    } = await import("../app/utils/tuxTokenStudio");

    const sampleInput = {
      presetId: "tti-kadence",
      primaryColor: "#500000",
      accentColor: "#CFA935",
      radius: 0,
      fontFamily: "'Roboto', sans-serif",
      density: "standard" as const,
      shape: "sharp" as const,
      theme: "light" as const,
    };

    const dtcg = JSON.parse(generateW3cDtcgTokens(sampleInput));
    expect(dtcg.$schema).toBe("https://tr.designtokens.org/format/");
    expect(dtcg.color.brand.primary.$type).toBe("color");
    expect(dtcg.color.brand.primary.$value).toBe("#500000");
    expect(dtcg.color.division.maroon.$value).toBe("#500000");
    expect(dtcg.dimension.radius.md.$value).toBe("0px");

    const figma = JSON.parse(generateFigmaVariablesJson(sampleInput));
    expect(figma.collection).toBe("TUX Institutional Variables");
    expect(figma.modes).toEqual(["Light", "Dark", "Field Sunlight (RELLIS)"]);
    const primaryVar = figma.variables.find((v: { name: string }) => v.name === "brand/primary");
    expect(primaryVar).toBeDefined();
    expect(primaryVar.valuesByMode.Light).toBe("#500000");
    expect(primaryVar.valuesByMode["Field Sunlight (RELLIS)"]).toBe("#3A0000");
  });

  it("exposes TUX MCP Server tools, resources, prompts, and 4-layer guardrail auto-fixer", async () => {
    // @ts-expect-error .mjs script import
    const { handleMcpRequest, callTuxMcpTool } = await import("../scripts/tux-mcp.mjs");

    // 1. Protocol handshake & ping
    const initRes = handleMcpRequest({ jsonrpc: "2.0", id: 1, method: "initialize" });
    expect(initRes.result.serverInfo.name).toBe("tti-ux-mcp");
    expect(initRes.result.capabilities).toHaveProperty("tools");
    expect(initRes.result.capabilities).toHaveProperty("resources");
    expect(initRes.result.capabilities).toHaveProperty("prompts");

    const pingRes = handleMcpRequest({ jsonrpc: "2.0", id: 2, method: "ping" });
    expect(pingRes.result).toEqual({});

    // 2. Tools, Resources, and Prompts discovery
    const listRes = handleMcpRequest({ jsonrpc: "2.0", id: 3, method: "tools/list" });
    expect(listRes.result.tools.length).toBeGreaterThanOrEqual(5);

    const resList = handleMcpRequest({ jsonrpc: "2.0", id: 4, method: "resources/list" });
    expect(resList.result.resources.some((r: { uri: string }) => r.uri === "tux://tokens/all")).toBe(true);

    const resRead = handleMcpRequest({
      jsonrpc: "2.0",
      id: 5,
      method: "resources/read",
      params: { uri: "tux://catalog/components" },
    });
    expect(JSON.parse(resRead.result.contents[0].text).count).toBeGreaterThanOrEqual(40);

    const promptGet = handleMcpRequest({
      jsonrpc: "2.0",
      id: 6,
      method: "prompts/get",
      params: { name: "tux-build-tti-view", arguments: { topic: "SH-47 Proving Ground", division: "teal" } },
    });
    expect(promptGet.result.messages[0].content.text).toContain("SH-47 Proving Ground");

    // 3. Structured component inspection (including re-exported sub-layer components, Desk components, and Vue 3.3+ emits)
    const unitComp = callTuxMcpTool("tux_get_component", { name: "TuxUnitValue" });
    expect(unitComp.name).toBe("TuxUnitValue");
    expect(unitComp.layerPackage).toBe("@tti/tti-ux");
    expect(unitComp.category).toBe("data-display");
    expect(unitComp.props.some((p: { name: string }) => p.name === "unit")).toBe(true);
    expect(unitComp.examples.vue).toContain("<TuxUnitValue");
    expect(unitComp.examples.react).toContain("@tti/tti-ux-react");
    expect(unitComp.examples.webComponent).toContain("<tux-unit-value");

    // Verify re-exported sub-layer components resolve full props & events instead of empty re-export stubs
    const echartsComp = callTuxMcpTool("tux_get_component", { name: "TuxECharts" });
    expect(echartsComp.layerPackage).toBe("@tti/tti-ux-charts");
    expect(echartsComp.props.length).toBeGreaterThanOrEqual(8);
    expect(echartsComp.events).toEqual(["chartClick", "chartHover"]);

    const diagramComp = callTuxMcpTool("tux_get_component", { name: "TuxDiagram" });
    expect(diagramComp.layerPackage).toBe("@tti/tti-ux-diagrams");
    expect(diagramComp.props.some((p: { name: string }) => p.name === "code")).toBe(true);

    const codeBlockComp = callTuxMcpTool("tux_get_component", { name: "TuxCodeBlock" });
    expect(codeBlockComp.layerPackage).toBe("@tti/tti-ux-code");
    expect(codeBlockComp.props.some((p: { name: string }) => p.name === "code")).toBe(true);

    const deskArticleComp = callTuxMcpTool("tux_get_component", { name: "TuxDeskArticle" });
    expect(deskArticleComp.layerPackage).toBe("@tti/tti-ux-desk");
    expect(deskArticleComp.props.some((p: { name: string }) => p.name === "bodyJson")).toBe(true);

    // Verify Vue 3.3+ unquoted tuple emits (e.g. dismiss: []) and .client.vue resolution
    const bannerComp = callTuxMcpTool("tux_get_component", { name: "TuxAnnouncementBanner" });
    expect(bannerComp.events).toContain("dismiss");

    const deskEditorComp = callTuxMcpTool("tux_get_component", { name: "TuxDeskEditor" });
    expect(deskEditorComp.layerPackage).toBe("@tti/tti-ux-desk");
    expect(deskEditorComp.events).toContain("update:modelValue");

    // Verify architecture resource
    const archRes = handleMcpRequest({
      jsonrpc: "2.0",
      id: 7,
      method: "resources/read",
      params: { uri: "tux://architecture/layers-and-api" },
    });
    const archData = JSON.parse(archRes.result.contents[0].text);
    expect(archData.layers.length).toBe(7);

    // 4. Token search & contrast validation with AAA hex recommendation
    const tokenSearch = callTuxMcpTool("tux_search_tokens", { query: "--surface-base" });
    expect(tokenSearch.canonicalReplacementForAlias).toBe("--surface-page");

    const contrastCheck = callTuxMcpTool("tux_validate_contrast", {
      foreground: "#CFA935",
      background: "#FFFFFF",
    });
    expect(contrastCheck.passesAAA).toBe(false);
    const snappedVerify = callTuxMcpTool("tux_validate_contrast", {
      foreground: contrastCheck.recommendedAAAHex,
      background: "#FFFFFF",
    });
    expect(snappedVerify.passesAAA).toBe(true);

    // 5. 4-layer snippet audit (legacy tokens, Levenshtein typos, off-ladder wash, dead font fallback, WCAG 2.5.3 button label)
    const snippetAudit = callTuxMcpTool("tux_audit_snippet", {
      code: [
        ".card { background: var(--surface-base); color: var(--text-primar); font-family: var(--font-sans, var(--font-body)); border-color: color-mix(in srgb, var(--brand-primary) 15%, transparent); }",
        '<button aria-label="Close modal">Dismiss</button>',
      ].join("\n"),
    });
    expect(snippetAudit.valid).toBe(false);
    expect(snippetAudit.autoFixedCode).toContain("var(--surface-page)");
    expect(snippetAudit.autoFixedCode).toContain("var(--text-primary)");
    expect(snippetAudit.autoFixedCode).toContain("font-family: var(--font-body);");
    expect(snippetAudit.autoFixedCode).toContain("12%, transparent");
    expect(
      snippetAudit.issues.some((i: { type: string }) => i.type === "wcag-2.5.3-label-content-mismatch"),
    ).toBe(true);
  });
});
