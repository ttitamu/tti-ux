<script setup lang="ts">
/**
 * News Article Reader Page [slug].vue
 * Direct parity with MyTTI WordPress publications + EmDash CMS 1.0 reading features
 * and cutting-edge "AI Modern" research styles inspired by Google DeepMind, Anthropic, and OpenAI.
 * Includes interactive Hero Presentation Switcher to test and experience:
 *  - AI Modern (Luminous Aura, DeepMind/Anthropic meta, stats grid, and key findings)
 *  - Boxed (Kadence 16:9)
 *  - Full Bleed (Cinematic)
 *  - Split (Two-Column)
 *  - Inset Banner (Panoramic 21:9)
 *  - None (Text-First)
 */

const route = useRoute();
const slug = computed(() => (route.params.slug as string) || "next-gen-computing-cluster-expands-transportation-ai");

// Hero layout switcher state (default 'interactive-canvas' for Sol-inspired research presentation)
const heroLayout = ref<"interactive-canvas" | "ai-modern" | "boxed" | "full-bleed" | "split" | "inset-banner" | "none">("interactive-canvas");

interface ArticleData {
  title: string;
  category: string;
  dek: string;
  date: string;
  dateLabel: string;
  readTime: string;
  author: string;
  heroImage: string;
  heroAlt: string;
  heroCaption: string;
  tags: string[];
  stats?: Array<{ label: string; value: string; detail?: string }>;
  highlights?: string[];
  citation?: {
    title?: string;
    authors?: string;
    journal?: string;
    year?: number | string;
    doi?: string;
    bibtex?: string;
  };
  contact?: {
    name: string;
    email: string;
    title: string;
    phone?: string;
    note?: string;
  };
}

const articlesDatabase: Record<string, ArticleData> = {
  "next-gen-computing-cluster-expands-transportation-ai": {
    title: "Next-Gen Computing Cluster Expands Transportation AI Capabilities",
    category: "Research Computing",
    dek: "High-performance GPU infrastructure delivers accelerated computing power to advance real-time traffic modeling, predictive safety analytics, and connected vehicle simulations across research teams.",
    date: "2026-10-01",
    dateLabel: "October 1, 2026",
    readTime: "3 min read",
    author: "Transportation Analytics & Computing Initiative",
    heroImage: "/resources/news/computing-cluster.jpg",
    heroAlt: "High-performance GPU computing cluster server architecture",
    heroCaption: "High-performance computing cluster architecture deployed for transportation research simulations.",
    tags: ["Research Computing", "GeoAI", "Traffic Simulation", "High-Performance Computing"],
    stats: [
      { value: "4.8x", label: "Throughput Speedup", detail: "Versus legacy single-node workloads" },
      { value: "99.4%", label: "Model Precision", detail: "Edge vehicle & pedestrian detection" },
      { value: "1.2B", label: "Daily Telemetry Events", detail: "Continuous real-time ingestion capacity" },
      { value: "< 15ms", label: "Inference Latency", detail: "Corridor incident prediction window" },
    ],
    highlights: [
      "GPU-accelerated multi-node cluster dedicated to real-time traffic modeling, predictive safety, and GeoAI.",
      "High-throughput NVMe scratch volume and dedicated queues optimize deep neural net training on massive geospatial sensor streams.",
      "Seamlessly complements existing institutional supercomputing resources with dedicated exploratory simulation sandboxes.",
    ],
    citation: {
      title: "Next-Gen Computing Cluster Expands Transportation AI Capabilities",
      authors: "Transportation Analytics & Computing Initiative",
      journal: "Texas A&M Transportation Institute Publications",
      year: 2026,
      doi: "10.1145/tti.2026.042",
      bibtex: `@article{tti2026computing,
  title={Next-Gen Computing Cluster Expands Transportation AI Capabilities},
  author={Transportation Analytics & Computing Initiative},
  journal={Texas A&M Transportation Institute Publications},
  year={2026},
  doi={10.1145/tti.2026.042}
}`,
    },
    contact: {
      name: "Research Computing Operations",
      email: "computing-support@tti.tamu.edu",
      title: "HPC Facility Group",
      note: "For questions about compute allocation, cluster queues, or data repository access, contact the operations team.",
    },
  },
  "project-lifecycle-management-tools-and-fall-workshops": {
    title: "Project Lifecycle Management Tools & Fall Workshop Series Announced",
    category: "Talent Development",
    dek: "Updated research administration tools, resource planning dashboards, and role-based training workshops roll out to strengthen project delivery and fiscal stewardship.",
    date: "2026-09-24",
    dateLabel: "September 24, 2026",
    readTime: "4 min read",
    author: "Research Operations & Professional Development",
    heroImage: "/resources/news/project-lifecycle.svg",
    heroAlt: "Project lifecycle management workflow and workshop diagram",
    heroCaption: "Interactive project tracking and resource allocation dashboards.",
    tags: ["Talent Development", "Project Management", "Professional Development", "Research Administration"],
    stats: [
      { value: "4 Phases", label: "Lifecycle Architecture", detail: "From charter to institutional closeout" },
      { value: "100%", label: "Milestone Visibility", detail: "Unified real-time progress and burn tracking" },
      { value: "4 Tracks", label: "Role-Based Cohorts", detail: "Specialized PIs, PMs, and leadership sessions" },
      { value: "24/7", label: "Resource Portal", detail: "On-demand self-paced learning aids" },
    ],
    highlights: [
      "Standardized 4-phase framework strengthens milestone mapping, budget variance detection, and sponsor accountability.",
      "Interactive dashboards unify staffing effort forecasts with project task-code allocations.",
      "Fall workshop curriculum features hands-on practical case studies led by senior research practitioners.",
    ],
    citation: {
      title: "Project Lifecycle Management Tools & Fall Workshop Series Announced",
      authors: "Research Operations & Professional Development",
      journal: "Texas A&M Transportation Institute Publications",
      year: 2026,
      doi: "10.1145/tti.2026.088",
      bibtex: `@article{tti2026lifecycle,
  title={Project Lifecycle Management Tools & Fall Workshop Series Announced},
  author={Research Operations & Professional Development},
  journal={Texas A&M Transportation Institute Publications},
  year={2026},
  doi={10.1145/tti.2026.088}
}`,
    },
    contact: {
      name: "Training Coordination Team",
      email: "training@tti.tamu.edu",
      title: "Professional Development Group",
      note: "For questions regarding workshop registration, calendar invites, or course materials, reach out to the training coordinator.",
    },
  },
};

