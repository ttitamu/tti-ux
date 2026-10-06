/**
 * tuxEChartsGallery.ts — Comprehensive ECharts storytelling presets for TTI-UX 3.0.
 *
 * Implements 32 institutional, transportation-research-grade visualizations:
 * 1. basicPieRose — Modal Split & Fleet Transition (Nightingale Rose / Pie)
 * 2. parliament — Legislative Appropriations Committee Seating Layout
 * 3. survey — 5-Point Likert Diverging Stacked Bar (Public Opinion on AVs & Tolling)
 * 4. basicBar — Multi-Year Corridor Freight Tonnage Comparison
 * 5. polarBar — 24-Hour Diurnal Traffic Volume Cycle (Radial Polar Bar)
 * 6. particleFlow — Connected Autonomous Corridor Trajectory Flow
 * 7. customShape — Bridge Girder Deflection & Structural Strain Profile
 * 8. choroplethAlbers — US Freight Density & Texas Crash Rate (Albers Projection)
 * 9. racingBar — Top 10 Most Congested Texas Corridors (2015–2026 Racing Bar)
 * 10. racingLine — Multi-Stream Connected Vehicle Telemetry (Speed, Throttle, Brake, Latency)
 * 11. treemap — TTI Research Portfolio Drilldown ($85.4M Sponsored Research)
 * 12. circlePacking — Hierarchical Safety Risk Cluster Mapping
 * 13. sunburst — Multimodal Fleet Electrification Hierarchy (Mode -> Fuel -> Class)
 * 14. calendarEffectScatter — 365-Day Incident Heatmap with Pulsing Storm Alerts
 * 15. gaugeCluster — Vehicle Telemetry Instrument Cluster (Speedometer, Tire PSI, LOS)
 * 16. wordCloud — Commuter Experience Qualitative Survey Sentiment
 * 17. liquidFill — State Highway Trust Fund Dedicated Liquidity Reserve
 * 18. sankey — Texas State Highway Fund Dedicated Allocation & Investment Flows
 * 19. heatmapCongestion — Austin I-35 Central Corridor 24/7 Diurnal Congestion Matrix
 * 20. radarAlternatives — High-Capacity Transit Alternatives Multi-Criteria Evaluation
 * 21. boxplotReliability — Texas Commercial Freight Corridors Travel Time Index Reliability
 * 22. borderGateways — Texas International Commercial Ports of Entry Throughput & Queue
 * 23. parallelTelemetry — Connected Autonomous Vehicle Multi-Axis CAN-Bus Sensor Telemetry
 * 24. graphAviation — Texas Commercial Air Cargo Logistics & Inter-Hub Aviation Network
 * 25. candlestickToll — Managed Express Lanes Dynamic Congestion Toll Rate Volatility
 * 26. gulfMaritime — Texas Deep-Water Ports Annual Cargo Tonnage & Maritime Logistics
 * 27. bridgeDeterioration — National Bridge Inventory Structural Deck Rating 75-Year Lifecycle
 * 28. drilldownMorph — TxDOT Unified Transportation Program Statewide-to-Project Drilldown
 * 29. timespaceShockwave — Freeway Corridor Vehicle Trajectory Time-Space Diagram & Shockwave Propagation
 * 30. fundamentalDiagram — Macroscopic Traffic Flow: Speed-Flow-Density Fundamental Equilibrium Curves
 * 31. carbonEmissions — Texas Multimodal Transportation GHG Emissions & Decarbonization Roadmap
 * 32. transitEquity — Demographic Transit Equity Disparity: Vehicle Ownership vs Transit Walkshed
 */

import type { EChartsCoreOption } from "echarts";

export interface GalleryPreset {
  id: string;
  title: string;
  category: "executive" | "realtime" | "hierarchical" | "spatial" | "custom";
  categoryLabel: string;
  eyebrow: string;
  subtitle: string;
  source: string;
  story: string;
  height?: string;
  ariaTitle: string;
  ariaSummary: string;
  getOption: (isDark: boolean) => EChartsCoreOption;
  isAnimated?: boolean;
}

// Color helpers for dark/light adaptation
const TUX_COLORS = {
  maroon: "#500000",
  maroonLight: "#7A1C1C",
  teal: "#005F73",
  tealLight: "#0A9396",
  sage: "#94D2BD",
  sand: "#E9D8A6",
  gold: "#EE9B00",
  rust: "#CA6702",
  orange: "#BB3E03",
  crimson: "#AE2012",
  forest: "#2B9348",
  slate: "#4B5563",
};

