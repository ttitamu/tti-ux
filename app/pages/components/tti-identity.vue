<script setup lang="ts">
useHead({ title: "TTI identity cluster · TUX" });

const sampleResearcher = {
  name: "Maria Hassan",
  role: "Senior Research Scientist",
  center: "Roadway Safety Division",
  orcid: "0000-0002-1234-5678",
  email: "mhassan@tti.tamu.edu",
  bio: "Rural-roadway safety; long-term evaluation of infrastructure treatments. 18 years at TTI.",
  metrics: [
    { label: "h-index", value: 24 },
    { label: "Active grants", value: 3 },
    { label: "Publications", value: 87 },
  ],
  projects: [
    { eyebrow: "TxDOT", title: "0-7042: Rural intersection treatments, 36-mo follow-up", to: "#" },
    { eyebrow: "FHWA", title: "HRDS-30: Connected-vehicle safety pilot, DFW corridor", to: "#" },
  ],
};

const sampleLab = {
  name: "TTI MovementLab",
  summary: "Continuous corridor instrumentation + analytics for freight, passenger, and equity-weighted mobility research.",
  location: "Bryan, TX",
  focus: ["Mobility", "Freight", "Connected vehicles"],
  projectsCount: 24,
  peopleCount: 18,
  leaders: [
    { name: "R. Chen", role: "Director", to: "#" },
    { name: "L. Velazquez", role: "Deputy Director", to: "#" },
  ],
};

