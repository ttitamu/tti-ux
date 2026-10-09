/**
 * tuxEChartsTheme.ts — Theme generator for Apache ECharts using TTI/TUX design tokens.
 *
 * Maps TUX color scales (--brand-primary, --chart-1..8), typography fonts
 * (Oswald, Open Sans, JetBrains Mono), and dark/light mode surface tokens
 * into ECharts theme configurations.
 */
import type { EChartsCoreOption } from "echarts";
import {
  CVD_PALETTES,
  CVD_PALETTES_DARK,
  type TuxVisionPreferences,
} from "~/composables/useTuxVisionPrefs";

export interface EChartsThemeDefinition {
  color: string[];
  backgroundColor: string;
  textStyle: {
    fontFamily: string;
    color: string;
  };
  title: {
    textStyle: {
      fontFamily: string;
      color: string;
    };
  };
  line: {
    itemStyle: { borderWidth: number };
    lineStyle: { width: number };
    smooth: boolean;
  };
  grid: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    containLabel: boolean;
  };
  categoryAxis: {
    axisLine: { show: boolean; lineStyle: { color: string } };
    axisTick: { show: boolean; lineStyle: { color: string } };
    axisLabel: { color: string; fontFamily: string; fontSize: number };
    splitLine: { show: boolean };
  };
  valueAxis: {
    axisLine: { show: boolean };
    axisTick: { show: boolean };
    axisLabel: { color: string; fontFamily: string; fontSize: number };
    splitLine: { show: boolean; lineStyle: { color: string; type: string } };
  };
  tooltip: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    padding: number[];
    textStyle: { color: string; fontFamily: string; fontSize: number };
    extraCssText: string;
  };
}

export function createTuxEChartsTheme(
  isDark: boolean,
  prefs?: Partial<TuxVisionPreferences>,
): EChartsThemeDefinition {
  const cvdMode = prefs?.cvdMode ?? "brand";
  const palette = (isDark || prefs?.softDark)
    ? CVD_PALETTES_DARK[cvdMode]
    : CVD_PALETTES[cvdMode];

  const isSoftDark = Boolean(prefs?.softDark);
  const isHeavy = Boolean(prefs?.heavyStrokes);

  const textColor = isSoftDark ? "#E6EDF3" : isDark ? "#E6E6E6" : "#2B2B2B";
  const titleColor = isSoftDark ? "#F0F6FC" : isDark ? "#F5F5F5" : "#1A1A1A";
  const axisLineColor = isSoftDark ? "#384152" : isDark ? "#404040" : "#D1D5DB";
  const axisLabelColor = isSoftDark ? "#9DA7B5" : isDark ? "#A3A3A3" : "#4B5563";
  const splitLineColor = isSoftDark ? "#282F3D" : isDark ? "#262626" : "#E5E7EB";
  const tooltipBg = isSoftDark ? "#1F2430" : isDark ? "#171717" : "#FFFFFF";
  const tooltipBorder = isSoftDark ? "#384152" : isDark ? "#404040" : "#E5E7EB";

  return {
    color: [...palette],
    backgroundColor: "transparent",
    textStyle: {
      fontFamily: "'Open Sans', system-ui, sans-serif",
      color: textColor,
    },
    title: {
      textStyle: {
        fontFamily: "'Oswald', system-ui, sans-serif",
        color: titleColor,
      },
    },
    line: {
      itemStyle: { borderWidth: isHeavy ? 3 : 2 },
      lineStyle: { width: isHeavy ? 3.5 : 2.5 },
      smooth: true,
    },
    grid: {
      top: 40,
      right: 25,
      bottom: 45,
      left: 55,
      containLabel: true,
    },
    categoryAxis: {
      axisLine: { show: true, lineStyle: { color: axisLineColor, width: isHeavy ? 1.5 : 1 } },
      axisTick: { show: true, lineStyle: { color: axisLineColor, width: isHeavy ? 1.5 : 1 } },
      axisLabel: {
        color: axisLabelColor,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      splitLine: { show: false },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: axisLabelColor,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: splitLineColor,
          type: "dashed",
          width: isHeavy ? 1.5 : 1,
        },
      },
    },
    tooltip: {
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: isHeavy ? 1.5 : 1,
      padding: [8, 12],
      textStyle: {
        color: titleColor,
        fontFamily: "'Open Sans', sans-serif",
        fontSize: 12,
      },
      extraCssText: isSoftDark
        ? "box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45); border-radius: 6px;"
        : "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 6px;",
    },
  };
}

