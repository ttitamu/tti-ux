<script setup lang="ts">
/**
 * Component Gallery: TuxEditorialArticle
 * Interactive documentation and sandbox demonstrating hero layouts, sticky TOC,
 * and authentic TTI Inside Lane publishing ergonomics with anonymized sample content.
 */

useHead({ title: "TuxEditorialArticle · TUX" });

const activeHero = ref<"boxed" | "full-bleed" | "split" | "inset-banner" | "none">("boxed");
const activeArticle = ref<"cluster" | "lifecycle">("cluster");
const showToc = ref(true);
const showProgress = ref(true);
const showShare = ref(true);

const articles = {
  cluster: {
    title: "Next-Gen Computing Cluster Expands Transportation AI Capabilities",
    category: "Research Computing",
    dek: "High-performance GPU infrastructure delivers accelerated computing power to advance real-time traffic modeling, predictive safety analytics, and connected vehicle simulations across research teams.",
    date: "2026-10-01",
    dateLabel: "October 1, 2026",
    readTime: "3 min read",
    heroImage: "/resources/news/computing-cluster.jpg",
    heroAlt: "High-performance GPU cluster server architecture",
    heroCaption: "High-performance computing cluster architecture deployed for transportation research simulations.",
    author: "Transportation Analytics & Computing Initiative",
    tags: ["Research Computing", "GeoAI", "Traffic Simulation", "Inside Lane"],
    contact: {
      name: "Research Computing Operations",
      email: "computing-support@tti.tamu.edu",
      title: "HPC Facility Group",
      note: "For questions about compute allocation and GPU cluster access, contact the operations team.",
    },
  },
  lifecycle: {
    title: "Project Lifecycle Management Tools & Fall Workshop Series Announced",
    category: "Talent Development",
    dek: "Updated research administration tools, resource planning dashboards, and role-based training workshops roll out to strengthen project delivery and fiscal stewardship.",
    date: "2026-09-24",
    dateLabel: "September 24, 2026",
    readTime: "4 min read",
    heroImage: "/resources/news/project-lifecycle.svg",
    heroAlt: "Project lifecycle management workflow and workshop diagram",
    heroCaption: "Interactive project tracking and resource allocation dashboards.",
    author: "Research Operations & Professional Development",
    tags: ["Talent Development", "Project Management", "Professional Development", "Inside Lane"],
    contact: {
      name: "Training Coordination Team",
      email: "training@tti.tamu.edu",
      title: "Professional Development Group",
      note: "For questions regarding workshop registration, calendar invites, or course materials, reach out to the training coordinator.",
    },
  },
};

const current = computed(() => articles[activeArticle.value]);

