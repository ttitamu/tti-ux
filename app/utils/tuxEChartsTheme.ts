/**
 * tuxEChartsTheme.ts — Theme generator for Apache ECharts using TTI/TUX design tokens.
 *
 * Maps TUX color scales (--brand-primary, --chart-1..8), typography fonts
 * (Oswald, Open Sans, JetBrains Mono), and dark/light mode surface tokens
 * into ECharts theme configurations.
 */

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

export function createTuxEChartsTheme(isDark: boolean): EChartsThemeDefinition {
  return {
    color: [
      isDark ? "#A02D20" : "#500000", // Maroon (Aggie Primary)
      "#005F73", // Teal (--chart-1)
      "#94D2BD", // Sage (--chart-2)
      "#E9D8A6", // Sand Amber (--chart-3)
      "#EE9B00", // Gold (--chart-4)
      "#CA6702", // Rust (--chart-5)
      "#BB3E03", // Orange (--chart-6)
      "#AE2012", // Crimson (--chart-7)
      "#2B9348", // Forest (--chart-8)
    ],
    backgroundColor: "transparent",
    textStyle: {
      fontFamily: "'Open Sans', system-ui, sans-serif",
      color: isDark ? "#E6E6E6" : "#2B2B2B",
    },
    title: {
      textStyle: {
        fontFamily: "'Oswald', system-ui, sans-serif",
        color: isDark ? "#F5F5F5" : "#1A1A1A",
      },
    },
    line: {
      itemStyle: { borderWidth: 2 },
      lineStyle: { width: 2.5 },
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
      axisLine: { show: true, lineStyle: { color: isDark ? "#404040" : "#D1D5DB" } },
      axisTick: { show: true, lineStyle: { color: isDark ? "#404040" : "#D1D5DB" } },
      axisLabel: {
        color: isDark ? "#A3A3A3" : "#4B5563",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      splitLine: { show: false },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: isDark ? "#A3A3A3" : "#4B5563",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: isDark ? "#262626" : "#E5E7EB",
          type: "dashed",
        },
      },
    },
    tooltip: {
      backgroundColor: isDark ? "#171717" : "#FFFFFF",
      borderColor: isDark ? "#404040" : "#E5E7EB",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: isDark ? "#F5F5F5" : "#1A1A1A",
        fontFamily: "'Open Sans', sans-serif",
        fontSize: 12,
      },
      extraCssText: "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 6px;",
    },
  };
}