const sampleProgram = {
  name: "Equity-Weighted Mobility Outcomes",
  eyebrow: "Active program · 2024-2027",
  summary: "DOT performance frameworks that surface equity outcomes alongside efficiency metrics. Validated across three years of corridor data.",
  leads: ["M. Hassan", "L. Velazquez"],
  funders: ["FHWA", "TxDOT", "Bloomberg Philanthropies"],
  metrics: [
    { label: "Publications", value: 12 },
    { label: "Datasets",     value: 8  },
    { label: "Sites",        value: 412 },
  ],
};
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="components · TTI identity cluster" title="TTI identity">
      Five profile-shaped components for surfacing TTI people, labs,
      programs, and funders. Plus the center-badge marker that signals
      which TTI center owns a piece of content.
    </TuxPageHeader>

    <section class="space-y-3">
      <p class="eyebrow">researchers</p>
      <h2 class="heading--bold text-xl font-bold">TuxResearcher · default layout</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Researcher profile card with portrait + name + role + ORCID +
        affiliations + metrics + selected projects + contact links.
        Three layouts: <strong>default</strong> (vertical),
        <strong>horizontal</strong> (portrait left), <strong>inline</strong>
        (compact, for "mentioned in prose" surfaces).
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TuxResearcher v-bind="sampleResearcher" />
        <TuxResearcher
          v-bind="sampleResearcher"
          name="Ricardo Chen"
          role="Director, MovementLab"
          orcid="0000-0001-2345-6789"
          email="rchen@tti.tamu.edu"
          bio="Director of TTI MovementLab. Connected-vehicle pilots + corridor instrumentation."
        />
        <TuxResearcher
          v-bind="sampleResearcher"
          name="Luna Velazquez"
          role="Associate Research Scientist"
          orcid="0000-0001-9999-8888"
          email="lvelazquez@tti.tamu.edu"
          bio="Equity-weighted mobility analytics + DOT performance frameworks."
        />
      </div>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">researchers · horizontal + inline</p>
      <h2 class="heading--bold text-xl font-bold">Layout variants</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TuxResearcher v-bind="sampleResearcher" layout="horizontal" />
        <div class="space-y-2 p-3 border border-surface-border rounded-md">
          <p class="text-sm text-text-secondary mb-2">
            Inline form used in body prose / sidebars:
          </p>
          <TuxResearcher v-bind="sampleResearcher" layout="inline" />
          <TuxResearcher
            v-bind="sampleResearcher"
            name="Ricardo Chen"
            role="Director, MovementLab"
            layout="inline"
          />
          <TuxResearcher
            v-bind="sampleResearcher"
            name="Luna Velazquez"
            role="Associate Research Scientist"
            layout="inline"
          />
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">labs / centers</p>
      <h2 class="heading--bold text-xl font-bold">TuxLab</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        "What is this lab and who runs it" card. Logo + name +
        summary + focus tags + headline stats + leadership row.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TuxLab v-bind="sampleLab" />
        <TuxLab
          v-bind="sampleLab"
          name="TTI Roadway Safety Division"
          summary="Long-term evaluation of rural + urban roadway infrastructure treatments. Pre/post field studies; signage, geometry, and signal interventions."
          location="Riverside Campus, Bryan TX"
          :focus="['Safety', 'Rural roadways', 'Field studies']"
          :projects-count="36"
          :people-count="42"
          :leaders="[
            { name: 'M. Hassan',  role: 'Director' },
            { name: 'D. Park',    role: 'Field Operations Lead' },
            { name: 'J. Kim',     role: 'Data Quality Lead' },
          ]"
        />
      </div>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">research programs</p>
      <h2 class="heading--bold text-xl font-bold">TuxProgram</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Mid-level identity card between Lab and individual project.
        Three layouts: <strong>default</strong>, <strong>compact</strong>
        (title + dek only), <strong>featured</strong> (large hero
        with overlaid title).
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TuxProgram v-bind="sampleProgram" />
        <TuxProgram v-bind="sampleProgram" layout="compact" />
      </div>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">funders</p>
      <h2 class="heading--bold text-xl font-bold">TuxFundingSource</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Inline funder badge — name + optional logo + optional grant
        number. Three sizes; chip or stacked layout. Wraps in a
        link when <code>to</code> is set.
      </p>
      <div class="flex flex-wrap gap-3 items-start">
        <TuxFundingSource funder="Federal Highway Administration" abbrev="FHWA" grant="HRDS-30-2022-04" />
        <TuxFundingSource funder="Texas Department of Transportation" abbrev="TxDOT" grant="0-7042" />
        <TuxFundingSource funder="National Science Foundation" abbrev="NSF" grant="2123456" />
        <TuxFundingSource funder="USDOT" grant="69A3552347142" />
      </div>
      <div class="flex flex-wrap gap-3 items-start mt-3">
        <TuxFundingSource funder="FHWA" size="sm" grant="HRDS-30" />
        <TuxFundingSource funder="TxDOT" size="sm" grant="0-7042" />
        <TuxFundingSource funder="NSF" size="lg" grant="NSF-2123456" />
      </div>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">center badges</p>
      <h2 class="heading--bold text-xl font-bold">TuxCenterBadge</h2>
      <p class="text-sm text-text-secondary max-w-3xl">
        Six canonical TTI center markers, each with a distinct tone
        from the chart palette. Use on article cards, search results,
        and content listings.
      </p>
      <div class="flex flex-wrap gap-2 items-center">
        <TuxCenterBadge center="mobility" />
        <TuxCenterBadge center="safety" />
        <TuxCenterBadge center="freight" />
        <TuxCenterBadge center="roadways" />
        <TuxCenterBadge center="policy" />
        <TuxCenterBadge center="operations" />
      </div>
      <p class="text-sm text-text-secondary max-w-3xl mt-3">
        Short form (smaller, tighter):
      </p>
      <div class="flex flex-wrap gap-2 items-center">
        <TuxCenterBadge center="mobility" short size="sm" />
        <TuxCenterBadge center="safety" short size="sm" />
        <TuxCenterBadge center="freight" short size="sm" />
        <TuxCenterBadge center="roadways" short size="sm" />
        <TuxCenterBadge center="policy" short size="sm" />
        <TuxCenterBadge center="operations" short size="sm" />
      </div>
    </section>
  </div>
</template>