export function adaptOptionsForVision(
  raw: EChartsCoreOption,
  isDark: boolean,
  prefs: TuxVisionPreferences,
): EChartsCoreOption {
  if (!raw || typeof raw !== "object") return raw;
  const opt = JSON.parse(JSON.stringify(raw)) as any;
  const isCvdActive = prefs.cvdMode !== "brand";
  const activePalette = (isDark || prefs.softDark)
    ? CVD_PALETTES_DARK[prefs.cvdMode]
    : CVD_PALETTES[prefs.cvdMode];

  opt.color = [...activePalette];

  const dashTypes = ["solid", "dashed", "dotted", "dash-dot"];
  const symbols = ["circle", "rect", "triangle", "diamond", "pin", "arrow"];

  if (Array.isArray(opt.series)) {
    opt.series.forEach((s: any, sIdx: number) => {
      const seriesColor = activePalette[sIdx % activePalette.length];

      // Multi-channel redundancy: distinct markers
      if (prefs.distinctMarkers && (s.type === "line" || s.type === "scatter")) {
        if (!s.symbol || s.symbol === "circle" || s.symbol === "none" || s.symbol === "emptyCircle") {
          s.symbol = symbols[sIdx % symbols.length];
          s.showSymbol = true;
          s.symbolSize = prefs.heavyStrokes ? 10 : 8;
        }
      }

      // Multi-channel redundancy: distinct line dash patterns
      if (prefs.patterns && s.type === "line") {
        if (!s.lineStyle?.type || s.lineStyle.type === "solid") {
          s.lineStyle = {
            ...(s.lineStyle || {}),
            type: dashTypes[sIdx % dashTypes.length],
          };
        }
      }

      // Heavy strokes
      if (prefs.heavyStrokes) {
        if (s.type === "line") {
          s.lineStyle = {
            ...(s.lineStyle || {}),
            width: Math.max(3.5, (s.lineStyle?.width ?? 2.5) + 1),
          };
        } else if (s.type === "bar") {
          s.itemStyle = {
            ...(s.itemStyle || {}),
            borderWidth: Math.max(1.5, (s.itemStyle?.borderWidth ?? 0) + 1.5),
            borderColor: isDark ? "#1F2430" : "#FFFFFF",
          };
        } else if (s.type === "pie") {
          s.itemStyle = {
            ...(s.itemStyle || {}),
            borderWidth: Math.max(3, (s.itemStyle?.borderWidth ?? 1) + 2),
            borderColor: isDark ? "#1F2430" : "#FFFFFF",
          };
        }
      }

      // CVD mode palette overrides for explicit color presets
      if (isCvdActive) {
        if (s.itemStyle?.color && typeof s.itemStyle.color === "string") {
          s.itemStyle.color = seriesColor;
        }
        if (s.lineStyle?.color && typeof s.lineStyle.color === "string") {
          s.lineStyle.color = seriesColor;
        }
        if (Array.isArray(s.data)) {
          s.data.forEach((item: any, itemIdx: number) => {
            if (item && typeof item === "object" && item.itemStyle?.color) {
              item.itemStyle.color = activePalette[itemIdx % activePalette.length];
            }
          });
        }
      }
    });
  }

  // Astigmatism anti-halation soft dark adjustments
  if (prefs.softDark && isDark) {
    if (opt.tooltip && typeof opt.tooltip === "object") {
      opt.tooltip.backgroundColor = "#1F2430";
      opt.tooltip.borderColor = "#384152";
      if (!opt.tooltip.textStyle) opt.tooltip.textStyle = {};
      opt.tooltip.textStyle.color = "#E6EDF3";
    }
    if (opt.legend && typeof opt.legend === "object") {
      if (!opt.legend.textStyle) opt.legend.textStyle = {};
      opt.legend.textStyle.color = "#E6EDF3";
    }
  }

  return opt;
}