const exampleCode = computed(() => `<TuxEditorialArticle
  title="${current.value.title}"
  category="${current.value.category}"
  dek="${current.value.dek}"
  date="${current.value.date}"
  read-time="${current.value.readTime}"
  hero-image="${current.value.heroImage}"
  hero-layout="${activeHero.value}"
  :toc="${showToc.value}"
  :show-reading-progress="${showProgress.value}"
  :show-share="${showShare.value}"
  :tags="${JSON.stringify(current.value.tags)}"
>
  <p>First paragraph with lead styling...</p>
  <h2 id="section-1">Section Heading</h2>
  <p>Article body content...</p>
</TuxEditorialArticle>`);
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxEditorialArticle">
      Flagship publication and article reader component parities the modern
      <strong>MyTTI / Inside Lane</strong> WordPress Kadence theme and integrates
      <strong>Cloudflare EmDash CMS 1.0</strong> reading ergonomics:
      switchable hero presentations (<em>boxed</em>, <em>full-bleed</em>, <em>split</em>, <em>inset-banner</em>, <em>none</em>),
      sticky Table of Contents rail, real-time reading progress indicators, and 100% WCAG 2.2 AAA accessibility.
    </TuxPageHeader>

    <!-- Interactive Playground Controls -->
    <section class="space-y-6">
      <div class="p-6 bg-surface-raised border border-surface-border rounded-md shadow-xs space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <h2 class="text-base font-bold text-text-primary uppercase tracking-wide font-display">
              Publication Sandbox & Hero Switcher
            </h2>
            <p class="text-xs text-text-secondary">
              Toggle layout variants and sample articles to preview responsive reading ergonomics.
            </p>
          </div>

          <!-- Article selector -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-bold text-text-muted uppercase">Sample:</span>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-bold rounded-sm border transition-all"
              :class="activeArticle === 'cluster' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken text-text-primary border-surface-border'"
              @click="activeArticle = 'cluster'"
            >
              Computing Cluster
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-bold rounded-sm border transition-all"
              :class="activeArticle === 'lifecycle' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken text-text-primary border-surface-border'"
              @click="activeArticle = 'lifecycle'"
            >
              Project Management
            </button>
          </div>
        </div>

        <!-- Controls grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <!-- Hero Layout Picker -->
          <div class="space-y-1">
            <label for="hero-layout-select" class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Hero Layout</label>
            <select
              id="hero-layout-select"
              v-model="activeHero"
              class="w-full text-xs font-sans px-2.5 py-1.5 bg-surface-sunken border border-surface-border rounded-sm text-text-primary focus:outline-none focus:border-brand-primary"
            >
              <option value="boxed">Boxed (Kadence 16:9)</option>
              <option value="full-bleed">Full Bleed (Cinematic)</option>
              <option value="split">Split (Two-Column)</option>
              <option value="inset-banner">Inset Banner (21:9)</option>
              <option value="none">None (Text-First)</option>
            </select>
          </div>

          <!-- Feature Toggles -->
          <div class="space-y-1">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Table of Contents</span>
            <div class="flex items-center gap-2 pt-1">
              <input
                id="toggle-toc"
                v-model="showToc"
                type="checkbox"
                class="w-4 h-4 text-brand-primary rounded-xs border-surface-border"
              >
              <label for="toggle-toc" class="text-xs text-text-secondary">Sticky Rail</label>
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Reading Progress</span>
            <div class="flex items-center gap-2 pt-1">
              <input
                id="toggle-progress"
                v-model="showProgress"
                type="checkbox"
                class="w-4 h-4 text-brand-primary rounded-xs border-surface-border"
              >
              <label for="toggle-progress" class="text-xs text-text-secondary">Top Bar & Dial</label>
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">Share Actions</span>
            <div class="flex items-center gap-2 pt-1">
              <input
                id="toggle-share"
                v-model="showShare"
                type="checkbox"
                class="w-4 h-4 text-brand-primary rounded-xs border-surface-border"
              >
              <label for="toggle-share" class="text-xs text-text-secondary">Copy / Email</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Component Demonstration Container -->
      <div class="border border-surface-border rounded-md overflow-hidden bg-surface-page shadow-sm">
        <TuxEditorialArticle
          :title="current.title"
          :category="current.category"
          :dek="current.dek"
          :date="current.date"
          :date-label="current.dateLabel"
          :read-time="current.readTime"
          :author="current.author"
          :hero-image="current.heroImage"
          :hero-alt="current.heroAlt"
          :hero-caption="current.heroCaption"
          :hero-layout="activeHero"
          :toc="showToc"
          :show-reading-progress="showProgress"
          :show-share="showShare"
          :show-scroll-top="false"
          :tags="current.tags"
          :contact="current.contact"
        >
          <!-- Article 1 Body Content -->
          <template v-if="activeArticle === 'cluster'">
            <p>
              Researchers across transportation modeling, data science, and connected infrastructure divisions
              now have access to an expanded high-performance computing environment engineered specifically for
              large-scale mobility datasets and complex predictive simulation workflows.
            </p>

            <h2 id="system-architecture">Platform Architecture & Capabilities</h2>
            <p>
              The newly commissioned computing cluster combines high-density multi-GPU compute nodes with
              accelerated interconnects, high-throughput NVMe scratch storage, and dedicated pipeline queues.
              Designed to bridge the gap between desktop workstations and institutional supercomputing super-clusters,
              the system provides research groups with the dedicated throughput needed to process multi-terabyte
              telemetry streams, sensor fusion data, and high-frequency LiDAR scans.
            </p>

            <h2 id="research-impact">Expanding Data-Intensive Research</h2>
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

            <h2 id="institutional-legacy">A Proven Track Record of Innovation</h2>
            <p>
              Advanced computing infrastructure continues to serve as the technological backbone for nationwide
              mobility benchmarks, urban congestion indexes, and statewide safety analytics. Projects supported
              by these computational capabilities have empowered transportation departments, regional councils,
              and public transit operators to make evidence-based policy and engineering decisions for more than
              two decades.
            </p>

            <h2 id="deployment-readiness">Production Deployment & Next Steps</h2>
            <p>
              The deployment was executed through a joint initiative between research scientists, software engineers,
              and facility systems architects, ensuring compliance with institutional cyber-infrastructure standards
              and seamless integration with existing research storage volumes. Production workloads and model
              training jobs began immediately upon commissioning.
            </p>
          </template>

          <!-- Article 2 Body Content -->
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

            <h2 id="why-attend">Why Attend?</h2>
            <p>The updated framework and accompanying tools are designed to streamline research management by enabling teams to:</p>
            <ul>
              <li>Monitor project milestone progress and budget expenditures through unified dashboards.</li>
              <li>Accurately forecast team capacity, task code allocations, and FTE commitments.</li>
              <li>Identify schedule dependencies and potential resource variances well before critical delivery dates.</li>
              <li>Standardize data management, sponsor reporting, and institutional compliance requirements.</li>
              <li>Strengthen collaborative workflows across multidisciplinary research divisions.</li>
            </ul>

            <h2 id="upcoming-sessions">Upcoming Workshop Series</h2>
            <ul>
              <li><strong>Division Leadership Briefing</strong> – High-level portfolio tracking and resource forecasting</li>
              <li><strong>Project Manager Practicum (Part 1)</strong> – Task scheduling, risk mitigation, and milestone mapping</li>
              <li><strong>Project Manager Practicum (Part 2)</strong> – Budget oversight, change control, and sponsor reporting</li>
              <li><strong>Principal Investigator Roundtable</strong> – Research stewardship, compliance, and closeout excellence</li>
            </ul>

            <h2 id="what-to-expect">What to Expect</h2>
            <p>Workshop participants will gain practical experience in:</p>
            <ul>
              <li>Navigating unified project health and progress dashboards.</li>
              <li>Developing realistic staffing forecasts and resource contingency plans.</li>
              <li>Applying best practices for project data retention and deliverables quality assurance.</li>
              <li>Utilizing automated alerting tools to preempt administrative bottlenecks.</li>
              <li>Facilitating seamless sponsor communication from project kickoff through final publication.</li>
            </ul>

            <h2 id="stay-tuned">Registration & Course Materials</h2>
            <p>
              Registration links, calendar invitations, and participant preparatory guides are available on the
              institutional professional development portal. Research staff and project leaders are encouraged to
              reserve seats early for upcoming cohort sessions.
            </p>
          </template>

          <!-- Auxiliary Rail Card -->
          <template #rail>
            <div class="p-5 bg-surface-sunken border border-surface-border rounded-sm space-y-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-brand-primary font-display">
                Inside Lane Newsletter
              </h3>
              <p class="text-xs text-text-secondary leading-relaxed">
                Stay updated on breakthroughs, operational enhancements, and research achievements across TTI.
              </p>
              <NuxtLink
                to="/news"
                class="inline-flex items-center text-xs font-bold text-brand-primary hover:underline"
              >
                <span>Browse All Publications</span>
                <span class="ml-1" aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </template>
        </TuxEditorialArticle>
      </div>
    </section>

    <!-- Implementation Code Sample -->
    <section class="space-y-4">
      <h2 class="text-xl font-bold uppercase font-display text-text-primary">
        Usage & Code Sample
      </h2>
      <div class="p-4 bg-surface-raised border border-surface-border rounded-md font-mono text-xs overflow-x-auto text-text-primary">
        <pre>{{ exampleCode }}</pre>
      </div>
    </section>

    <!-- Component Props Specification Table -->
    <section class="space-y-4">
      <h2 class="text-xl font-bold uppercase font-display text-text-primary">
        Props Specification
      </h2>
      <div class="overflow-x-auto border border-surface-border rounded-md bg-surface-raised">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-surface-border bg-surface-sunken font-mono uppercase text-text-muted">
              <th class="p-3">Prop</th>
              <th class="p-3">Type</th>
              <th class="p-3">Default</th>
              <th class="p-3">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border font-sans">
            <tr>
              <td class="p-3 font-mono font-bold text-brand-primary">title</td>
              <td class="p-3 font-mono text-text-secondary">string</td>
              <td class="p-3 font-mono text-text-muted">required</td>
              <td class="p-3 text-text-primary">Main article publication title (rendered in responsive Oswald font).</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-primary">heroLayout</td>
              <td class="p-3 font-mono text-text-secondary">'boxed' | 'full-bleed' | 'split' | 'inset-banner' | 'none'</td>
              <td class="p-3 font-mono text-text-muted">'boxed'</td>
              <td class="p-3 text-text-primary">Selects the hero layout treatment. 'boxed' matches MyTTI Kadence; 'full-bleed' matches EmDash cinematic; 'split' provides a 2-col editorial lead.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-primary">heroImage</td>
              <td class="p-3 font-mono text-text-secondary">string</td>
              <td class="p-3 font-mono text-text-muted">undefined</td>
              <td class="p-3 text-text-primary">URL or path to the featured publication header asset.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-primary">toc</td>
              <td class="p-3 font-mono text-text-secondary">boolean</td>
              <td class="p-3 font-mono text-text-muted">true</td>
              <td class="p-3 text-text-primary">Automatically detects headings (&lt;h2&gt;) and renders a sticky "On this page" TOC right rail.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-primary">showReadingProgress</td>
              <td class="p-3 font-mono text-text-secondary">boolean</td>
              <td class="p-3 font-mono text-text-muted">true</td>
              <td class="p-3 text-text-primary">Renders the top reading progress indicator bar tracking viewport scroll depth.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-primary">showScrollTop</td>
              <td class="p-3 font-mono text-text-secondary">boolean</td>
              <td class="p-3 font-mono text-text-muted">true</td>
              <td class="p-3 text-text-primary">Integrates TuxScrollTop floating circular progress dial button with EmDash geometry.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-primary">showShare</td>
              <td class="p-3 font-mono text-text-secondary">boolean</td>
              <td class="p-3 font-mono text-text-muted">true</td>
              <td class="p-3 text-text-primary">Displays copy link button (with animated toast) and email share button.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono font-bold text-brand-primary">contact</td>
              <td class="p-3 font-mono text-text-secondary">EditorialContact</td>
              <td class="p-3 font-mono text-text-muted">undefined</td>
              <td class="p-3 text-text-primary">Structured institutional contact card with name, email, title, and help desk instructions.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
