/**
 * tuxEChartsGallery.ts — Comprehensive ECharts storytelling presets for TTI-UX 3.0.
 *
 * Implements 22 institutional, transportation-research-grade visualizations:
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
      // 4 lanes of vehicle streams
      const linesData = [
        { coords: [[10, 80], [30, 80], [50, 75], [70, 70], [95, 70]] },
        { coords: [[10, 60], [30, 60], [50, 62], [70, 65], [95, 68]] },
        { coords: [[10, 40], [35, 42], [55, 48], [75, 52], [95, 55]] },
        { coords: [[10, 20], [35, 25], [55, 30], [75, 38], [95, 45]] },
      ];
      return {
        tooltip: { trigger: "none" },
        xAxis: { min: 0, max: 100, show: false },
        yAxis: { min: 0, max: 100, show: false },
        grid: { left: 10, right: 10, top: 10, bottom: 10 },
        series: [
          {
            type: "lines",
            coordinateSystem: "cartesian2d",
            polyline: true,
            data: linesData,
            lineStyle: {
              color: isDark ? "#333333" : "#E5E7EB",
              width: 14,
              opacity: 0.5,
              curveness: 0.2,
            },
          },
          {
            type: "lines",
            coordinateSystem: "cartesian2d",
            polyline: true,
            data: linesData,
            effect: {
              show: true,
              period: 3.5,
              trailLength: 0.6,
              symbol: "circle",
              symbolSize: 7,
              color: isDark ? "#EE9B00" : "#500000",
            },
            lineStyle: {
              color: "#005F73",
              width: 3,
              opacity: 0.8,
            },
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
];