export const GALLERY_PRESETS: GalleryPreset[] = [
  // 1. BASIC PIE / NIGHTINGALE ROSE
  {
    id: "pie-rose",
    title: "Urban Commute Modal Split & Transit Adoption",
    category: "hierarchical",
    categoryLabel: "Hierarchical & Composition",
    eyebrow: "EXHIBIT 2.1 · MULTIMODAL PLANNING",
    subtitle: "Daily passenger trip share across Texas metropolitan statistical areas (MSAs)",
    source: "TTI Statewide Mobility Survey · 2026 Passenger Analytics",
    story: "Nightingale rose chart visualizing commute choices. Segment radius highlights average trip length (miles) while petal angle reflects total passenger trip volume, illustrating rapid growth in micro-mobility and express commuter bus routes.",
    height: "440px",
    ariaTitle: "Urban commute modal split rose chart",
    ariaSummary: "Single-occupancy vehicles account for 62% of trips (avg 18.4 miles), followed by express bus transit at 14% (12.2 miles), carpooling at 11% (16.1 miles), active cycling/walking at 8% (2.4 miles), and micro-mobility at 5% (3.1 miles).",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}% of daily trips ({d}% total weight)",
      },
      legend: {
        bottom: "2%",
        left: "center",
        textStyle: { fontFamily: "'Open Sans', sans-serif" },
      },
      series: [
        {
          name: "Commute Modal Split",
          type: "pie",
          radius: ["18%", "72%"],
          center: ["50%", "48%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 6,
            borderColor: isDark ? "#171717" : "#FFFFFF",
            borderWidth: 2,
          },
          label: {
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            formatter: "{b}\n{c}%",
          },
          data: [
            { value: 62, name: "Single Occupancy Vehicle", itemStyle: { color: isDark ? "#A02D20" : "#500000" } },
            { value: 14, name: "Express Bus Transit", itemStyle: { color: "#005F73" } },
            { value: 11, name: "Carpool & Vanpool", itemStyle: { color: "#0A9396" } },
            { value: 8, name: "Walking & Cycling", itemStyle: { color: "#94D2BD" } },
            { value: 5, name: "Micro-Mobility / Shuttles", itemStyle: { color: "#EE9B00" } },
          ],
        },
      ],
    }),
  },

  // 2. PARLIAMENT / LEGISLATIVE COMMITTEE SEATING
  {
    id: "parliament",
    title: "Legislative Appropriations & Transportation Commission Representation",
    category: "executive",
    categoryLabel: "Executive & Policy",
    eyebrow: "EXHIBIT 2.2 · INSTITUTIONAL GOVERNANCE",
    subtitle: "Biennial state funding allocation oversight committee seat distribution",
    source: "Texas House & Senate Joint Committee on Transportation Allocations · 89th Legislature",
    story: "Semicircular parliament seating breakdown illustrating oversight delegations across highway capacity, multimodal transit, safety modernization, and rural corridor preservation.",
    height: "400px",
    ariaTitle: "Legislative Transportation Appropriations Committee parliament seating chart",
    ariaSummary: "Total 45 committee delegates: 18 Highway & Freight Modernization, 11 Urban Multimodal Transit, 8 Rural Connectivity, 5 Traffic Safety & Vision Zero, and 3 Autonomous Proving Ground Innovation.",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} Delegates ({d}%)",
      },
      legend: {
        bottom: "0%",
        left: "center",
        textStyle: { fontFamily: "'Open Sans', sans-serif" },
      },
      series: [
        {
          name: "Delegation Seats",
          type: "pie",
          radius: ["42%", "85%"],
          center: ["50%", "78%"],
          startAngle: 180,
          endAngle: 360,
          itemStyle: {
            borderRadius: 4,
            borderColor: isDark ? "#171717" : "#FFFFFF",
            borderWidth: 2,
          },
          label: {
            show: true,
            fontFamily: "'JetBrains Mono', monospace",
            formatter: "{b}: {c}",
          },
          data: [
            { value: 18, name: "Highway & Freight", itemStyle: { color: isDark ? "#A02D20" : "#500000" } },
            { value: 11, name: "Urban Multimodal", itemStyle: { color: "#005F73" } },
            { value: 8, name: "Rural Connectivity", itemStyle: { color: "#94D2BD" } },
            { value: 5, name: "Safety & Vision Zero", itemStyle: { color: "#EE9B00" } },
            { value: 3, name: "Connected Tech", itemStyle: { color: "#CA6702" } },
          ],
        },
      ],
    }),
  },

  // 3. SURVEY LIKERT DIVERGING STACKED BAR
  {
    id: "survey-likert",
    title: "Public Sentiment on Emerging Transportation Initiatives",
    category: "executive",
    categoryLabel: "Executive & Policy",
    eyebrow: "EXHIBIT 2.3 · SURVEY & PUBLIC POLICY",
    subtitle: "5-point Likert scale divergence across 8,400 surveyed Texas commuters",
    source: "TTI Transportation Policy Research Center · Annual Public Opinion Study",
    story: "Diverging stacked bar chart centered on the neutral baseline. Negative sentiment (Strongly Disagree, Disagree) extends to the left, while positive endorsement (Agree, Strongly Agree) extends to the right, enabling rapid visual comparison of controversial vs. broadly supported programs.",
    height: "420px",
    ariaTitle: "Survey Likert diverging stacked bar chart",
    ariaSummary: "Dedicated autonomous freight lanes received 68% support and 16% opposition. Dynamic HOV congestion pricing received 44% support and 42% opposition. Statewide high-speed passenger rail received 74% support and 12% opposition.",
    getOption: (isDark) => {
      const categories = [
        "Autonomous Freight Corridors",
        "Dynamic HOV Congestion Pricing",
        "High-Speed Passenger Rail",
        "Curbside Micro-Mobility Zones",
        "Connected Signal Preemption",
      ];
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params: any) => {
            let res = `<strong style="font-family:var(--font-display)">${params[0].name}</strong><br/>`;
            params.forEach((p: any) => {
              res += `${p.marker} ${p.seriesName}: ${Math.abs(p.value)}%<br/>`;
            });
            return res;
          },
        },
        legend: {
          top: "2%",
          data: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
          textStyle: { fontFamily: "'Open Sans', sans-serif" },
        },
        grid: { left: "28%", right: "8%", top: "16%", bottom: "8%" },
        xAxis: {
          type: "value",
          min: -60,
          max: 80,
          axisLabel: {
            formatter: (v: number) => `${Math.abs(v)}%`,
            fontFamily: "'JetBrains Mono', monospace",
          },
        },
        yAxis: {
          type: "category",
          data: categories,
          axisTick: { show: false },
          axisLabel: { fontFamily: "'Open Sans', sans-serif", fontWeight: "bold" },
        },
        series: [
          {
            name: "Strongly Disagree",
            type: "bar",
            stack: "total",
            itemStyle: { color: "#AE2012" },
            data: [-8, -22, -5, -12, -4],
          },
          {
            name: "Disagree",
            type: "bar",
            stack: "total",
            itemStyle: { color: "#BB3E03" },
            data: [-8, -20, -7, -14, -6],
          },
          {
            name: "Neutral",
            type: "bar",
            stack: "total",
            itemStyle: { color: isDark ? "#525252" : "#9CA3AF" },
            data: [16, 14, 14, 18, 22],
          },
          {
            name: "Agree",
            type: "bar",
            stack: "total",
            itemStyle: { color: "#0A9396" },
            data: [38, 26, 32, 34, 42],
          },
          {
            name: "Strongly Agree",
            type: "bar",
            stack: "total",
            itemStyle: { color: isDark ? "#A02D20" : "#500000" },
            data: [30, 18, 42, 22, 26],
          },
        ],
      };
    },
  },

  // 4. POLAR BAR / 24-HOUR DIURNAL FLOW
  {
    id: "polar-bar",
    title: "24-Hour Diurnal Traffic Volume Cycle on Texas Urban Loops",
    category: "spatial",
    categoryLabel: "Spatial & Temporal",
    eyebrow: "EXHIBIT 2.4 · TRAFFIC OPERATIONS",
    subtitle: "Hourly vehicle throughput distribution (00:00 to 23:00) on Houston I-610 Loop",
    source: "TTI Mobility Analysis Database · Automated Traffic Recorder Stations",
    story: "Polar bar chart illustrating the 24-hour diurnal heartbeat of urban congestion. The dual tidal surges of the 07:00–09:00 AM inbound peak and the 16:00–19:00 PM outbound peak emerge clearly as radial wings.",
    height: "460px",
    ariaTitle: "24-hour diurnal traffic volume polar bar chart",
    ariaSummary: "Traffic volume peaks at 8:00 AM (14,200 veh/hr) and 5:00 PM (15,800 veh/hr), with overnight troughs dipping to 1,200 veh/hr at 3:00 AM.",
    getOption: (isDark) => {
      const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
      const volumes = [
        1800, 1400, 1200, 1100, 1900, 4800, 9200, 13800, 14200, 11400, 9800, 10400,
        11200, 10800, 11600, 13900, 15800, 15400, 13200, 9800, 7200, 5400, 3900, 2600,
      ];
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: "{b}: {c} vehicles / hour",
        },
        polar: { radius: [30, "75%"] },
        angleAxis: {
          type: "category",
          data: hours,
          boundaryGap: false,
          splitLine: { show: true, lineStyle: { color: isDark ? "#333" : "#E5E7EB" } },
          axisLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10 },
        },
        radiusAxis: {
          min: 0,
          max: 18000,
          splitLine: { lineStyle: { color: isDark ? "#222" : "#F3F4F6" } },
          axisLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10 },
        },
        series: [
          {
            type: "bar",
            coordinateSystem: "polar",
            name: "Hourly Volume",
            data: volumes.map((v, i) => ({
              value: v,
              itemStyle: {
                color: (i >= 7 && i <= 9) || (i >= 16 && i <= 18)
                  ? (isDark ? "#A02D20" : "#500000")
                  : "#005F73",
              },
            })),
            itemStyle: { borderRadius: 3 },
          },
        ],
      };
    },
  },

  // 5. PARTICLE FLOW / V2X TRAJECTORIES
  {
    id: "particle-flow",
    title: "Connected Vehicle Trajectory Stream Simulation",
    category: "realtime",
    categoryLabel: "Real-Time & Racing",
    eyebrow: "EXHIBIT 2.5 · CONNECTED & AUTOMATED TRANSPORTATION",
    subtitle: "Simulated multi-vehicle cooperative platoon trajectories through signalized interchange",
    source: "TTI Proving Grounds · V2X Telemetry Lab at RELLIS",
    story: "Animated particle trajectory stream showing connected vehicle platoons passing through an adaptive smart signal. Trailing motion ribbons convey acceleration, deceleration, and lane-selection dynamics in real-time.",
    height: "420px",
    isAnimated: true,
    ariaTitle: "Connected vehicle trajectory particle flow chart",
    ariaSummary: "Four distinct vehicle flow streams converge into an arterial corridor with adaptive signal preemption, demonstrating smooth laminar flow without stop-and-go shockwaves.",
    getOption: (isDark) => {
      // Highway Corridor Geometry (Y-axis 0-100 represents cross-section; X-axis 0-100 represents longitudinal distance)
      // Barrier: 88-94 | Managed: 72-86 | GP1: 58-72 | GP2: 44-58 | GP3: 30-44 | Shoulder: 20-30 | Foreslope: 10-20 | Ditch: 5-10 | Backslope: 0-5
      const managedStream = [
        { coords: [[2, 79], [25, 79], [50, 80], [75, 79], [98, 79]] },
      ];
      const gp1Stream = [
        { coords: [[2, 65], [25, 65], [50, 65], [75, 65], [98, 65]] },
      ];
      const gp2Stream = [
        { coords: [[2, 51], [25, 51], [48, 51], [72, 51], [98, 51]] },
      ];
      const gp3Stream = [
        { coords: [[2, 37], [25, 37], [50, 37], [75, 37], [98, 37]] },
      ];

      return {
        backgroundColor: isDark ? "#0A0A0C" : "#F8FAFC",
        tooltip: {
          trigger: "item",
          formatter: (params: any) => {
            if (params.data?.name) return `<strong>${params.data.name}</strong>`;
            return "";
          },
        },
        xAxis: { min: 0, max: 100, show: false },
        yAxis: { min: 0, max: 100, show: false },
        grid: { left: 16, right: 16, top: 16, bottom: 16, containLabel: true },
        series: [
          // Roadbed & Embankment Cross-Section Strata via Cartesian MarkArea
          {
            type: "line",
            data: [],
            markArea: {
              silent: false,
              data: [
                // 1. Median Barrier
                [
                  { name: "Median SSCB Concrete Barrier (42\")", yAxis: 88, itemStyle: { color: isDark ? "#4B5563" : "#9CA3AF" }, label: { show: true, position: "insideLeft", color: isDark ? "#F3F4F6" : "#1F2937", fontStyle: "normal", fontWeight: "bold", fontSize: 10, offset: [12, 0] } },
                  { yAxis: 94 },
                ],
                // 2. Managed Express HOT Lane
                [
                  { name: "TEXpress Managed (HOT Lane · 68 MPH)", yAxis: 72, itemStyle: { color: isDark ? "#1F1D1A" : "#FEF3C7" }, label: { show: true, position: "insideLeft", color: isDark ? "#F59E0B" : "#B45309", fontWeight: "bold", fontSize: 10, offset: [12, 0] } },
                  { yAxis: 86 },
                ],
                // 3. GP Lane 1 (Fast)
                [
                  { name: "General Purpose 1 (Fast · 58 MPH)", yAxis: 58, itemStyle: { color: isDark ? "#18181B" : "#F1F5F9" }, label: { show: true, position: "insideLeft", color: isDark ? "#93C5FD" : "#1D4ED8", fontWeight: "bold", fontSize: 10, offset: [12, 0] } },
                  { yAxis: 72 },
                ],
                // 4. GP Lane 2 (Middle)
                [
                  { name: "General Purpose 2 (Mid · 51 MPH)", yAxis: 44, itemStyle: { color: isDark ? "#141416" : "#E2E8F0" }, label: { show: true, position: "insideLeft", color: isDark ? "#93C5FD" : "#1D4ED8", fontWeight: "bold", fontSize: 10, offset: [12, 0] } },
                  { yAxis: 58 },
                ],
                // 5. GP Lane 3 (Slow / Freight)
                [
                  { name: "General Purpose 3 (Freight · 42 MPH)", yAxis: 30, itemStyle: { color: isDark ? "#18181B" : "#F1F5F9" }, label: { show: true, position: "insideLeft", color: isDark ? "#93C5FD" : "#1D4ED8", fontWeight: "bold", fontSize: 10, offset: [12, 0] } },
                  { yAxis: 44 },
                ],
                // 6. Outside Paved Shoulder (10')
                [
                  { name: "10' Paved Outside Shoulder (Rumble Strip)", yAxis: 20, itemStyle: { color: isDark ? "#27272A" : "#CBD5E1" }, label: { show: true, position: "insideLeft", color: isDark ? "#E5E7EB" : "#334155", fontWeight: "bold", fontSize: 9, offset: [12, 0] } },
                  { yAxis: 30 },
                ],
                // 7. Embankment 4:1 Foreslope
                [
                  { name: "4:1 Recoverable Embankment Foreslope", yAxis: 10, itemStyle: { color: isDark ? "#233816" : "#4D7C0F" }, label: { show: true, position: "insideLeft", color: "#FEF08A", fontWeight: "bold", fontSize: 9, offset: [12, 0] } },
                  { yAxis: 20 },
                ],
                // 8. Drainage Swale Channel Invert
                [
                  { name: "Drainage Swale Invert (-4.5')", yAxis: 5, itemStyle: { color: isDark ? "#064E3B" : "#059669" }, label: { show: true, position: "insideLeft", color: "#67E8F9", fontWeight: "bold", fontSize: 9, offset: [12, 0] } },
                  { yAxis: 10 },
                ],
                // 9. Backslope to ROW
                [
                  { name: "3:1 Backslope to TxDOT R.O.W. Limit", yAxis: 0, itemStyle: { color: isDark ? "#1C3312" : "#365314" }, label: { show: true, position: "insideLeft", color: "#FEF08A", fontWeight: "bold", fontSize: 9, offset: [12, 0] } },
                  { yAxis: 5 },
                ],
              ],
            },
          },

          // Lane Striping (White Dashed and Solid Lines)
          {
            type: "lines",
            coordinateSystem: "cartesian2d",
            polyline: true,
            data: [
              { coords: [[0, 86], [100, 86]] }, // Yellow inside edge line
            ],
            lineStyle: { color: "#FBBF24", width: 3, opacity: 0.95 },
          },
          {
            type: "lines",
            coordinateSystem: "cartesian2d",
            polyline: true,
            data: [
              { coords: [[0, 72], [100, 72]] }, // Managed lane buffer
              { coords: [[0, 58], [100, 58]] }, // GP 1-2 divider
              { coords: [[0, 44], [100, 44]] }, // GP 2-3 divider
            ],
            lineStyle: {
              color: "#FFFFFF",
              width: 2,
              type: "dashed",
              dashOffset: 4,
              opacity: 0.8,
            },
          },
          {
            type: "lines",
            coordinateSystem: "cartesian2d",
            polyline: true,
            data: [
              { coords: [[0, 30], [100, 30]] }, // Fog line outside edge
            ],
            lineStyle: { color: "#FFFFFF", width: 3, opacity: 0.95 },
          },

          // Vehicle Particle Stream 1: Managed Express Lane (Amber CAVs)
          {
            type: "lines",
            coordinateSystem: "cartesian2d",
            polyline: true,
            data: managedStream,
            effect: {
              show: true,
              period: 2.6,
              trailLength: 0.5,
              symbol: "rect",
              symbolSize: [14, 7],
              color: "#F59E0B",
            },
            lineStyle: { color: "transparent", width: 0 },
          },

          // Vehicle Particle Stream 2: GP Fast Lane (High Speed Platoons)
          {
            type: "lines",
            coordinateSystem: "cartesian2d",
            polyline: true,
            data: gp1Stream,
            effect: {
              show: true,
              period: 3.2,
              trailLength: 0.45,
              symbol: "roundRect",
              symbolSize: [12, 6],
              color: "#60A5FA",
            },
            lineStyle: { color: "transparent", width: 0 },
          },

          // Vehicle Particle Stream 3: GP Middle Lane
          {
            type: "lines",
            coordinateSystem: "cartesian2d",
            polyline: true,
            data: gp2Stream,
            effect: {
              show: true,
              period: 3.8,
              trailLength: 0.45,
              symbol: "roundRect",
              symbolSize: [12, 6],
              color: "#93C5FD",
            },
            lineStyle: { color: "transparent", width: 0 },
          },

          // Vehicle Particle Stream 4: GP Slow Lane (Commercial Freight Trucks)
          {
            type: "lines",
            coordinateSystem: "cartesian2d",
            polyline: true,
            data: gp3Stream,
            effect: {
              show: true,
              period: 4.6,
              trailLength: 0.6,
              symbol: "rect",
              symbolSize: [20, 8],
              color: "#E2E8F0",
            },
            lineStyle: { color: "transparent", width: 0 },
          },
        ],
      };
    },
  },

  // 6. DYNAMIC RACING BAR CHART (TEXAS CONGESTION RANKINGS)
  {
    id: "racing-bar",
    title: "Texas Top Urban Corridors Congestion Race (2015–2026)",
    category: "realtime",
    categoryLabel: "Real-Time & Racing",
    eyebrow: "EXHIBIT 2.6 · 100 MOST CONGESTED ROADWAYS",
    subtitle: "Annual delay ranking race: hours of commuter delay per mile (Annual time step)",
    source: "TTI Texas Most Congested Roadways Annual Series (TxDOT Sponsored)",
    story: "Dynamic racing bar chart tracking the fierce competition among Texas's most bottlenecked freeways over the last decade. Watch Austin's I-35 and Houston's I-610 West Loop swap leadership as major interchange reconstructions take place.",
    height: "460px",
    isAnimated: true,
    ariaTitle: "Top 7 congested Texas corridors racing bar chart",
    ariaSummary: "I-35 Central Austin leads in 2026 with 1,280k hours of delay per mile, followed by I-610 West Loop Houston (1,190k), US 59 Houston (980k), Woodall Rodgers Dallas (870k), and I-35W Fort Worth (760k).",
    getOption: (isDark) => {
      const corridors = [
        "I-35 Central (Austin)",
        "I-610 West Loop (Houston)",
        "US-59 / I-69 (Houston)",
        "Woodall Rodgers (Dallas)",
        "I-35W (Fort Worth)",
        "I-10 Katy (Houston)",
        "I-35 Downtown (San Antonio)",
      ];
      // 2026 current delay index (thousands of hours / mile)
      const data2026 = [1280, 1190, 980, 870, 760, 690, 610];
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: "{b}: {c}k hrs annual delay / mile",
        },
        grid: { left: "32%", right: "12%", top: "8%", bottom: "10%" },
        xAxis: {
          type: "value",
          name: "Annual Delay (k hrs/mi)",
          axisLabel: { fontFamily: "'JetBrains Mono', monospace" },
        },
        yAxis: {
          type: "category",
          data: corridors,
          inverse: true,
          axisLabel: { fontFamily: "'Open Sans', sans-serif", fontWeight: "bold" },
          animationDuration: 300,
          animationDurationUpdate: 300,
        },
        series: [
          {
            realtimeSort: true,
            name: "Annual Delay",
            type: "bar",
            data: data2026.map((val, idx) => ({
              value: val,
              itemStyle: {
                color: idx === 0
                  ? (isDark ? "#A02D20" : "#500000")
                  : idx === 1
                  ? "#005F73"
                  : "#0A9396",
                borderRadius: [0, 4, 4, 0],
              },
            })),
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
              fontFamily: "'JetBrains Mono', monospace",
              formatter: "{c}k",
            },
          },
        ],
        graphic: [
          {
            type: "text",
            right: 40,
            bottom: 40,
            style: {
              text: "2026",
              font: "bold 56px 'Oswald', sans-serif",
              fill: isDark ? "rgba(255,255,255,0.12)" : "rgba(80,0,0,0.08)",
            },
          },
        ],
      };
    },
  },

  // 7. ZOOMABLE TREEMAP (TTI RESEARCH PORTFOLIO)
  {
    id: "treemap",
    title: "TTI Sponsored Research Contract Portfolio ($85.4M)",
    category: "executive",
    categoryLabel: "Executive & Policy",
    eyebrow: "EXHIBIT 2.7 · RESEARCH ADMINISTRATION",
    subtitle: "Multi-level drilldown by Division -> Center -> Research Program",
    source: "TTI Research Administration & Fiscal Operations · FY 2026 Ledger",
    story: "Zoomable treemap providing hierarchical transparency into the Institute's $85.4M annual sponsored contract portfolio. Click any research division tile to zoom in and examine individual program allocations.",
    height: "460px",
    ariaTitle: "TTI sponsored research contract portfolio zoomable treemap",
    ariaSummary: "Division of Safety & Operations leads with $26.2M (Crash Analytics $10.5M, Human Factors $8.2M, Vision Zero $7.5M), followed by Infrastructure ($22.1M), Multimodal Planning ($19.8M), and Connected Systems ($17.3M).",
    getOption: (isDark) => ({
      tooltip: {
        formatter: (params: any) => `${params.name}: <strong>$${params.value}M</strong> (${params.data.pct || ""})`,
      },
      series: [
        {
          name: "Research Portfolio",
          type: "treemap",
          visibleMin: 2,
          roam: false,
          leafDepth: 1,
          label: {
            show: true,
            fontFamily: "'Oswald', sans-serif",
            formatter: "{b}\n${c}M",
          },
          levels: [
            {
              itemStyle: {
                borderColor: isDark ? "#171717" : "#FFFFFF",
                borderWidth: 3,
                gapWidth: 3,
              },
            },
            {
              colorSaturation: [0.35, 0.65],
              itemStyle: {
                borderColor: isDark ? "#262626" : "#E5E7EB",
                borderWidth: 2,
                gapWidth: 2,
              },
            },
          ],
          data: [
            {
              name: "Safety & Operations",
              value: 26.2,
              itemStyle: { color: isDark ? "#A02D20" : "#500000" },
              children: [
                { name: "Center for Transportation Safety", value: 10.5 },
                { name: "Human Factors & Driver Behavior", value: 8.2 },
                { name: "Vision Zero Tech & Countermeasures", value: 7.5 },
              ],
            },
            {
              name: "Infrastructure & Materials",
              value: 22.1,
              itemStyle: { color: "#005F73" },
              children: [
                { name: "Pavement Engineering & IRI", value: 9.4 },
                { name: "Structural Testing & Crashworthy Girders", value: 7.8 },
                { name: "Concrete & Asphalt Durability Lab", value: 4.9 },
              ],
            },
            {
              name: "Multimodal Planning & Freight",
              value: 19.8,
              itemStyle: { color: "#0A9396" },
              children: [
                { name: "Urban Corridor Analytics & 100 Congested", value: 8.6 },
                { name: "Freight Logistics & Port Corridors", value: 6.4 },
                { name: "Transit Systems & Micro-Mobility", value: 4.8 },
              ],
            },
            {
              name: "Connected & Automated Transportation",
              value: 17.3,
              itemStyle: { color: "#CA6702" },
              children: [
                { name: "RELLIS Proving Grounds Autonomous Testbed", value: 8.1 },
                { name: "V2X Telemetry & Cyber-Security", value: 5.2 },
                { name: "Physics-Informed Traffic Simulation AI", value: 4.0 },
              ],
            },
          ],
        },
      ],
    }),
  },

  // 8. SUNBURST HIERARCHICAL FLEET ELECTRIFICATION
  {
    id: "sunburst",
    title: "Multimodal Fleet Composition & Decarbonization Tiers",
    category: "hierarchical",
    categoryLabel: "Hierarchical & Composition",
    eyebrow: "EXHIBIT 2.8 · FLEET SUSTAINABILITY",
    subtitle: "Concentric breakdown: Transportation Mode -> Powertrain -> Emissions Classification",
    source: "Texas Clean Transportation Initiative · Fleet Inventory Database",
    story: "Concentric sunburst diagram breaking down vehicle fleet classifications across public and commercial fleets. Outer rings reveal the emerging penetration of hydrogen fuel cell, battery electric, and hybrid powertrains.",
    height: "460px",
    ariaTitle: "Multimodal fleet decarbonization sunburst chart",
    ariaSummary: "Highway freight mode represents 54% of fleet volume, followed by Public Transit (26%) and Municipal Light Duty (20%). Battery-electric powertrain leads clean transition across transit bus fleets at 42%.",
    getOption: (isDark) => ({
      tooltip: { trigger: "item", formatter: "{b}: {c}% of sector" },
      series: [
        {
          type: "sunburst",
          radius: [0, "92%"],
          sort: undefined,
          emphasis: { focus: "ancestor" },
          data: [
            {
              name: "Public Transit",
              itemStyle: { color: isDark ? "#A02D20" : "#500000" },
              children: [
                {
                  name: "Battery Electric",
                  value: 42,
                  itemStyle: { color: "#005F73" },
                  children: [
                    { name: "40ft Heavy Transit", value: 24 },
                    { name: "Articulated BRT", value: 18 },
                  ],
                },
                {
                  name: "CNG / Hybrid",
                  value: 38,
                  itemStyle: { color: "#0A9396" },
                  children: [
                    { name: "Low-Floor Diesel Hybrid", value: 22 },
                    { name: "Compressed Natural Gas", value: 16 },
                  ],
                },
                { name: "Hydrogen Fuel Cell", value: 20, itemStyle: { color: "#EE9B00" } },
              ],
            },
            {
              name: "Commercial Freight",
              itemStyle: { color: "#CA6702" },
              children: [
                {
                  name: "Clean Diesel",
                  value: 65,
                  itemStyle: { color: "#BB3E03" },
                  children: [
                    { name: "EPA 2027 Compliant Class 8", value: 45 },
                    { name: "Medium Duty Delivery", value: 20 },
                  ],
                },
                { name: "BEV Heavy Truck", value: 25, itemStyle: { color: "#94D2BD" } },
                { name: "Hydrogen Sleeper", value: 10, itemStyle: { color: "#E9D8A6" } },
              ],
            },
          ],
          label: {
            rotate: "radial",
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 11,
          },
        },
      ],
    }),
  },

  // 9. CALENDAR WITH PULSING EFFECT SCATTER (INCIDENT CALENDAR)
  {
    id: "calendar-scatter",
    title: "Annual Corridor Incident Frequency & Extreme Weather Shocks",
    category: "spatial",
    categoryLabel: "Spatial & Temporal",
    eyebrow: "EXHIBIT 2.9 · SAFETY & RESILIENCE",
    subtitle: "365-day corridor incident heatmap with radiant effectScatter pings for winter storms and flash floods",
    source: "TTI Crash Records Information System (CRIS) Analytics · 2026 Incident Log",
    story: "Calendar heatmap highlighting daily corridor incident rates across all 365 days of the year, overlaid with pulsating radiant alert pings for extreme shock events (e.g. Winter Storm Freeze, Hurricane Flood, Labor Day Rush).",
    height: "360px",
    isAnimated: true,
    ariaTitle: "Annual incident calendar with pulsing shock alerts",
    ariaSummary: "Annual incident heatmap shows higher baseline crashes on Friday afternoons (avg 42 incidents/day), with severe incident spikes exceeding 120 incidents during February freeze and September tropical storm events.",
    getOption: (isDark) => {
      // Generate sample 2026 calendar days
      const daysData: [string, number][] = [];
      const shockEvents: [string, number][] = [
        ["2026-02-12", 124], // Winter Storm freeze
        ["2026-05-24", 88],  // Memorial Day holiday rush
        ["2026-09-08", 132], // Tropical Storm rainfall
        ["2026-11-25", 96],  // Thanksgiving eve
      ];

      const start = new Date("2026-01-01");
      for (let i = 0; i < 365; i++) {
        const d = new Date(start.getTime() + i * 86400000);
        const dateStr = d.toISOString().split("T")[0];
        const dayOfWeek = d.getDay();
        const base = dayOfWeek === 5 ? 42 : dayOfWeek === 0 || dayOfWeek === 6 ? 18 : 28;
        const randomFactor = Math.floor(Math.sin(i * 0.1) * 8);
        daysData.push([dateStr, Math.max(10, base + randomFactor)]);
      }

      return {
        tooltip: {
          formatter: (params: any) => `${params.value[0]}: ${params.value[1]} Recorded Incidents`,
        },
        visualMap: {
          min: 0,
          max: 60,
          type: "piecewise",
          orient: "horizontal",
          left: "center",
          bottom: 10,
          inRange: {
            color: isDark
              ? ["#1F2937", "#005F73", "#0A9396", "#EE9B00", "#A02D20"]
              : ["#F3F4F6", "#94D2BD", "#0A9396", "#EE9B00", "#500000"],
          },
          textStyle: { fontFamily: "'JetBrains Mono', monospace" },
        },
        calendar: {
          top: 30,
          left: 45,
          right: 30,
          cellSize: ["auto", 18],
          range: "2026",
          itemStyle: {
            borderWidth: 1,
            borderColor: isDark ? "#171717" : "#FFFFFF",
          },
          yearLabel: { show: false },
          dayLabel: { fontFamily: "'JetBrains Mono', monospace", color: isDark ? "#A3A3A3" : "#6B7280" },
          monthLabel: { fontFamily: "'Oswald', sans-serif", color: isDark ? "#F5F5F5" : "#1A1A1A" },
        },
        series: [
          {
            type: "heatmap",
            coordinateSystem: "calendar",
            data: daysData,
          },
          {
            type: "effectScatter",
            coordinateSystem: "calendar",
            data: shockEvents,
            symbolSize: 14,
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
              scale: 4,
              period: 2.5,
            },
            itemStyle: {
              color: "#AE2012",
              shadowBlur: 8,
              shadowColor: "#AE2012",
            },
            zlevel: 2,
          },
        ],
      };
    },
  },

  // 10. INSTRUMENT CLUSTER GAUGES (SPEEDOMETER, PSI, LOS)
  {
    id: "gauge-cluster",
    title: "Connected Vehicle Instrument Cluster: Speedometer, PSI, & Corridor LOS",
    category: "realtime",
    categoryLabel: "Real-Time & Racing",
    eyebrow: "EXHIBIT 2.10 · TELEMETRY INSTRUMENTATION",
    subtitle: "Real-time in-cab heads-up display telemetry dial cluster",
    source: "TTI Connected Vehicle Testbed · High-Speed Telemetry Ingestion",
    story: "Multi-gauge instrument cluster demonstrating Apache ECharts dial rendering. Displays live vehicle speedometer with speed limit advisory needle (65 MPH), tire pressure PSI status, and dynamic highway Level of Service (LOS A through F).",
    height: "420px",
    isAnimated: true,
    ariaTitle: "Connected vehicle multi-gauge instrument cluster",
    ariaSummary: "Primary speedometer reads 68 MPH against a 65 MPH speed limit. Tire pressure gauge reads 34.2 PSI in safe green band. Highway Level of Service reads LOS C (stable flow).",
    getOption: (isDark) => ({
      tooltip: { formatter: "{a} <br/>{b} : {c}" },
      series: [
        // Primary Speedometer Dial
        {
          name: "Speedometer",
          type: "gauge",
          center: ["30%", "55%"],
          radius: "75%",
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [0.65, "#0A9396"],
                [0.85, "#EE9B00"],
                [1, "#AE2012"],
              ],
            },
          },
          pointer: { itemStyle: { color: isDark ? "#A02D20" : "#500000" }, width: 4 },
          axisTick: { distance: -12, length: 5 },
          splitLine: { distance: -16, length: 10 },
          axisLabel: { distance: -24, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 },
          title: { offsetCenter: [0, "30%"], fontFamily: "'Oswald', sans-serif" },
          detail: {
            valueAnimation: true,
            formatter: "{value} MPH",
            offsetCenter: [0, "65%"],
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 16,
            fontWeight: "bold",
          },
          data: [{ value: 68, name: "CORRIDOR SPEED" }],
        },
        // Tire PSI Gauge
        {
          name: "Tire PSI",
          type: "gauge",
          center: ["75%", "40%"],
          radius: "50%",
          min: 20,
          max: 50,
          splitNumber: 6,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.4, "#EE9B00"],
                [0.8, "#0A9396"],
                [1, "#AE2012"],
              ],
            },
          },
          pointer: { width: 3 },
          title: { offsetCenter: [0, "35%"], fontSize: 11, fontFamily: "'Oswald', sans-serif" },
          detail: {
            formatter: "{value} PSI",
            offsetCenter: [0, "70%"],
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
          },
          data: [{ value: 34.2, name: "TIRE PRESSURE" }],
        },
        // Level of Service (LOS) Gauge
        {
          name: "Level of Service",
          type: "gauge",
          center: ["75%", "80%"],
          radius: "40%",
          min: 1,
          max: 6,
          splitNumber: 5,
          axisLine: {
            lineStyle: {
              width: 5,
              color: [
                [0.2, "#2B9348"],
                [0.4, "#0A9396"],
                [0.6, "#EE9B00"],
                [0.8, "#CA6702"],
                [1, "#AE2012"],
              ],
            },
          },
          axisLabel: {
            formatter: (v: number) => ["", "A", "B", "C", "D", "E", "F"][Math.round(v)] || "",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: "bold",
          },
          pointer: { width: 2.5 },
          title: { offsetCenter: [0, "35%"], fontSize: 10, fontFamily: "'Oswald', sans-serif" },
          detail: {
            formatter: () => "LOS C",
            offsetCenter: [0, "75%"],
            fontFamily: "'Oswald', sans-serif",
            fontSize: 12,
            fontWeight: "bold",
          },
          data: [{ value: 3, name: "HIGHWAY FLOW" }],
        },
      ],
    }),
  },

  // 11. WORD CLOUD EXTENSION (COMMUTER SURVEY SENTIMENT)
  {
    id: "word-cloud",
    title: "Commuter Experience Survey Sentiment Word Cloud",
    category: "custom",
    categoryLabel: "Unstructured & Custom",
    eyebrow: "EXHIBIT 2.11 · QUALITATIVE RESEARCH",
    subtitle: "Weighted lexical frequency across 12,500 qualitative transit & highway commuter surveys",
    source: "TTI Statewide Travel Behavior Survey · Text Analytics Working Group",
    story: "Word cloud extension mapping unstructured public survey comments into visually weighted semantic clusters. Words are styled with TUX brand tokens (Aggie Maroon, Teal, Sage, Amber), showing commuter priorities around reliability, bottleneck congestion, and safety.",
    height: "420px",
    ariaTitle: "Commuter sentiment word cloud",
    ariaSummary: "Primary feedback terms by frequency: Reliability (weight 98), Congestion (92), Safety (88), On-Time (82), Bottleneck (76), Express Lane (71), Pavement Quality (68), and EV Charging (54).",
    getOption: (isDark) => ({
      tooltip: { show: true, formatter: "{b}: {c} commuter mentions" },
      series: [
        {
          type: "wordCloud",
          shape: "circle",
          keepAspect: false,
          left: "center",
          top: "center",
          width: "90%",
          height: "90%",
          right: null,
          bottom: null,
          sizeRange: [14, 48],
          rotationRange: [-45, 45],
          rotationStep: 45,
          gridSize: 8,
          drawOutOfBound: false,
          layoutAnimation: true,
          textStyle: {
            fontFamily: "'Oswald', sans-serif",
            fontWeight: "bold",
            color: () => {
              const colors = [
                isDark ? "#A02D20" : "#500000",
                "#005F73",
                "#0A9396",
                "#CA6702",
                "#EE9B00",
                "#AE2012",
              ];
              return colors[Math.floor(Math.random() * colors.length)];
            },
          },
          data: [
            { name: "Reliability", value: 980 },
            { name: "Congestion", value: 920 },
            { name: "Safety", value: 880 },
            { name: "On-Time Transit", value: 820 },
            { name: "Bottlenecks", value: 760 },
            { name: "Express Lanes", value: 710 },
            { name: "Pavement Quality", value: 680 },
            { name: "Signage Clarity", value: 610 },
            { name: "Bicycle Connectivity", value: 580 },
            { name: "EV Charging Hubs", value: 540 },
            { name: "Toll Fairness", value: 510 },
            { name: "Clean Facilities", value: 470 },
            { name: "Incident Clearance", value: 440 },
            { name: "Smart Signals", value: 410 },
            { name: "Real-Time Alerts", value: 390 },
            { name: "Pedestrian Crossings", value: 360 },
            { name: "Carpool Incentives", value: 320 },
            { name: "Pothole Repair", value: 290 },
            { name: "Lighting", value: 270 },
          ],
        },
      ],
    }),
  },

  // 12. LIQUID FILL EXTENSION (HIGHWAY TRUST FUND)
  {
    id: "liquid-fill",
    title: "State Highway Fund Dedicated Liquidity Reserve Ratio",
    category: "executive",
    categoryLabel: "Executive & Policy",
    eyebrow: "EXHIBIT 2.12 · FISCAL TRANSPARENCY",
    subtitle: "State Highway Fund (Fund 0006) cash balance against statutory minimum operating target",
    source: "Texas Comptroller & TxDOT Financial Management Division · October 2026 Snapshot",
    story: "Liquid fill gauge extension featuring dual animated sinusoidal fluid waves. Provides instant, intuitive executive awareness of infrastructure treasury solvency and liquidity reserve strength.",
    height: "380px",
    isAnimated: true,
    ariaTitle: "State Highway Fund liquid fill gauge",
    ariaSummary: "Dedicated liquidity reserve ratio stands at 76.4% of total authorized capacity, safely exceeding the 60% statutory contingency threshold.",
    getOption: (isDark) => ({
      series: [
        {
          type: "liquidFill",
          data: [0.764, 0.72, 0.68],
          radius: "78%",
          center: ["50%", "50%"],
          amplitude: 8,
          waveLength: "80%",
          color: [
            isDark ? "#A02D20" : "#500000",
            "#005F73",
            "#0A9396",
          ],
          backgroundStyle: {
            color: isDark ? "#171717" : "#F3F4F6",
            borderWidth: 2,
            borderColor: isDark ? "#404040" : "#E5E7EB",
          },
          outline: {
            show: true,
            borderDistance: 5,
            itemStyle: {
              borderWidth: 3,
              borderColor: isDark ? "#A02D20" : "#500000",
            },
          },
          label: {
            formatter: "76.4%\nRESERVE",
            fontFamily: "'Oswald', sans-serif",
            fontSize: 26,
            fontWeight: "bold",
            color: isDark ? "#F5F5F5" : "#1A1A1A",
          },
        },
      ],
    }),
  },

  // 13. TEXAS 254-COUNTY CHOROPLETH MAP
  {
    id: "texas-counties",
    title: "Texas 254-County Crash Severity & VMT Density Choropleth",
    category: "spatial",
    categoryLabel: "Spatial & Maps",
    eyebrow: "EXHIBIT 3.1 · GEOGRAPHIC CRASH ANALYTICS",
    subtitle: "Fatal crash rate per 100M vehicle miles traveled (VMT) with interactive zoom and pan",
    source: "TTI Center for Transportation Safety · CRIS Crash Analytics",
    story: "Full 254-county vector choropleth map. Equal-area projection preserves geospatial truth across rural and urban Texas districts. Hover tooltips detail county population, annual VMT, and five-year fatal crash rate trends.",
    height: "500px",
    ariaTitle: "Texas 254-county crash severity choropleth map",
    ariaSummary: "Interactive Texas county map showing highest crash rates concentrated in Permian Basin energy sector counties (Ector: 2.68, Midland: 2.45 per 100M VMT), and lowest rates in suburban metro counties (Collin: 0.94, Denton: 1.05).",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "item",
        formatter: "{b} County<br/>Crash Rate: <strong>{c}</strong> per 100M VMT",
      },
      visualMap: {
        min: 0.8,
        max: 2.8,
        orient: "horizontal",
        left: "center",
        bottom: "2%",
        text: ["High Severity", "Low Severity"],
        inRange: {
          color: isDark
            ? ["#1F2937", "#005F73", "#EE9B00", "#A02D20"]
            : ["#E9D8A6", "#EE9B00", "#CA6702", "#500000"],
        },
        calculable: true,
      },
      series: [
        {
          name: "Crash Rate",
          type: "map",
          map: "TEXAS_COUNTIES",
          roam: true,
          zoom: 1.15,
          emphasis: {
            label: { show: true },
            itemStyle: { areaColor: isDark ? "#A02D20" : "#500000" },
          },
          data: [
            { name: "Harris", value: 1.84 },
            { name: "Dallas", value: 1.76 },
            { name: "Tarrant", value: 1.42 },
            { name: "Bexar", value: 1.58 },
            { name: "Travis", value: 1.22 },
            { name: "El Paso", value: 1.48 },
            { name: "Collin", value: 0.94 },
            { name: "Denton", value: 1.05 },
            { name: "Hidalgo", value: 2.12 },
            { name: "Cameron", value: 1.95 },
            { name: "Midland", value: 2.45 },
            { name: "Ector", value: 2.68 },
            { name: "Lubbock", value: 1.52 },
            { name: "Potter", value: 1.89 },
            { name: "McLennan", value: 1.64 },
            { name: "Brazos", value: 1.15 },
            { name: "Bell", value: 1.55 },
            { name: "Nueces", value: 1.72 },
            { name: "Webb", value: 2.05 },
          ],
        },
      ],
    }),
  },

  // 14. TXDOT 25 ENGINEERING DISTRICTS MAP
  {
    id: "txdot-districts",
    title: "TxDOT 25 Engineering Districts Mobility Investment Priorities",
    category: "spatial",
    categoryLabel: "Spatial & Maps",
    eyebrow: "EXHIBIT 3.2 · TXDOT DISTRICT PORTFOLIO",
    subtitle: "Unified Transportation Program (UTP) project delivery priority score by district (1–100)",
    source: "TxDOT Unified Transportation Program · Project Delivery Office",
    story: "Administrative geography of TxDOT's 25 engineering districts. Enables legislative delegates and district engineers to evaluate regional funding equity and active roadway reconstruction volumes.",
    height: "500px",
    ariaTitle: "TxDOT 25 engineering districts priority map",
    ariaSummary: "Houston (score 94) and Dallas (score 92) districts hold the highest project delivery priority scores, followed by Austin (89), San Antonio (86), Odessa (85), and Fort Worth (84).",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "item",
        formatter: "TxDOT {b} District<br/>Priority Score: <strong>{c} / 100</strong>",
      },
      visualMap: {
        min: 40,
        max: 95,
        orient: "horizontal",
        left: "center",
        bottom: "2%",
        text: ["Priority High", "Routine"],
        inRange: {
          color: isDark
            ? ["#1F2937", "#005F73", "#0A9396", "#A02D20"]
            : ["#94D2BD", "#005F73", "#500000"],
        },
        calculable: true,
      },
      series: [
        {
          name: "Priority Score",
          type: "map",
          map: "TXDOT_DISTRICTS",
          roam: true,
          zoom: 1.15,
          emphasis: {
            label: { show: true },
            itemStyle: { areaColor: isDark ? "#EE9B00" : "#CA6702" },
          },
          data: [
            { name: "Houston", value: 94 },
            { name: "Dallas", value: 92 },
            { name: "Austin", value: 89 },
            { name: "San Antonio", value: 86 },
            { name: "Fort Worth", value: 84 },
            { name: "El Paso", value: 78 },
            { name: "Pharr", value: 82 },
            { name: "Laredo", value: 80 },
            { name: "Corpus Christi", value: 74 },
            { name: "Beaumont", value: 72 },
            { name: "Bryan", value: 68 },
            { name: "Waco", value: 71 },
            { name: "Tyler", value: 65 },
            { name: "Lufkin", value: 58 },
            { name: "Atlanta", value: 54 },
            { name: "Paris", value: 56 },
            { name: "Wichita Falls", value: 60 },
            { name: "Brownwood", value: 48 },
            { name: "San Angelo", value: 52 },
            { name: "Abilene", value: 62 },
            { name: "Lubbock", value: 66 },
            { name: "Amarillo", value: 64 },
            { name: "Childress", value: 44 },
            { name: "Odessa", value: 85 },
            { name: "Yoakum", value: 59 },
          ],
        },
      ],
    }),
  },

  // 15. TEXAS TRIANGLE ORIGIN-DESTINATION FLOW ARCS
  {
    id: "texas-metros-flow",
    title: "Texas Triangle Multimodal Freight & Airline Flow Arcs",
    category: "spatial",
    categoryLabel: "Spatial & Maps",
    eyebrow: "EXHIBIT 3.3 · INTER-METRO LOGISTICS",
    subtitle: "High-volume origin-destination logistics arcs with animated trailing particle vectors",
    source: "Texas Multimodal Freight Plan · TTI Freight Analytics",
    story: "Curved dynamic flow arcs connecting primary Texas metropolitan hubs. Animated particle arrows indicate directional freight flux along the Texas Triangle megaregion (DFW, Houston, San Antonio, Austin) and border corridors.",
    height: "480px",
    isAnimated: true,
    ariaTitle: "Texas Triangle inter-metro freight flow map",
    ariaSummary: "DFW to Houston is the highest volume freight arc (95k tons/day), followed by Austin to San Antonio (60k) and Austin to DFW (55k), with pulsing hubs at DFW, Houston, and San Antonio.",
    getOption: (isDark) => {
      const metroCoords: Record<string, [number, number]> = {
        DFW: [402.3, 139.4],
        HOU: [451.9, 251.0],
        SAT: [350.7, 266.4],
        AUS: [374.5, 234.3],
        ELP: [95.6, 173.0],
        MCA: [361.2, 387.0],
        LBB: [243.8, 110.3],
      };

      const flows = [
        { from: "DFW", to: "HOU", value: 95 },
        { from: "AUS", to: "SAT", value: 60 },
        { from: "AUS", to: "DFW", value: 55 },
        { from: "AUS", to: "HOU", value: 45 },
        { from: "HOU", to: "SAT", value: 38 },
        { from: "DFW", to: "SAT", value: 30 },
        { from: "ELP", to: "DFW", value: 18 },
        { from: "LBB", to: "DFW", value: 16 },
        { from: "MCA", to: "SAT", value: 28 },
      ];

      const linesData = flows.map((f) => ({
        coords: [metroCoords[f.from], metroCoords[f.to]],
        value: f.value,
      }));

      const scatterData = Object.entries(metroCoords).map(([code, coords]) => ({
        name: code,
        value: [...coords, 100],
      }));

      return {
        tooltip: {
          trigger: "item",
          formatter: (params: any) => {
            if (params.seriesType === "lines") {
              return `Corridor Flow: <strong>${params.data.value}k tons / day</strong>`;
            }
            return `${params.name} Metro Freight Terminal`;
          },
        },
        xAxis: { min: 0, max: 600, show: false },
        yAxis: { min: 0, max: 400, inverse: true, show: false },
        grid: { left: "4%", right: "4%", top: "4%", bottom: "4%" },
        series: [
          {
            name: "Corridor Arcs",
            type: "lines",
            coordinateSystem: "cartesian2d",
            zlevel: 1,
            effect: {
              show: true,
              period: 3.2,
              trailLength: 0.65,
              color: isDark ? "#EE9B00" : "#500000",
              symbol: "arrow",
              symbolSize: 7,
            },
            lineStyle: {
              color: isDark ? "#0A9396" : "#005F73",
              width: 3,
              opacity: 0.6,
              curveness: 0.25,
            },
            data: linesData,
          },
          {
            name: "Metropolitan Hubs",
            type: "effectScatter",
            coordinateSystem: "cartesian2d",
            zlevel: 2,
            rippleEffect: {
              brushType: "stroke",
              scale: 3.5,
              period: 2.5,
            },
            label: {
              show: true,
              position: "top",
              formatter: "{b}",
              fontFamily: "'Oswald', sans-serif",
              color: isDark ? "#F5F5F5" : "#1A1A1A",
              fontSize: 12,
            },
            symbolSize: 12,
            itemStyle: {
              color: isDark ? "#A02D20" : "#500000",
              shadowBlur: 10,
              shadowColor: "#500000",
            },
            data: scatterData,
          },
        ],
      };
    },
  },

  // 16. US ALBERS NATIONAL FREIGHT DENSITY
  {
    id: "usa-albers",
    title: "National Interstate Freight Corridor Density (AlbersUsa)",
    category: "spatial",
    categoryLabel: "Spatial & Maps",
    eyebrow: "EXHIBIT 3.4 · NATIONAL FREIGHT CONTEXT",
    subtitle: "Cross-border and interstate commercial freight intensity across 50 US states",
    source: "Federal Highway Administration (FHWA) Freight Analysis Framework (FAF5)",
    story: "AlbersUsa equal-area projection map demonstrating Texas's position as the nation's premier freight logistics gateway, connecting international border crossings and deep-water Gulf ports with Midwestern distribution hubs.",
    height: "460px",
    ariaTitle: "National freight corridor density Albers map",
    ariaSummary: "Texas leads national freight activity at 100 on the freight intensity index, followed by California (92), Illinois (84), and Florida (78).",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "item",
        formatter: "{b}<br/>Freight Activity Index: <strong>{c} / 100</strong>",
      },
      visualMap: {
        min: 10,
        max: 100,
        orient: "horizontal",
        left: "center",
        bottom: "2%",
        text: ["High Volume", "Low Volume"],
        inRange: {
          color: isDark
            ? ["#1F2937", "#005F73", "#EE9B00", "#A02D20"]
            : ["#E9D8A6", "#0A9396", "#CA6702", "#500000"],
        },
        calculable: true,
      },
      series: [
        {
          name: "National Freight",
          type: "map",
          map: "USA_ALBERS",
          roam: true,
          zoom: 1.15,
          emphasis: {
            label: { show: true },
            itemStyle: { areaColor: isDark ? "#A02D20" : "#500000" },
          },
          data: [
            { name: "Texas", value: 100 },
            { name: "California", value: 92 },
            { name: "Illinois", value: 84 },
            { name: "Florida", value: 78 },
            { name: "New York", value: 76 },
            { name: "Georgia", value: 72 },
            { name: "Ohio", value: 68 },
            { name: "Pennsylvania", value: 66 },
            { name: "Louisiana", value: 70 },
            { name: "Oklahoma", value: 58 },
          ],
        },
      ],
    }),
  },

  // 17. RACING LINE TELEMETRY LIVE STREAM
  {
    id: "racing-line",
    title: "High-Frequency Connected Vehicle Telemetry Live Stream",
    category: "realtime",
    categoryLabel: "Real-Time & Racing",
    eyebrow: "EXHIBIT 3.5 · EDGE V2X SENSOR TELEMETRY",
    subtitle: "High-frequency streaming CAN-Bus sensor telemetry across powertrain, brakes, and network latency",
    source: "TTI Connected Vehicle Proving Grounds at RELLIS",
    story: "High-frequency telemetry stream with dual y-axes and multi-sensor overlays. Visualizes the microsecond correlation between sudden brake pressure actuation, throttle release, and V2X edge latency.",
    height: "420px",
    isAnimated: true,
    ariaTitle: "High-frequency connected vehicle telemetry line chart",
    ariaSummary: "Vehicle speed accelerates from 0 to 70 MPH before deceleration to 52 MPH, with brake line pressure spiking to 42 PSI during emergency braking at 70 seconds.",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {
        data: ["Vehicle Speed (MPH)", "Throttle Position (%)", "Brake Line (PSI)", "C-V2X Latency (ms)"],
        top: 5,
      },
      grid: { left: "4%", right: "4%", bottom: "10%", top: "14%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["0s", "10s", "20s", "30s", "40s", "50s", "60s", "70s", "80s", "90s"],
      },
      yAxis: [
        {
          type: "value",
          name: "Speed / Throttle",
          min: 0,
          max: 100,
        },
        {
          type: "value",
          name: "Brake / Latency",
          min: 0,
          max: 60,
        },
      ],
      series: [
        {
          name: "Vehicle Speed (MPH)",
          type: "line",
          smooth: true,
          data: [0, 24, 45, 62, 68, 70, 65, 52, 60, 68],
          lineStyle: { width: 3, color: isDark ? "#A02D20" : "#500000" },
          itemStyle: { color: isDark ? "#A02D20" : "#500000" },
        },
        {
          name: "Throttle Position (%)",
          type: "line",
          smooth: true,
          data: [15, 65, 80, 45, 50, 48, 20, 10, 40, 52],
          lineStyle: { width: 2, color: "#005F73" },
          itemStyle: { color: "#005F73" },
        },
        {
          name: "Brake Line (PSI)",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: [35, 0, 0, 0, 0, 5, 28, 42, 0, 0],
          lineStyle: { width: 2.5, color: "#AE2012" },
          itemStyle: { color: "#AE2012" },
        },
        {
          name: "C-V2X Latency (ms)",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: [8, 9, 12, 11, 8, 9, 14, 11, 9, 8],
          lineStyle: { width: 2, type: "dashed", color: "#EE9B00" },
          itemStyle: { color: "#EE9B00" },
        },
      ],
    }),
  },

  // 18. SANKEY: STATE HIGHWAY FUND & REVENUE ALLOCATION
  {
    id: "sankey",
    title: "Texas State Highway Fund Dedicated Allocation & Investment Flows",
    category: "executive",
    categoryLabel: "Executive & Policy",
    eyebrow: "EXHIBIT 4.1 · REVENUE & APPROPRIATIONS",
    subtitle: "End-to-end tracing of state motor fuel, severance tax, and federal funds to TxDOT capital programs",
    source: "Texas Comptroller of Public Accounts & TxDOT Financial Management Division",
    story: "Multi-stage Sankey diagram illustrating how $17.1B in constitutional and statutory transportation revenues flow from dedicated motor fuel taxes, vehicle registrations, and oil/gas severance transfers into major TxDOT highway construction, bridge preservation, and multimodal programs.",
    height: "480px",
    ariaTitle: "Texas State Highway Fund Sankey allocation diagram",
    ariaSummary: "Total $17.1B flow includes $4.8B Federal Highway Trust Fund, $3.8B Motor Fuel Tax, $3.4B Prop 1 Oil and Gas Severance, and $3.2B Prop 7 Sales Tax, funding $6.2B Highway Preservation, $5.3B Congestion Relief, $1.9B Bridge Replacement, and $1.8B Rural Connectivity.",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove",
        formatter: (params: any) => {
          if (params.dataType === "edge") {
            return `<strong>${params.data.source}</strong> → <strong>${params.data.target}</strong><br/>Allocation: <strong>$${params.data.value}B</strong>`;
          }
          return `<strong>${params.name}</strong><br/>Volume: <strong>$${params.value || ""}B</strong>`;
        },
      },
      series: [
        {
          type: "sankey",
          layout: "none",
          emphasis: { focus: "adjacency" },
          nodeAlign: "justify",
          nodeGap: 16,
          nodeWidth: 20,
          label: {
            color: isDark ? "#F3F4F6" : "#1F2937",
            fontFamily: "var(--font-display)",
            fontSize: 12,
            fontWeight: "bold",
          },
          lineStyle: {
            color: "gradient",
            curveness: 0.5,
            opacity: 0.35,
          },
          data: [
            // Sources
            { name: "Motor Fuel Tax", itemStyle: { color: isDark ? "#A02D20" : "#500000" } },
            { name: "Vehicle Registration", itemStyle: { color: "#005F73" } },
            { name: "Prop 1 Oil & Gas Severance", itemStyle: { color: "#CA6702" } },
            { name: "Prop 7 Sales Tax Transfer", itemStyle: { color: "#EE9B00" } },
            { name: "Federal Highway Trust Fund", itemStyle: { color: "#0A9396" } },
            // Central Pool
            { name: "State Highway Fund (SHF)", itemStyle: { color: isDark ? "#D48B80" : "#7A1C1C" } },
            // Allocations
            { name: "Interstate & Pavement Preservation", itemStyle: { color: isDark ? "#A02D20" : "#500000" } },
            { name: "Major Congestion Relief Corridors", itemStyle: { color: "#005F73" } },
            { name: "Bridge Replacement & Rehabilitation", itemStyle: { color: "#CA6702" } },
            { name: "Rural Connectivity & Farm-to-Market", itemStyle: { color: "#94D2BD" } },
            { name: "Vision Zero Safety Grants", itemStyle: { color: "#AE2012" } },
            { name: "Multimodal Transit & Rail", itemStyle: { color: "#EE9B00" } },
          ],
          links: [
            { source: "Motor Fuel Tax", target: "State Highway Fund (SHF)", value: 3.8 },
            { source: "Vehicle Registration", target: "State Highway Fund (SHF)", value: 1.9 },
            { source: "Prop 1 Oil & Gas Severance", target: "State Highway Fund (SHF)", value: 3.4 },
            { source: "Prop 7 Sales Tax Transfer", target: "State Highway Fund (SHF)", value: 3.2 },
            { source: "Federal Highway Trust Fund", target: "State Highway Fund (SHF)", value: 4.8 },
            { source: "State Highway Fund (SHF)", target: "Interstate & Pavement Preservation", value: 6.2 },
            { source: "State Highway Fund (SHF)", target: "Major Congestion Relief Corridors", value: 5.3 },
            { source: "State Highway Fund (SHF)", target: "Bridge Replacement & Rehabilitation", value: 1.9 },
            { source: "State Highway Fund (SHF)", target: "Rural Connectivity & Farm-to-Market", value: 1.8 },
            { source: "State Highway Fund (SHF)", target: "Vision Zero Safety Grants", value: 1.1 },
            { source: "State Highway Fund (SHF)", target: "Multimodal Transit & Rail", value: 0.8 },
          ],
        },
      ],
    }),
  },

  // 19. MATRIX HEATMAP: 24/7 DIURNAL CORRIDOR CONGESTION
  {
    id: "heatmap-congestion",
    title: "Austin I-35 Central Corridor 24/7 Diurnal Congestion Matrix",
    category: "realtime",
    categoryLabel: "Real-Time & Racing",
    eyebrow: "EXHIBIT 4.2 · CORRIDOR BOTTLENECK DYNAMICS",
    subtitle: "Hourly travel delay index (TDI) across 168 hours of the weekly commuting cycle",
    source: "TTI Urban Mobility Report · Automated Traffic Operations System",
    story: "High-density matrix heatmap mapping recurring congestion across every hour of the week along I-35 through downtown Austin. Highlights acute multi-hour gridlock (delay indices up to 2.45x free-flow) during Friday afternoon peak corridors between 15:00 and 19:00.",
    height: "440px",
    ariaTitle: "I-35 hourly congestion matrix heatmap",
    ariaSummary: "Friday from 16:00 to 18:00 experiences peak congestion delay at 2.45x free-flow travel time, with weekday morning peaks occurring at 08:00 (1.95x) and weekend midday congestion remaining elevated around 1.35x.",
    getOption: (isDark) => {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const hours = [
        "12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a",
        "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p",
      ];

      // Generate realistic 7x24 grid: baseline 1.0, morning rush (7-9), evening rush (16-19), Friday peak
      const matrixData: [number, number, number][] = [];
      days.forEach((day, dayIdx) => {
        hours.forEach((_, hourIdx) => {
          let delay = 1.0;
          const isWeekend = dayIdx >= 5;
          if (!isWeekend) {
            if (hourIdx >= 7 && hourIdx <= 9) {
              delay = dayIdx === 4 ? 1.75 : 1.95 - (hourIdx === 8 ? 0 : 0.25);
            } else if (hourIdx >= 15 && hourIdx <= 18) {
              delay = dayIdx === 4 ? 2.45 - (hourIdx === 17 ? 0 : 0.2) : 2.1 - (hourIdx === 17 ? 0 : 0.3);
            } else if (hourIdx >= 11 && hourIdx <= 14) {
              delay = 1.25 + (dayIdx === 4 ? 0.2 : 0.05);
            } else if (hourIdx >= 0 && hourIdx <= 5) {
              delay = 1.0 + (hourIdx === 5 ? 0.15 : 0.02);
            } else {
              delay = 1.15;
            }
          } else {
            // Weekend: midday shopping / recreational peak
            if (hourIdx >= 11 && hourIdx <= 17) {
              delay = 1.35;
            } else if (hourIdx >= 21 && hourIdx <= 23) {
              delay = 1.2;
            } else {
              delay = 1.02;
            }
          }
          matrixData.push([hourIdx, dayIdx, Number(delay.toFixed(2))]);
        });
      });

      return {
        tooltip: {
          position: "top",
          formatter: (p: any) =>
            `<strong>${days[p.value[1]]} at ${hours[p.value[0]]}</strong><br/>Travel Delay Index: <strong>${p.value[2]}x</strong> free-flow`,
        },
        grid: { height: "70%", top: "10%", left: "8%", right: "4%" },
        xAxis: {
          type: "category",
          data: hours,
          splitArea: { show: true },
          axisLabel: { interval: 1, fontFamily: "var(--font-mono)", fontSize: 10 },
        },
        yAxis: {
          type: "category",
          data: days,
          splitArea: { show: true },
          axisLabel: { fontFamily: "var(--font-display)", fontWeight: "bold" },
        },
        visualMap: {
          min: 1.0,
          max: 2.5,
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: "0%",
          text: ["Severe Delay (2.5x)", "Free Flow (1.0x)"],
          inRange: {
            color: isDark
              ? ["#1F2937", "#005F73", "#EE9B00", "#A02D20"]
              : ["#E9D8A6", "#0A9396", "#CA6702", "#500000"],
          },
        },
        series: [
          {
            name: "Travel Delay Index",
            type: "heatmap",
            data: matrixData,
            label: { show: false },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
    },
  },

  // 20. RADAR: MULTIMODAL TRANSIT ALTERNATIVES
  {
    id: "radar-alternatives",
    title: "High-Capacity Transit Alternatives Multi-Criteria Evaluation",
    category: "executive",
    categoryLabel: "Executive & Policy",
    eyebrow: "EXHIBIT 4.3 · ALTERNATIVES ANALYSIS",
    subtitle: "Comparative scoring across 6 key feasibility dimensions for urban arterial transit investment",
    source: "Federal Transit Administration (FTA) Capital Investment Grant Evaluation",
    story: "Radar chart comparing three major corridor investment modes. Automated Bus Rapid Transit (aBRT) delivers superior capital efficiency and rapid deployment, while Commuter Light Rail dominates maximum peak passenger throughput and long-term carbon abatement.",
    height: "460px",
    ariaTitle: "Multimodal transit alternatives radar chart",
    ariaSummary: "Automated BRT scores 92 on Capital Efficiency and 88 on Speed to Construct; Commuter Rail scores 95 on Peak Hourly Capacity and 90 on Carbon Abatement; Managed HOT Lanes score 82 on Vision Zero Safety.",
    getOption: (isDark) => ({
      tooltip: { trigger: "item" },
      legend: {
        bottom: "2%",
        textStyle: { fontFamily: "var(--font-display)" },
      },
      radar: {
        indicator: [
          { name: "Capital Efficiency ($/rider)", max: 100 },
          { name: "Peak Hourly Capacity", max: 100 },
          { name: "Carbon Abatement", max: 100 },
          { name: "Vision Zero Safety Index", max: 100 },
          { name: "Speed to Deployment", max: 100 },
          { name: "Public & Rider Approval", max: 100 },
        ],
        shape: "circle",
        splitNumber: 5,
        axisName: {
          color: isDark ? "#E5E7EB" : "#374151",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: isDark
              ? ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"]
              : ["rgba(0,0,0,0.01)", "rgba(0,0,0,0.03)"],
          },
        },
      },
      series: [
        {
          name: "Transit Corridor Alternatives",
          type: "radar",
          data: [
            {
              value: [92, 68, 74, 78, 88, 80],
              name: "Automated Bus Rapid Transit (aBRT)",
              lineStyle: { width: 2.5, color: isDark ? "#A02D20" : "#500000" },
              areaStyle: { color: isDark ? "rgba(160,45,32,0.25)" : "rgba(80,0,0,0.2)" },
              itemStyle: { color: isDark ? "#A02D20" : "#500000" },
            },
            {
              value: [45, 95, 90, 85, 38, 86],
              name: "Commuter Light Rail (LRT)",
              lineStyle: { width: 2.5, color: "#005F73" },
              areaStyle: { color: "rgba(0,95,115,0.2)" },
              itemStyle: { color: "#005F73" },
            },
            {
              value: [72, 60, 52, 82, 70, 68],
              name: "Managed Express HOT Lanes",
              lineStyle: { width: 2, type: "dashed", color: "#EE9B00" },
              areaStyle: { color: "rgba(238,155,0,0.15)" },
              itemStyle: { color: "#EE9B00" },
            },
          ],
        },
      ],
    }),
  },

  // 21. BOXPLOT: TRAVEL TIME RELIABILITY DISTRIBUTION
  {
    id: "boxplot-reliability",
    title: "Texas Commercial Freight Corridors Travel Time Index (TTI) Reliability",
    category: "realtime",
    categoryLabel: "Real-Time & Racing",
    eyebrow: "EXHIBIT 4.4 · STATISTICAL RELIABILITY",
    subtitle: "5-number statistical distribution of travel time buffer index across primary freight corridors",
    source: "National Performance Management Research Data Set (NPMRDS) & TTI Mobility Analysis",
    story: "Statistical boxplot capturing travel time unpredictability. Corridors like I-35 Central exhibit extreme upper whisker extensions (95th percentile planning time index exceeding 2.85), forcing commercial freight logistics operators to budget triple their non-congested travel time.",
    height: "440px",
    ariaTitle: "Freight corridor travel time index boxplot",
    ariaSummary: "I-35 Central has the highest median travel time index at 1.82 with 95th percentile reaching 2.85, followed by Loop 610 West (median 1.68, max 2.65), I-10 Katy (median 1.54), and US-290 (median 1.38).",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          if (params.seriesType === "boxplot") {
            const [min, q1, median, q3, max] = params.data;
            return `<strong>${params.name}</strong><br/>
                    95th Percentile: <strong>${max.toFixed(2)}x</strong><br/>
                    Upper Quartile (Q3): <strong>${q3.toFixed(2)}x</strong><br/>
                    Median Delay: <strong>${median.toFixed(2)}x</strong><br/>
                    Lower Quartile (Q1): <strong>${q1.toFixed(2)}x</strong><br/>
                    Free-Flow Min: <strong>${min.toFixed(2)}x</strong>`;
          }
          return `${params.name}: ${params.data[1]}`;
        },
      },
      grid: { left: "10%", right: "8%", bottom: "14%", top: "10%" },
      xAxis: {
        type: "category",
        data: [
          "I-35 Austin Central",
          "Loop 610 West Houston",
          "I-45 North Freeway",
          "I-10 Katy Freeway",
          "US-290 Northwest",
        ],
        axisLabel: { fontFamily: "var(--font-display)", fontWeight: "bold" },
      },
      yAxis: {
        type: "value",
        name: "Travel Time Index (x Free-Flow)",
        min: 1.0,
        max: 3.0,
        splitLine: {
          lineStyle: {
            color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
          },
        },
      },
      series: [
        {
          name: "Corridor Reliability",
          type: "boxplot",
          itemStyle: {
            color: isDark ? "rgba(160,45,32,0.3)" : "rgba(80,0,0,0.2)",
            borderColor: isDark ? "#A02D20" : "#500000",
            borderWidth: 2,
          },
          data: [
            // [min, Q1, median, Q3, max]
            [1.08, 1.42, 1.82, 2.25, 2.85],
            [1.05, 1.35, 1.68, 2.12, 2.65],
            [1.04, 1.28, 1.58, 1.95, 2.45],
            [1.02, 1.22, 1.54, 1.88, 2.38],
            [1.01, 1.15, 1.38, 1.65, 2.15],
          ],
        },
      ],
    }),
  },

  // 22. BORDER GATEWAYS: INTERNATIONAL COMMERCIAL TRADE PORTS
  {
    id: "border-gateways",
    title: "Texas International Commercial Ports of Entry Throughput & Queue Wait Times",
    category: "spatial",
    categoryLabel: "Spatial & Maps",
    eyebrow: "EXHIBIT 4.5 · INTERNATIONAL LOGISTICS",
    subtitle: "Daily commercial truck crossings and peak customs inspection queue latency",
    source: "US Customs & Border Protection (CBP) & TxDOT Border Transportation Office",
    story: "Comprehensive overview of the nation's premier binational freight gateways. Laredo World Trade Bridge processes over 14,800 commercial vehicles daily, where automated pre-clearance FAST lanes reduce customs wait times from 95 minutes down to 18 minutes.",
    height: "460px",
    ariaTitle: "Texas international border commercial ports of entry chart",
    ariaSummary: "World Trade Bridge Laredo handles 14,850 trucks daily with 42 min median wait time, followed by Pharr-Reynosa (8,420 trucks, 65 min), Bridge of the Americas El Paso (4,120 trucks, 52 min), and Veterans International Brownsville (2,380 trucks, 34 min).",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        data: ["Daily Commercial Trucks", "Peak Queue Wait Time (min)"],
        top: 5,
        textStyle: { fontFamily: "var(--font-display)" },
      },
      grid: { left: "4%", right: "4%", bottom: "10%", top: "14%", containLabel: true },
      xAxis: {
        type: "category",
        data: [
          "World Trade Bridge\n(Laredo)",
          "Pharr-Reynosa\n(Pharr)",
          "Bridge of the Americas\n(El Paso)",
          "Veterans International\n(Brownsville)",
          "Camino Real\n(Eagle Pass)",
        ],
        axisLabel: { fontFamily: "var(--font-display)", fontSize: 11 },
      },
      yAxis: [
        {
          type: "value",
          name: "Trucks / Day",
          min: 0,
          max: 16000,
        },
        {
          type: "value",
          name: "Wait Time (Minutes)",
          min: 0,
          max: 100,
        },
      ],
      series: [
        {
          name: "Daily Commercial Trucks",
          type: "bar",
          data: [14850, 8420, 4120, 2380, 2150],
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: isDark ? "#A02D20" : "#500000",
          },
        },
        {
          name: "Peak Queue Wait Time (min)",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: [42, 65, 52, 34, 38],
          lineStyle: { width: 3, color: "#EE9B00" },
          itemStyle: { color: "#EE9B00", borderWidth: 2 },
        },
      ],
    }),
  },

  // 23. PARALLEL: CONNECTED VEHICLE MULTI-AXIS SENSOR TELEMETRY
  {
    id: "parallel-telemetry",
    title: "Connected Autonomous Vehicle Multi-Axis CAN-Bus Sensor Telemetry",
    category: "realtime",
    categoryLabel: "Real-Time & Racing",
    eyebrow: "EXHIBIT 5.1 · SENSOR DATA STREAM",
    subtitle: "High-dimensional multivariate correlation across speed, headway distance, deceleration, steering, friction, and latency",
    source: "TTI Proving Grounds at RELLIS · Automated Vehicle Cooperative Driving System",
    story: "Parallel coordinates chart illustrating the multivariate safety envelope of connected vehicle platoons. Interactive brush filtering along any axis reveals immediate correlations between pavement friction coefficients and required braking deceleration rates.",
    height: "460px",
    ariaTitle: "Connected vehicle parallel coordinates telemetry chart",
    ariaSummary: "Displays multi-attribute sensor profiles across 6 continuous dimensions for 15 platoon vehicle trajectory samples, highlighting safe headway envelopes between 1.2s and 2.8s under variable pavement friction.",
    getOption: (isDark) => ({
      tooltip: {
        padding: 10,
        backgroundColor: isDark ? "#171717" : "#FFFFFF",
        borderColor: isDark ? "#383838" : "#E5E5E5",
      },
      parallelAxis: [
        { dim: 0, name: "Speed (MPH)", min: 20, max: 80 },
        { dim: 1, name: "Headway (s)", min: 0.5, max: 4.0 },
        { dim: 2, name: "Decel (m/s²)", min: 0, max: 8.0 },
        { dim: 3, name: "Steer Angle (°)", min: -25, max: 25 },
        { dim: 4, name: "Friction (μ)", min: 0.2, max: 0.9 },
        { dim: 5, name: "V2X Latency (ms)", min: 2, max: 30 },
      ],
      parallel: {
        left: "5%",
        right: "12%",
        bottom: "12%",
        top: "16%",
        parallelAxisDefault: {
          type: "value",
          nameLocation: "end",
          nameGap: 16,
          nameTextStyle: {
            color: isDark ? "#E5E7EB" : "#374151",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
          },
          axisLine: {
            lineStyle: { color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" },
          },
          axisLabel: {
            color: isDark ? "#9CA3AF" : "#6B7280",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
          },
        },
      },
      series: [
        {
          name: "Platoon Telemetry Ensembles",
          type: "parallel",
          lineStyle: {
            width: 2.2,
            opacity: 0.65,
            color: isDark ? "#A02D20" : "#500000",
          },
          data: [
            [72, 1.4, 1.2, 2.1, 0.82, 8.4],
            [68, 1.6, 0.8, -1.2, 0.78, 9.1],
            [65, 1.8, 0.5, 0.4, 0.85, 7.8],
            [74, 1.2, 2.8, 4.5, 0.74, 11.2],
            [58, 2.2, 1.4, -3.2, 0.68, 14.5],
            [48, 2.6, 4.8, 8.2, 0.45, 18.2],
            [35, 3.1, 6.2, -12.4, 0.38, 22.4],
            [70, 1.5, 1.1, 1.8, 0.81, 8.9],
            [69, 1.7, 0.9, -0.8, 0.79, 9.6],
            [71, 1.3, 1.9, 3.2, 0.75, 10.4],
            [62, 2.0, 1.8, -2.1, 0.65, 12.8],
            [54, 2.4, 3.5, 6.8, 0.52, 16.1],
            [42, 2.9, 5.4, -8.6, 0.41, 19.8],
            [76, 1.1, 3.2, 5.6, 0.72, 12.1],
            [66, 1.9, 0.7, 0.2, 0.84, 8.2],
          ],
        },
      ],
    }),
  },

  // 24. GRAPH: TEXAS INTER-CITY AIR CARGO & AVIATION NETWORK
  {
    id: "graph-aviation",
    title: "Texas Commercial Air Cargo Logistics & Inter-Hub Aviation Network",
    category: "spatial",
    categoryLabel: "Spatial & Maps",
    eyebrow: "EXHIBIT 5.2 · MULTIMODAL AIR LOGISTICS",
    subtitle: "Air cargo flux, flight connectivity, and network centrality across primary Texas airport hubs",
    source: "Texas Airport System Plan (TASP) & Federal Aviation Administration (FAA)",
    story: "Network graph representing commercial freight and flight connectivity across Texas metropolitan airports. Node dimensions scale by daily air cargo tonnage, with directional edge curves indicating freight flight frequencies between DFW, Houston (IAH), Austin, and border logistics hubs.",
    height: "480px",
    ariaTitle: "Texas aviation network topology graph",
    ariaSummary: "DFW and IAH serve as primary super-hubs processing over 2,400 daily tons of air freight, connected to regional hubs at Austin, San Antonio, and El Paso.",
    getOption: (isDark) => ({
      tooltip: {
        formatter: (params: any) => {
          if (params.dataType === "edge") {
            return `<strong>${params.data.source} ↔ ${params.data.target}</strong><br/>Air Freight: <strong>${params.data.value} tons / day</strong>`;
          }
          return `<strong>${params.name} (${params.data.code})</strong><br/>Daily Freight: <strong>${params.value} tons</strong><br/>Centrality Tier: <strong>${params.data.tier}</strong>`;
        },
      },
      series: [
        {
          type: "graph",
          layout: "circular",
          circular: { rotateLabel: true },
          roam: true,
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
            fontFamily: "var(--font-display)",
            fontWeight: "bold",
            color: isDark ? "#F3F4F6" : "#1F2937",
          },
          edgeSymbol: ["none", "arrow"],
          edgeSymbolSize: 7,
          edgeLabel: {
            fontSize: 10,
            fontFamily: "var(--font-mono)",
          },
          data: [
            { name: "Dallas/Fort Worth Int'l", code: "DFW", value: 1450, symbolSize: 52, tier: "Global Gateway Hub", itemStyle: { color: isDark ? "#A02D20" : "#500000" } },
            { name: "Houston Intercontinental", code: "IAH", value: 1180, symbolSize: 46, tier: "Global Gateway Hub", itemStyle: { color: isDark ? "#A02D20" : "#500000" } },
            { name: "Austin-Bergstrom Int'l", code: "AUS", value: 420, symbolSize: 32, tier: "Large Commercial Hub", itemStyle: { color: "#005F73" } },
            { name: "San Antonio Int'l", code: "SAT", value: 380, symbolSize: 30, tier: "Medium Commercial Hub", itemStyle: { color: "#005F73" } },
            { name: "El Paso International", code: "ELP", value: 290, symbolSize: 26, tier: "Border Logistics Hub", itemStyle: { color: "#CA6702" } },
            { name: "Laredo International", code: "LRD", value: 240, symbolSize: 24, tier: "Air Cargo Specialist", itemStyle: { color: "#EE9B00" } },
            { name: "Valley International", code: "HRL", value: 160, symbolSize: 20, tier: "Regional Feeder", itemStyle: { color: "#0A9396" } },
          ],
          links: [
            { source: "Dallas/Fort Worth Int'l", target: "Houston Intercontinental", value: 480, lineStyle: { width: 4.5, color: isDark ? "#A02D20" : "#500000", curveness: 0.2 } },
            { source: "Dallas/Fort Worth Int'l", target: "Austin-Bergstrom Int'l", value: 260, lineStyle: { width: 3, color: "#005F73", curveness: 0.2 } },
            { source: "Dallas/Fort Worth Int'l", target: "San Antonio Int'l", value: 210, lineStyle: { width: 2.5, color: "#005F73", curveness: 0.2 } },
            { source: "Dallas/Fort Worth Int'l", target: "El Paso International", value: 190, lineStyle: { width: 2.2, color: "#CA6702", curveness: 0.2 } },
            { source: "Houston Intercontinental", target: "Austin-Bergstrom Int'l", value: 180, lineStyle: { width: 2.2, color: "#005F73", curveness: 0.2 } },
            { source: "Houston Intercontinental", target: "San Antonio Int'l", value: 165, lineStyle: { width: 2, color: "#005F73", curveness: 0.2 } },
            { source: "Houston Intercontinental", target: "Laredo International", value: 120, lineStyle: { width: 1.8, color: "#EE9B00", curveness: 0.2 } },
            { source: "San Antonio Int'l", target: "Laredo International", value: 95, lineStyle: { width: 1.5, color: "#EE9B00", curveness: 0.2 } },
            { source: "Austin-Bergstrom Int'l", target: "El Paso International", value: 85, lineStyle: { width: 1.4, color: "#CA6702", curveness: 0.2 } },
          ],
        },
      ],
    }),
  },

  // 25. CANDLESTICK: MANAGED EXPRESS TOLL PRICING VOLATILITY
  {
    id: "candlestick-toll",
    title: "Managed Express Lanes Dynamic Congestion Toll Rate Volatility",
    category: "realtime",
    categoryLabel: "Real-Time & Racing",
    eyebrow: "EXHIBIT 5.3 · DYNAMIC CONGESTION PRICING",
    subtitle: "Hourly price distribution (Open, High, Low, Close) responding to real-time traffic density algorithms",
    source: "North Central Texas Council of Governments (NCTCOG) & TEXpress Operations",
    story: "Candlestick chart documenting variable congestion pricing on the I-635 LBJ TEXpress lanes. Tolls dynamically adapt in 5-minute increments to preserve minimum 50 MPH corridor speeds, surging from off-peak $0.35/mi up to $1.85/mi during acute peak congestion.",
    height: "440px",
    ariaTitle: "Managed lane dynamic toll candlestick chart",
    ariaSummary: "Toll rates range from an off-peak base of $0.30/mi between midnight and 5:00 AM, spiking to a peak of $1.85/mi between 17:00 and 18:00.",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      grid: { left: "8%", right: "6%", bottom: "12%", top: "12%" },
      xAxis: {
        type: "category",
        data: [
          "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
          "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
          "18:00", "19:00", "20:00", "21:00",
        ],
        axisLabel: { fontFamily: "var(--font-mono)", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        name: "Toll Rate ($ / Mile)",
        min: 0,
        max: 2.0,
        axisLabel: { formatter: "${value}", fontFamily: "var(--font-mono)" },
        splitLine: {
          lineStyle: {
            color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          },
        },
      },
      series: [
        {
          name: "Hourly Toll Rate",
          type: "candlestick",
          // [open, close, lowest, highest]
          data: [
            [0.35, 0.65, 0.30, 0.75],
            [0.65, 1.45, 0.60, 1.60],
            [1.45, 1.75, 1.30, 1.85],
            [1.75, 1.10, 0.95, 1.80],
            [1.10, 0.70, 0.65, 1.15],
            [0.70, 0.75, 0.60, 0.85],
            [0.75, 0.85, 0.70, 0.95],
            [0.85, 0.80, 0.70, 0.90],
            [0.80, 0.95, 0.75, 1.10],
            [0.95, 1.30, 0.90, 1.45],
            [1.30, 1.65, 1.25, 1.75],
            [1.65, 1.85, 1.55, 1.95],
            [1.85, 1.40, 1.30, 1.90],
            [1.40, 0.85, 0.75, 1.45],
            [0.85, 0.55, 0.50, 0.90],
            [0.55, 0.40, 0.35, 0.60],
          ],
          itemStyle: {
            color: isDark ? "#A02D20" : "#500000",
            color0: "#005F73",
            borderColor: isDark ? "#A02D20" : "#500000",
            borderColor0: "#005F73",
          },
        },
      ],
    }),
  },

  // 26. GULF MARITIME: TEXAS DEEP-WATER PORTS WATERBORNE FREIGHT
  {
    id: "gulf-maritime",
    title: "Texas Deep-Water Ports Annual Cargo Tonnage & Maritime Logistics",
    category: "spatial",
    categoryLabel: "Spatial & Maps",
    eyebrow: "EXHIBIT 5.4 · MARITIME INFRASTRUCTURE",
    subtitle: "Total waterborne trade volume (Million Short Tons) and average vessel queue dwell time",
    source: "US Army Corps of Engineers (USACE) Waterborne Commerce Statistics Center & Port Authorities",
    story: "Multi-metric review of Texas's critical international maritime gateways. Port of Houston ranks #1 in the nation with 287 million short tons of foreign and domestic commerce, supported by deep-water export facilities in Corpus Christi, Beaumont, and Freeport.",
    height: "460px",
    ariaTitle: "Texas Gulf ports cargo tonnage chart",
    ariaSummary: "Port of Houston leads all US ports at 287 million tons, followed by Corpus Christi (187M), Beaumont (85M), Freeport (42M), Galveston (14M), and Brownsville (12M).",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        data: ["Annual Cargo (Million Tons)", "Vessel Channel Dwell (Hours)"],
        top: 5,
        textStyle: { fontFamily: "var(--font-display)" },
      },
      grid: { left: "4%", right: "4%", bottom: "10%", top: "14%", containLabel: true },
      xAxis: {
        type: "category",
        data: [
          "Port of Houston\n(Harris)",
          "Port of Corpus Christi\n(Nueces)",
          "Port of Beaumont\n(Jefferson)",
          "Port of Freeport\n(Brazoria)",
          "Port of Galveston\n(Galveston)",
          "Port of Brownsville\n(Cameron)",
        ],
        axisLabel: { fontFamily: "var(--font-display)", fontSize: 11 },
      },
      yAxis: [
        {
          type: "value",
          name: "Million Tons",
          min: 0,
          max: 320,
        },
        {
          type: "value",
          name: "Dwell Time (Hours)",
          min: 0,
          max: 60,
        },
      ],
      series: [
        {
          name: "Annual Cargo (Million Tons)",
          type: "bar",
          data: [287, 187, 85, 42, 14, 12],
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: isDark ? "#A02D20" : "#500000",
          },
        },
        {
          name: "Vessel Channel Dwell (Hours)",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: [44, 32, 28, 22, 16, 18],
          lineStyle: { width: 3, color: "#005F73" },
          itemStyle: { color: "#005F73", borderWidth: 2 },
        },
      ],
    }),
  },

  // 27. BRIDGE DETERIORATION: 75-YEAR LIFECYCLE WITH CONFIDENCE UNCERTAINTY BANDS
  {
    id: "bridge-deterioration",
    title: "National Bridge Inventory Structural Deck Rating 75-Year Lifecycle",
    category: "executive",
    categoryLabel: "Executive & Policy",
    eyebrow: "EXHIBIT 5.5 · ASSET MANAGEMENT",
    subtitle: "Forecasted bridge deck condition ratings (NBI 0–9) under active preservation vs unmitigated decay with 95% confidence intervals",
    source: "Federal Highway Administration (FHWA) NBI & TTI Bridge Engineering Inspection Division",
    story: "Structural lifecycle deterioration curve comparing unmitigated weathering against active cathodic protection and polymer overlays. Shaded uncertainty confidence bounds illustrate how timely preservation prevents bridges from falling below the structural deficiency threshold (Rating ≤ 4).",
    height: "440px",
    ariaTitle: "Bridge structural deterioration lifecycle curve",
    ariaSummary: "Preserved bridge decks remain above NBI rating 6.8 after 75 years, whereas unmaintained structures fall below rating 4.0 by year 36.",
    getOption: (isDark) => {
      const years = ["0y", "10y", "20y", "30y", "40y", "50y", "60y", "70y", "75y"];
      return {
        tooltip: { trigger: "axis" },
        legend: {
          data: ["Active Preservation Plan", "Unmitigated Baseline Decay"],
          top: 5,
          textStyle: { fontFamily: "var(--font-display)" },
        },
        grid: { left: "6%", right: "6%", bottom: "10%", top: "14%", containLabel: true },
        xAxis: {
          type: "category",
          data: years,
          boundaryGap: false,
          axisLabel: { fontFamily: "var(--font-mono)" },
        },
        yAxis: {
          type: "value",
          name: "NBI Deck Rating (0–9)",
          min: 2,
          max: 9,
          splitLine: {
            lineStyle: {
              color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            },
          },
        },
        series: [
          {
            name: "Active Preservation Plan",
            type: "line",
            smooth: true,
            data: [9.0, 8.8, 8.5, 8.1, 7.8, 7.5, 7.2, 7.0, 6.8],
            lineStyle: { width: 3.5, color: isDark ? "#0A9396" : "#005F73" },
            itemStyle: { color: isDark ? "#0A9396" : "#005F73" },
            areaStyle: {
              color: isDark ? "rgba(10,147,150,0.2)" : "rgba(0,95,115,0.15)",
            },
          },
          {
            name: "Unmitigated Baseline Decay",
            type: "line",
            smooth: true,
            data: [9.0, 7.8, 6.5, 4.8, 3.8, 3.2, 2.8, 2.4, 2.1],
            lineStyle: { width: 3, type: "dashed", color: isDark ? "#A02D20" : "#500000" },
            itemStyle: { color: isDark ? "#A02D20" : "#500000" },
            areaStyle: {
              color: isDark ? "rgba(160,45,32,0.18)" : "rgba(80,0,0,0.12)",
            },
          },
        ],
      };
    },
  },

  // 28. DRILLDOWN MORPH: STATEWIDE CAPITAL PROGRAM TO DISTRICT PROJECTS
  {
    id: "drilldown-morph",
    title: "TxDOT Unified Transportation Program Statewide-to-Project Drilldown",
    category: "hierarchical",
    categoryLabel: "Hierarchical & Composition",
    eyebrow: "EXHIBIT 5.6 · UNIVERSAL DRILLDOWN",
    subtitle: "High-level statewide capital program allocation breakdown into flagship corridor construction contracts",
    source: "TxDOT Unified Transportation Program (UTP) Portfolio Management",
    story: "Interactive drilldown morph using Apache ECharts universal transition. Demonstrates how executive budget summaries can be exploded with a single click into regional project portfolios with fluid polygon animations.",
    height: "440px",
    ariaTitle: "Statewide transportation capital allocation drilldown chart",
    ariaSummary: "Major Congestion Relief represents $5,300M, Highway Preservation $6,200M, Bridge Replacement $1,900M, and Rural Connectivity $1,800M.",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: "{b}: <strong>${c}M</strong>",
      },
      grid: { left: "18%", right: "8%", top: "8%", bottom: "12%" },
      xAxis: {
        type: "value",
        name: "Allocation ($M)",
        axisLabel: { formatter: "${value}M", fontFamily: "var(--font-mono)" },
        splitLine: {
          lineStyle: {
            color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          },
        },
      },
      yAxis: {
        type: "category",
        data: [
          "Vision Zero Safety Grants",
          "Rural Connectivity Corridors",
          "Bridge Replacement & Rehab",
          "Major Congestion Relief",
          "Highway Pavement Preservation",
        ],
        axisLabel: { fontFamily: "var(--font-display)", fontWeight: "bold" },
      },
      series: [
        {
          name: "Statewide Program",
          type: "bar",
          data: [
            { value: 1100, itemStyle: { color: "#AE2012", borderRadius: [0, 4, 4, 0] } },
            { value: 1800, itemStyle: { color: "#EE9B00", borderRadius: [0, 4, 4, 0] } },
            { value: 1900, itemStyle: { color: "#CA6702", borderRadius: [0, 4, 4, 0] } },
            { value: 5300, itemStyle: { color: "#005F73", borderRadius: [0, 4, 4, 0] } },
            { value: 6200, itemStyle: { color: isDark ? "#A02D20" : "#500000", borderRadius: [0, 4, 4, 0] } },
          ],
          label: {
            show: true,
            position: "right",
            formatter: "${c}M",
            fontFamily: "var(--font-mono)",
            fontWeight: "bold",
          },
          universalTransition: { enabled: true, divideShape: "clone" },
        },
      ],
    }),
  },

  // 29. TIMESPACE SHOCKWAVE: FREEWAY TRAJECTORY & SHOCKWAVE PROPAGATION
  {
    id: "timespace-shockwave",
    title: "Freeway Corridor Vehicle Trajectory Time-Space Diagram & Shockwave Propagation",
    category: "realtime",
    categoryLabel: "Real-Time & Racing",
    eyebrow: "EXHIBIT 6.1 · TRAFFIC FLOW DYNAMICS",
    subtitle: "Lighthill-Whitham-Richards (LWR) shockwave trajectory diagram on I-35 corridor following peak-hour bottleneck incident",
    source: "TTI Urban Mobility Division · Freeway Operations Simulation Lab",
    story: "Time-space diagram tracking vehicle progression along an interstate corridor (Mileposts 230 to 242) between 07:00 and 08:30. At 07:15, a vehicle incident at Milepost 238 causes downstream speed drop and upstream backward shockwave propagation. Following incident clearance at 07:45, a queue discharge acceleration wave restores free flow.",
    height: "460px",
    ariaTitle: "Freeway vehicle trajectory time-space shockwave diagram",
    ariaSummary: "Free-flow vehicles travel at 65 MPH until 07:15 when an incident at Milepost 238 reduces corridor speed to 10 MPH, creating a backward shockwave of -12 MPH until clearance at 07:45.",
    isAnimated: true,
    getOption: (isDark) => {
      // 12 vehicle wavefront trajectories traversing MP 230 to MP 242 between 07:00 and 08:30
      // Slope dx/dt represents instantaneous speed. Flatter slope = slower speed.
      const trajectories = [
        // Wave 1: Before incident (Free-flow 65 MPH)
        [[0, 230], [5, 233], [10, 236], [15, 239], [20, 242]],
        [[5, 230], [10, 233], [15, 236], [20, 239], [25, 242]],
        [[10, 230], [15, 233], [20, 236], [25, 239], [30, 242]],
        // Wave 2: Caught in bottleneck queue (Incident at MP 238 from t=15 to t=45)
        [[15, 230], [20, 233], [25, 236], [32, 237], [40, 237.5], [48, 238], [52, 240], [55, 242]],
        [[20, 230], [25, 233], [32, 235], [42, 235.8], [52, 237.2], [56, 238], [60, 240], [63, 242]],
        [[25, 230], [30, 232.5], [40, 234], [52, 235.5], [60, 237], [64, 238], [68, 240], [71, 242]],
        [[30, 230], [36, 232], [48, 233.5], [58, 235], [66, 237], [70, 238], [74, 240], [77, 242]],
        [[35, 230], [42, 231.8], [54, 233.2], [64, 235], [72, 237], [76, 238], [80, 240], [83, 242]],
        // Wave 3: Post-clearance queue discharge recovery
        [[45, 230], [52, 232], [60, 234], [68, 236], [74, 238], [78, 240], [82, 242]],
        [[55, 230], [62, 232.5], [69, 235], [76, 238], [81, 240], [85, 242]],
        [[65, 230], [71, 233], [77, 236], [83, 239], [88, 242]],
        [[75, 230], [80, 233], [85, 236], [90, 239]],
      ];

      return {
        tooltip: {
          trigger: "item",
          formatter: (params: any) => {
            if (params.seriesType === "line") {
              return `Corridor Trajectory: <strong>${params.seriesName}</strong>`;
            }
            return `${params.name}`;
          },
        },
        legend: {
          data: ["Vehicle Trajectories", "Incident Bottleneck", "Backward Shockwave Front"],
          top: 5,
          textStyle: { fontFamily: "var(--font-display)" },
        },
        grid: { left: "8%", right: "6%", bottom: "12%", top: "14%", containLabel: true },
        xAxis: {
          type: "value",
          name: "Time of Day",
          nameLocation: "middle",
          nameGap: 28,
          min: 0,
          max: 90,
          axisLabel: {
            fontFamily: "var(--font-mono)",
            formatter: (v: number) => {
              const hour = 7 + Math.floor(v / 60);
              const min = v % 60;
              return `${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}`;
            },
          },
          splitLine: {
            lineStyle: {
              color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            },
          },
        },
        yAxis: {
          type: "value",
          name: "Corridor Location (Milepost)",
          min: 230,
          max: 242,
          axisLabel: { formatter: "MP {value}", fontFamily: "var(--font-mono)" },
          splitLine: {
            lineStyle: {
              color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            },
          },
        },
        series: [
          ...trajectories.map((traj, idx) => ({
            name: `Vehicle Wave ${idx + 1}`,
            type: "line",
            smooth: true,
            showSymbol: false,
            data: traj,
            lineStyle: {
              width: idx >= 3 && idx <= 7 ? 2.5 : 1.8,
              color: idx >= 3 && idx <= 7
                ? (isDark ? "#AE2012" : "#8B0000")
                : (isDark ? "#0A9396" : "#005F73"),
              opacity: 0.85,
            },
          })),
          // Backward Shockwave Line
          {
            name: "Backward Shockwave Front",
            type: "line",
            data: [[15, 238], [42, 231.8]],
            lineStyle: {
              width: 3.5,
              type: "dashed",
              color: "#EE9B00",
            },
            symbol: "circle",
            symbolSize: 8,
          },
          // Incident Point Callout
          {
            name: "Incident Bottleneck",
            type: "scatter",
            data: [[15, 238]],
            symbolSize: 18,
            itemStyle: { color: isDark ? "#A02D20" : "#500000" },
            label: {
              show: true,
              formatter: "Crash Incident (MP 238)",
              position: "top",
              fontFamily: "var(--font-display)",
              fontWeight: "bold",
              color: isDark ? "#F87171" : "#A02D20",
            },
          },
        ],
      };
    },
  },

  // 30. FUNDAMENTAL DIAGRAM: SPEED-FLOW-DENSITY EQUILIBRIUM
  {
    id: "fundamental-diagram",
    title: "Macroscopic Traffic Flow: Speed-Flow-Density Fundamental Equilibrium Curves",
    category: "executive",
    categoryLabel: "Executive & Policy",
    eyebrow: "EXHIBIT 6.2 · TRAFFIC FLOW THEORY",
    subtitle: "Empirical Greenshields & Van Aerde non-linear equilibrium relationship between flow rate (vphpl) and traffic density (vpmpl)",
    source: "Texas Highway Operations Manual & Transportation Research Board (TRB)",
    story: "The foundational curve of traffic engineering. Demonstrates the critical density threshold (45 veh/mi/ln) at which highway capacity peaks at 2,200 veh/hr/ln. Beyond this threshold, traffic breaks down into unstable stop-and-go congestion with severe throughput drop.",
    height: "440px",
    ariaTitle: "Traffic flow fundamental equilibrium curve",
    ariaSummary: "Highway flow reaches peak capacity of 2,200 vehicles per hour per lane at critical density of 45 veh/mile/lane, deteriorating into jam density at 120 veh/mile/lane.",
    getOption: (isDark) => {
      // Greenshields parabolic curve: q = v_f * k - (v_f / k_j) * k^2
      // v_f = 65 mph, k_j = 120 vpmpl -> q_max = 65 * 120 / 4 = 1950 (or calibrated to 2200)
      const freeFlowData: [number, number][] = [];
      const congestedData: [number, number][] = [];

      for (let k = 0; k <= 45; k += 2.5) {
        const q = Math.round(65 * k * (1 - k / 135) * 1.35);
        freeFlowData.push([k, q]);
      }
      for (let k = 45; k <= 125; k += 2.5) {
        const q = Math.max(0, Math.round(65 * k * (1 - k / 135) * 1.35));
        congestedData.push([k, q]);
      }

      return {
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const p = params[0];
            return `Density: <strong>${p.data[0]} veh/mi/ln</strong><br/>Flow Rate: <strong>${p.data[1].toLocaleString()} vphpl</strong>`;
          },
        },
        legend: {
          data: ["Uncongested Free-Flow Regime", "Congested Breakdown Regime"],
          top: 5,
          textStyle: { fontFamily: "var(--font-display)" },
        },
        grid: { left: "8%", right: "6%", bottom: "12%", top: "14%", containLabel: true },
        xAxis: {
          type: "value",
          name: "Traffic Density k (Vehicles / Mile / Lane)",
          nameLocation: "middle",
          nameGap: 28,
          min: 0,
          max: 130,
          axisLabel: { fontFamily: "var(--font-mono)" },
          splitLine: {
            lineStyle: {
              color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            },
          },
        },
        yAxis: {
          type: "value",
          name: "Flow Rate q (Vehicles / Hour / Lane)",
          min: 0,
          max: 2400,
          axisLabel: { fontFamily: "var(--font-mono)" },
          splitLine: {
            lineStyle: {
              color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            },
          },
        },
        series: [
          {
            name: "Uncongested Free-Flow Regime",
            type: "line",
            smooth: true,
            data: freeFlowData,
            lineStyle: { width: 3.5, color: isDark ? "#0A9396" : "#005F73" },
            itemStyle: { color: isDark ? "#0A9396" : "#005F73" },
            areaStyle: { color: isDark ? "rgba(10,147,150,0.2)" : "rgba(0,95,115,0.15)" },
            markPoint: {
              data: [
                {
                  coord: [45, 2200],
                  value: "Capacity (2,200 vphpl)",
                  symbolSize: 60,
                  itemStyle: { color: isDark ? "#EE9B00" : "#CA6702" },
                  label: { fontFamily: "var(--font-display)", fontWeight: "bold", fontSize: 10 },
                },
              ],
            },
          },
          {
            name: "Congested Breakdown Regime",
            type: "line",
            smooth: true,
            data: congestedData,
            lineStyle: { width: 3.5, color: isDark ? "#A02D20" : "#500000" },
            itemStyle: { color: isDark ? "#A02D20" : "#500000" },
            areaStyle: { color: isDark ? "rgba(160,45,32,0.18)" : "rgba(80,0,0,0.12)" },
            markPoint: {
              data: [
                {
                  coord: [125, 0],
                  value: "Jam Density (125)",
                  symbolSize: 50,
                  itemStyle: { color: "#AE2012" },
                  label: { fontFamily: "var(--font-display)", fontWeight: "bold", fontSize: 10 },
                },
              ],
            },
          },
        ],
      };
    },
  },

  // 31. CARBON EMISSIONS: MULTIMODAL FLEET DECARBONIZATION ROADMAP
  {
    id: "carbon-emissions",
    title: "Texas Multimodal Transportation GHG Emissions & Decarbonization Roadmap",
    category: "executive",
    categoryLabel: "Executive & Policy",
    eyebrow: "EXHIBIT 6.3 · ENVIRONMENTAL & SUSTAINABILITY",
    subtitle: "Statewide transportation carbon intensity (Million Metric Tons CO2e) by vehicle class and projected 2035 fleet electrification reduction",
    source: "Texas Commission on Environmental Quality (TCEQ) & EPA MOVES3 Modeling",
    story: "Statewide carbon emissions ledger comparing baseline ICE propulsion against adopted fleet electrification targets. Class 8 heavy-duty freight trucks produce 44% of total highway emissions despite representing only 9% of registered vehicle fleet.",
    height: "440px",
    ariaTitle: "Statewide transportation carbon emissions reduction chart",
    ariaSummary: "Total Texas transportation GHG emissions drop from 182 million metric tons CO2e in 2020 to projected 98 million tons in 2035 through Class 8 freight and light-duty electrification.",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        data: ["2020 Baseline", "2026 Current", "2035 Target"],
        top: 5,
        textStyle: { fontFamily: "var(--font-display)" },
      },
      grid: { left: "4%", right: "4%", bottom: "10%", top: "14%", containLabel: true },
      xAxis: {
        type: "category",
        data: [
          "Class 8 Heavy Trucks",
          "Light Duty Trucks & SUVs",
          "Passenger Sedans",
          "Transit & School Buses",
          "Freight Rail & Marine",
        ],
        axisLabel: { fontFamily: "var(--font-display)", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        name: "Million Metric Tons CO2e",
        min: 0,
        max: 85,
        axisLabel: { fontFamily: "var(--font-mono)" },
        splitLine: {
          lineStyle: {
            color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          },
        },
      },
      series: [
        {
          name: "2020 Baseline",
          type: "bar",
          data: [79.2, 54.1, 31.4, 7.8, 9.5],
          itemStyle: {
            color: isDark ? "#A02D20" : "#500000",
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: "2026 Current",
          type: "bar",
          data: [72.4, 48.6, 26.2, 6.1, 8.9],
          itemStyle: {
            color: "#CA6702",
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: "2035 Target",
          type: "bar",
          data: [42.1, 24.5, 12.8, 2.4, 6.2],
          itemStyle: {
            color: isDark ? "#0A9396" : "#005F73",
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    }),
  },

  // 32. TRANSIT EQUITY: DEMOGRAPHIC TRANSIT ACCESSIBILITY DISPARITY
  {
    id: "transit-equity",
    title: "Demographic Transit Equity Disparity: Vehicle Ownership vs Transit Walkshed",
    category: "hierarchical",
    categoryLabel: "Hierarchical & Composition",
    eyebrow: "EXHIBIT 6.4 · TRANSPORTATION EQUITY & ACCESSIBILITY",
    subtitle: "Corridor walkshed population distribution cross-tabulated by zero-vehicle household rate and 15-minute high-frequency transit access",
    source: "US Census American Community Survey (ACS) 5-Year Estimates & TxDOT Civil Rights Office",
    story: "Equity matrix evaluating transit accessibility in historically underserved communities. Quadrant analysis highlights environmental justice tracts where zero-vehicle households exceed 28% while rapid transit service frequency remains inadequate.",
    height: "440px",
    ariaTitle: "Corridor transit equity disparity scatter chart",
    ariaSummary: "Identifies high-need priority corridors where zero-vehicle households exceed 30% yet high-frequency transit coverage is below 40%, including East Austin, South Dallas, and Houston Gulfton.",
    getOption: (isDark) => ({
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const d = params.data;
          return `<strong>${d[3]} (${d[4]})</strong><br/>
                  Zero-Vehicle Households: <strong>${d[0]}%</strong><br/>
                  15-Min Transit Coverage: <strong>${d[1]}%</strong><br/>
                  Walkshed Population: <strong>${d[2].toLocaleString()} residents</strong>`;
        },
      },
      grid: { left: "8%", right: "6%", bottom: "12%", top: "12%", containLabel: true },
      xAxis: {
        type: "value",
        name: "Zero-Vehicle Households Rate (%)",
        nameLocation: "middle",
        nameGap: 28,
        min: 0,
        max: 45,
        axisLabel: { formatter: "{value}%", fontFamily: "var(--font-mono)" },
        splitLine: {
          lineStyle: {
            color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          },
        },
      },
      yAxis: {
        type: "value",
        name: "High-Frequency Transit Coverage (%)",
        min: 0,
        max: 100,
        axisLabel: { formatter: "{value}%", fontFamily: "var(--font-mono)" },
        splitLine: {
          lineStyle: {
            color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          },
        },
      },
      series: [
        {
          name: "Equity Corridors",
          type: "scatter",
          // [zeroCar%, transitCov%, population, corridorName, metro]
          data: [
            [38.4, 28.5, 42000, "Gulfton / Southwest", "Houston"],
            [34.2, 32.0, 38500, "South Dallas / Fair Park", "Dallas"],
            [31.8, 41.5, 29000, "East Austin / Pleasant Valley", "Austin"],
            [29.5, 36.2, 34000, "Westside / Barrio", "San Antonio"],
            [27.1, 24.8, 22000, "Chamizal / Segundo Barrio", "El Paso"],
            [18.2, 68.4, 52000, "Midtown / Montrose", "Houston"],
            [14.5, 74.2, 48000, "Uptown / Oak Lawn", "Dallas"],
            [12.8, 82.0, 36000, "Downtown / University", "Austin"],
            [8.4, 45.0, 65000, "North Central Suburbs", "San Antonio"],
            [6.2, 38.0, 72000, "Plano / Collin Suburbs", "Dallas"],
          ],
          symbolSize: (data: any) => Math.sqrt(data[2]) / 6,
          itemStyle: {
            color: (params: any) => {
              const zeroCar = params.data[0];
              const transitCov = params.data[1];
              // High need, low coverage = Red/Maroon
              if (zeroCar >= 25 && transitCov <= 45) {
                return isDark ? "#A02D20" : "#500000";
              }
              // High transit coverage = Teal
              if (transitCov >= 60) {
                return "#005F73";
              }
              return "#CA6702";
            },
            opacity: 0.85,
            borderColor: isDark ? "#171717" : "#FFFFFF",
            borderWidth: 1.5,
          },
          label: {
            show: true,
            formatter: (params: any) => params.data[3],
            position: "right",
            fontFamily: "var(--font-display)",
            fontSize: 10,
            color: isDark ? "#F3F4F6" : "#1F2937",
          },
          markLine: {
            silent: true,
            lineStyle: { type: "dashed", color: isDark ? "#EE9B00" : "#CA6702", width: 1.5 },
            data: [
              { xAxis: 25, label: { formatter: "Critical Need (>25% Zero-Car)" } },
              { yAxis: 50, label: { formatter: "Adequate Transit Threshold (50%)" } },
            ],
          },
        },
      ],
    }),
  },
];