const currentArticle = computed<ArticleData>(() => {
  return articlesDatabase[slug.value] || articlesDatabase["next-gen-computing-cluster-expands-transportation-ai"]!;
});

useHead({
  title: computed(() => `${currentArticle.value.title} · Inside Lane · TUX`),
});
</script>

<template>
  <div class="min-h-screen bg-surface-page">
    <!-- Hero Presentation Floating Switcher Toolbar -->
    <aside
      class="sticky top-0 z-40 bg-surface-raised/95 backdrop-blur-md border-b border-surface-border py-2.5 px-4 shadow-xs"
      aria-label="Publication preview controls"
    >
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-brand-primary text-white rounded-xs">
            RESEARCH INDEX
          </span>
          <span class="text-xs font-mono text-text-muted hidden sm:inline">Presentation Styles:</span>
        </div>

        <!-- Layout buttons -->
        <div class="flex items-center gap-1.5" role="group" aria-label="Hero layout switcher">
          <button
            type="button"
            class="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all inline-flex items-center gap-1.5"
            :class="(heroLayout === 'interactive-canvas' || heroLayout === 'ai-modern') ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-sunken text-text-secondary border-surface-border hover:text-text-primary'"
            @click="heroLayout = 'interactive-canvas'"
          >
            <Icon name="lucide:sparkles" class="w-3.5 h-3.5" aria-hidden="true" />
            <span>Interactive Canvas (Sol)</span>
          </button>

          <button
            type="button"
            class="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="heroLayout === 'boxed' ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-sunken text-text-secondary border-surface-border hover:text-text-primary'"
            @click="heroLayout = 'boxed'"
          >
            Boxed (Kadence 16:9)
          </button>

          <button
            type="button"
            class="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="heroLayout === 'full-bleed' ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-sunken text-text-secondary border-surface-border hover:text-text-primary'"
            @click="heroLayout = 'full-bleed'"
          >
            Full Bleed
          </button>

          <button
            type="button"
            class="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="heroLayout === 'split' ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-sunken text-text-secondary border-surface-border hover:text-text-primary'"
            @click="heroLayout = 'split'"
          >
            Split (Editorial)
          </button>

          <button
            type="button"
            class="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="heroLayout === 'inset-banner' ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-sunken text-text-secondary border-surface-border hover:text-text-primary'"
            @click="heroLayout = 'inset-banner'"
          >
            Inset Banner
          </button>

          <button
            type="button"
            class="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all"
            :class="heroLayout === 'none' ? 'bg-brand-primary text-white border-brand-primary shadow-xs' : 'bg-surface-sunken text-text-secondary border-surface-border hover:text-text-primary'"
            @click="heroLayout = 'none'"
          >
            None
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Editorial Article Reader Component -->
    <TuxEditorialArticle
      :title="currentArticle.title"
      :category="currentArticle.category"
      :dek="currentArticle.dek"
      :date="currentArticle.date"
      :date-label="currentArticle.dateLabel"
      :read-time="currentArticle.readTime"
      :author="currentArticle.author"
      :hero-image="currentArticle.heroImage"
      :hero-alt="currentArticle.heroAlt"
      :hero-caption="currentArticle.heroCaption"
      :hero-layout="heroLayout"
      :stats="currentArticle.stats"
      :highlights="currentArticle.highlights"
      :citation="currentArticle.citation"
      :toc="true"
      :show-reading-progress="true"
      :show-scroll-top="true"
      :show-share="true"
      :tags="currentArticle.tags"
      :contact="currentArticle.contact"
      :back-to="{ label: 'Back to Inside Lane Feed', to: '/news' }"
    >
      <!-- COMPUTING CLUSTER ARTICLE PROSE -->
      <template v-if="slug.includes('computing') || slug.includes('cluster')">
        <p>
          Researchers across transportation modeling, data science, and connected infrastructure divisions
          now have access to an expanded high-performance computing environment engineered specifically for
          large-scale mobility datasets and complex predictive simulation workflows.
        </p>

        <h2 id="platform-architecture">Platform Architecture & Capabilities</h2>
        <p>
          The newly commissioned computing cluster combines high-density multi-GPU compute nodes with
          accelerated interconnects, high-throughput NVMe scratch storage, and dedicated pipeline queues.
          Designed to bridge the gap between desktop workstations and institutional supercomputing super-clusters,
          the system provides research groups with the dedicated throughput needed to process multi-terabyte
          telemetry streams, sensor fusion data, and high-frequency LiDAR scans.
        </p>

        <h2 id="research-expansion">Expanding Data-Intensive Research</h2>
        <p>
          This capability reflects the Institute's commitment to advancing frontiers in artificial intelligence,
          physics-informed neural networks, and real-time corridor optimization. Investigators can rapidly
          evaluate complex "what-if" scenarios, benchmark micro-simulation traffic models, and deploy generative
          computer-vision models without queuing constraints.
        </p>
        <p>
          The cluster complements existing cloud architectures and institutional HPC clusters, giving teams
          unrestricted sandbox environments for algorithmic prototyping, edge sensor telemetry modeling, and
          digital twin simulations.
        </p>

        <h2 id="ten-year-legacy">A Legacy of Analytical Impact</h2>
        <p>
          Advanced computing infrastructure continues to serve as the technological backbone for nationwide
          mobility benchmarks, urban congestion indexes, and statewide safety analytics. Projects supported
          by these computational capabilities have empowered transportation departments, regional councils,
          and public transit operators to make evidence-based policy and engineering decisions for more than
          two decades.
        </p>

        <h2 id="interdisciplinary-collaboration">Collaborative Deployment & Production Use</h2>
        <p>
          The deployment was executed through a joint initiative between research scientists, software engineers,
          and facility systems architects, ensuring compliance with institutional cyber-infrastructure standards
          and seamless integration with existing research storage volumes. Production workloads and model
          training jobs began immediately upon commissioning.
        </p>

        <h2 id="future-outlook">Future Outlook</h2>
        <p>
          As transportation systems become increasingly automated and data-rich, institutional investments in
          computational agility ensure research teams are prepared to address evolving multimodal challenges—from
          electric vehicle grid impacts to connected autonomous freight corridors—delivering actionable insights
          to public sponsors and industry partners nationwide.
        </p>
      </template>

      <!-- PROJECT LIFECYCLE MANAGEMENT ARTICLE PROSE -->
      <template v-else>
        <p>
          The Professional Development Program, in partnership with research administration specialists and
          senior project investigators across the Institute, is launching an updated Project Lifecycle
          Management Framework accompanied by a comprehensive, role-based workshop series this fall.
        </p>

        <p>
          As research contracts grow in scale and interdisciplinary complexity, proactive project governance,
          transparent personnel allocation, and rigorous deliverable tracking are essential to sustained
          excellence. The enhanced framework introduces intuitive milestone dashboards, automated budget
          burn projections, and standardized quality checkpoints across all project phases.
        </p>

        <p>
          To ensure research teams can immediately capitalize on these tools, the training series provides
          interactive instruction tailored directly to the operational responsibilities of Principal Investigators,
          Project Managers, and Division Leadership.
        </p>

        <h2 id="why-attend">Why Attend?</h2>
        <p>The updated framework and accompanying tools are designed to streamline research management by enabling teams to:</p>
        <ul>
          <li>Monitor project milestone progress and budget expenditures through unified dashboards.</li>
          <li>Accurately forecast team capacity, task code allocations, and FTE commitments.</li>
          <li>Identify schedule dependencies and potential resource variances well before critical delivery dates.</li>
          <li>Standardize data management, sponsor reporting, and institutional compliance requirements.</li>
          <li>Strengthen collaborative workflows across multidisciplinary research divisions.</li>
        </ul>
        <p>
          Whether overseeing multiple research programs or leading individual sponsored task orders, these
          hands-on sessions provide concrete strategies, checklists, and templates to streamline day-to-day
          operations.
        </p>

        <h2 id="upcoming-training-sessions">Upcoming Workshop Series</h2>
        <ul>
          <li><strong>Division Leadership Briefing</strong> – High-level portfolio tracking and resource forecasting</li>
          <li><strong>Project Manager Practicum (Part 1)</strong> – Task scheduling, risk mitigation, and milestone mapping</li>
          <li><strong>Project Manager Practicum (Part 2)</strong> – Budget oversight, change control, and sponsor reporting</li>
          <li><strong>Principal Investigator Roundtable</strong> – Research stewardship, compliance, and closeout excellence</li>
        </ul>
        <p>
          Self-paced interactive modules and downloadable job aids will be available through the institutional
          learning portal throughout the academic year.
        </p>

        <h2 id="what-to-expect">What to Expect</h2>
        <p>Workshop participants will gain practical experience in:</p>
        <ul>
          <li>Navigating unified project health and progress dashboards.</li>
          <li>Developing realistic staffing forecasts and resource contingency plans.</li>
          <li>Applying best practices for project data retention and deliverables quality assurance.</li>
          <li>Utilizing automated alerting tools to preempt administrative bottlenecks.</li>
          <li>Facilitating seamless sponsor communication from project kickoff through final publication.</li>
        </ul>
        <p>
          Each session is led by experienced project directors and research administration practitioners who share
          real-world case studies and actionable lessons learned from successfully delivered major research contracts.
        </p>

        <h2 id="stay-tuned">Registration & Course Materials</h2>
        <p>
          Registration links, calendar invitations, and participant preparatory guides are available on the
          institutional professional development portal. Research staff and project leaders are encouraged to
          reserve seats early for upcoming cohort sessions.
        </p>
      </template>

      <!-- Auxiliary Rail Content -->
      <template #rail>
        <!-- Companion Story Card -->
        <div class="p-5 bg-surface-raised border border-surface-border rounded-sm shadow-xs space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-brand-primary font-display">
            Related Publication
          </h3>
          <p class="text-xs text-text-secondary leading-relaxed">
            <template v-if="slug.includes('computing') || slug.includes('cluster')">
              Read about the newly announced Project Lifecycle Management Tools & Fall Workshop Series.
            </template>
            <template v-else>
              Learn about the high-performance computing cluster expanding transportation AI and simulation capabilities.
            </template>
          </p>
          <NuxtLink
            :to="(slug.includes('computing') || slug.includes('cluster'))
              ? '/news/project-lifecycle-management-tools-and-fall-workshops'
              : '/news/next-gen-computing-cluster-expands-transportation-ai'"
            class="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
          >
            <span>Switch to Companion Article</span>
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </template>

      <!-- Bottom Article Footer -->
      <template #footer>
        <div class="p-6 bg-surface-sunken border border-surface-border rounded-md mt-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p class="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
                Texas A&amp;M Transportation Institute
              </p>
              <h3 class="text-lg font-bold text-text-primary font-display uppercase mt-0.5">
                Inside Lane Institutional Publications
              </h3>
              <p class="text-xs text-text-secondary mt-1">
                Published by TTI Communications in partnership with the Research Computing and Talent Development groups.
              </p>
            </div>
            <NuxtLink
              to="/news"
              class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-brand-primary text-white rounded-xs hover:bg-brand-primary-deep transition-colors self-start sm:self-auto"
            >
              <span>Back to News Feed</span>
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
      </template>
    </TuxEditorialArticle>
  </div>
</template>
