<script setup lang="ts">
useHead({ title: "Example · Center landing · TUX" });

const breadcrumb = [
  { label: "Home", to: "/" },
  { label: "Divisions", to: "#" },
  { label: "Mobility Division" },
];

const labDescription = {
  name: "Mobility Division",
  summary: "Connected and automated vehicles, freight operations, equity-weighted mobility outcomes. Continuous corridor instrumentation feeds both safety findings and operational dashboards.",
  location: "Bryan, TX · Riverside Campus",
  focus: ["Connected vehicles", "Freight", "Equity", "Corridor analytics"],
  projectsCount: 42,
  peopleCount: 68,
  leaders: [
    { name: "R. Chen", role: "Director, Mobility Division", to: "#" },
    { name: "L. Velazquez", role: "Deputy Director", to: "#" },
    { name: "D. Park", role: "Operations Lead", to: "#" },
  ],
};

const featuredResearchers = [
  {
    name: "Maria Hassan",
    role: "Senior Research Scientist",
    center: "Safety Division",
    orcid: "0000-0002-1234-5678",
    email: "mhassan@tti.tamu.edu",
    bio: "Rural roadway safety; long-term evaluation of infrastructure treatments. 18 years at TTI.",
    metrics: [
      { label: "h-index", value: 24 },
      { label: "Grants", value: 3 },
      { label: "Pubs", value: 87 },
    ],
    projects: [
      { eyebrow: "TxDOT", title: "0-7042: Rural intersection treatments", to: "#" },
      { eyebrow: "FHWA",  title: "HRDS-30: Connected-vehicle safety pilot", to: "#" },
    ],
  },
  {
    name: "Ricardo Chen",
    role: "Director, MovementLab",
    center: "Mobility Division",
    orcid: "0000-0001-2345-6789",
    email: "rchen@tti.tamu.edu",
    bio: "Director of TTI MovementLab. Connected-vehicle pilots + corridor instrumentation across the Texas Triangle.",
    metrics: [
      { label: "h-index", value: 31 },
      { label: "Grants", value: 5 },
      { label: "Pubs", value: 142 },
    ],
    projects: [
      { eyebrow: "USDOT", title: "Connected-vehicle SCP, DFW corridor", to: "#" },
      { eyebrow: "Bloomberg", title: "Equity-weighted mobility outcomes", to: "#" },
    ],
  },
  {
    name: "Luna Velazquez",
    role: "Associate Research Scientist",
    center: "Mobility Division",
    orcid: "0000-0001-9999-8888",
    email: "lvelazquez@tti.tamu.edu",
    bio: "Equity-weighted mobility analytics + DOT performance frameworks. Validated across three years of corridor data.",
    metrics: [
      { label: "h-index", value: 14 },
      { label: "Grants", value: 2 },
      { label: "Pubs", value: 38 },
    ],
    projects: [
      { eyebrow: "Bloomberg", title: "Equity-weighted mobility outcomes", to: "#" },
      { eyebrow: "TxDOT",     title: "Rural broadband + safety overlay", to: "#" },
    ],
  },
];

const programs = [
  {
    name: "Connected & Automated Vehicles",
    eyebrow: "Active · 2024-2027",
    summary: "Field-instrumented CAV pilots on the DFW corridor + I-35; sensor-fusion validation, safety performance under mixed traffic.",
    leads: ["R. Chen", "D. Park"],
    funders: ["USDOT", "TxDOT", "Toyota Research"],
    metrics: [
      { label: "Publications", value: 24 },
      { label: "Vehicles",     value: 142 },
      { label: "Corridor mi",  value: 412 },
    ],
  },
  {
    name: "Equity-Weighted Mobility Outcomes",
    eyebrow: "Active · 2024-2027",
    summary: "DOT performance frameworks that surface equity outcomes alongside efficiency metrics.",
    leads: ["M. Hassan", "L. Velazquez"],
    funders: ["FHWA", "TxDOT", "Bloomberg Philanthropies"],
    metrics: [
      { label: "Publications", value: 12 },
      { label: "Datasets",     value: 8  },
      { label: "Sites",        value: 412 },
    ],
  },
  {
    name: "Freight Network Resilience",
    eyebrow: "Active · 2025-2028",
    summary: "Port Houston, San Antonio, and Laredo freight network performance under disruption — supply-chain modeling + corridor instrumentation.",
    leads: ["R. Chen"],
    funders: ["USDOT", "Port Houston", "TxDOT"],
    metrics: [
      { label: "Ports",     value: 3 },
      { label: "Vehicles",  value: 280 },
      { label: "Datasets",  value: 14 },
    ],
  },
];
</script>

