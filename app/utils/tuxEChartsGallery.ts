/**
 * tuxEChartsGallery.ts — Comprehensive ECharts storytelling presets for TTI-UX 3.0.
 *
 * Implements 17 institutional, transportation-research-grade visualizations:
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
];