<template>
  <div class="space-y-10 max-w-6xl mx-auto py-8 px-4">
    <div class="example-demo-notice">
      <Icon name="lucide:layers" class="example-demo-notice__icon" aria-hidden="true" />
      <p class="example-demo-notice__text">
        <strong>Composition example.</strong>
        TTI center / division landing page using the identity cluster
        end-to-end — TuxLab as hero, TuxResearcher × 3 featured,
        TuxProgram × 3 active programs, TuxFundingSource strip, and
        TuxCenterBadge throughout. Maps to a real "Mobility Division
        landing page" shape.
      </p>
    </div>

    <TuxBreadcrumbs :trail="breadcrumb" />

    <!-- Page header with center badge eyebrow -->
    <div class="space-y-2">
      <TuxCenterBadge center="mobility" />
      <TuxPageHeader
        eyebrow="division · mobility"
        title="Mobility Division"
        rhythm="hero"
      >
        Connected and automated vehicles, freight operations,
        equity-weighted mobility outcomes. The division running the
        MovementLab corridor instrumentation network across the Texas
        Triangle.
      </TuxPageHeader>
    </div>

    <!-- Lab identity card — hero block -->
    <section>
      <TuxLab v-bind="labDescription" />
    </section>

    <!-- Featured researchers row -->
    <section class="space-y-3">
      <div class="flex items-end justify-between gap-4 flex-wrap">
        <TuxSectionHeader>Featured researchers</TuxSectionHeader>
        <NuxtLink to="#" class="link-tti text-sm">All 68 researchers →</NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 tux-mount-in tux-mount-in--stagger">
        <TuxResearcher
          v-for="(r, i) in featuredResearchers"
          v-bind="r"
          :key="r.name"
          :style="{ '--tux-mount-stagger-index': i }"
        />
      </div>
    </section>

    <!-- Active programs -->
    <section class="space-y-3">
      <div class="flex items-end justify-between gap-4 flex-wrap">
        <TuxSectionHeader>Active programs</TuxSectionHeader>
        <NuxtLink to="#" class="link-tti text-sm">All 42 programs →</NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TuxProgram
          v-for="p in programs"
          v-bind="p"
          :key="p.name"
        />
      </div>
    </section>

    <!-- Funding strip -->
    <section class="space-y-3">
      <TuxSectionHeader>Funding partners</TuxSectionHeader>
      <p class="text-sm text-text-secondary max-w-3xl">
        Mobility Division research is supported by federal,
        state, foundation, and industry partners. Grant numbers
        link to the funder's project page where available.
      </p>
      <div class="flex flex-wrap gap-3">
        <TuxFundingSource funder="Federal Highway Administration" abbrev="FHWA" grant="HRDS-30-2022-04" />
        <TuxFundingSource funder="USDOT" grant="69A3552347142" />
        <TuxFundingSource funder="Texas Department of Transportation" abbrev="TxDOT" grant="0-7042" />
        <TuxFundingSource funder="Port Houston" grant="PHA-MOB-2024" />
        <TuxFundingSource funder="National Science Foundation" abbrev="NSF" grant="2123456" />
        <TuxFundingSource funder="Toyota Research Institute" grant="TRI-MOB-2025-04" />
        <TuxFundingSource funder="Bloomberg Philanthropies" grant="BP-EQT-2024" />
      </div>
    </section>

    <!-- Other TTI divisions — cross-link via center badges -->
    <section class="space-y-3">
      <TuxSectionHeader>Across TTI</TuxSectionHeader>
      <p class="text-sm text-text-secondary max-w-3xl">
        Mobility works in partnership with the other five TTI
        divisions. Each handles a distinct research portfolio with
        its own programs and people.
      </p>
      <div class="flex flex-wrap gap-2">
        <NuxtLink to="#" class="link-tti">
          <TuxCenterBadge center="safety" />
        </NuxtLink>
        <NuxtLink to="#" class="link-tti">
          <TuxCenterBadge center="freight" />
        </NuxtLink>
        <NuxtLink to="#" class="link-tti">
          <TuxCenterBadge center="roadways" />
        </NuxtLink>
        <NuxtLink to="#" class="link-tti">
          <TuxCenterBadge center="policy" />
        </NuxtLink>
        <NuxtLink to="#" class="link-tti">
          <TuxCenterBadge center="operations" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
