<script setup lang="ts">
/**
 * Component Gallery: TuxEditorialArticle
 * Interactive documentation and sandbox demonstrating hero layouts, sticky TOC,
 * and authentic TTI Inside Lane publishing ergonomics.
 */

useHead({ title: "TuxEditorialArticle · TUX" });

const activeHero = ref<"boxed" | "full-bleed" | "split" | "inset-banner" | "none">("boxed");
const activeArticle = ref<"mobility8" | "rims">("mobility8");
const showToc = ref(true);
const showProgress = ref(true);
const showShare = ref(true);

const articles = {
  mobility8: {
    title: "New Mobility 8 Server Expands Research Computing Capabilities",
    category: "Inside Lane",
    dek: "Permanent University Fund support delivers GPU-accelerated computing power to advance transportation AI and big data analytics.",
    date: "2026-10-01",
    dateLabel: "October 1, 2026",
    readTime: "3 min read",
    heroImage: "/resources/news/mobility-8-server.jpg",
    heroAlt: "Dell high-performance GPU server rack in research data center",
    heroCaption: "TTI Mobility 8 high-performance computing node deployed at RELLIS campus data facility.",
    author: "TTI Communications & Research Computing",
    tags: ["Announcements", "Noteworthy", "Research Computing", "Inside Lane"],
    contact: {
      name: "Network & Information Systems",
      email: "nis-support@tti.tamu.edu",
      title: "HPC Infrastructure Group",
      note: "For questions about compute allocation and GPU cluster access, contact NIS support.",
    },
  },
  rims: {
    title: "New RIMS Enhancements And Training Opportunities Coming This Fall",
    category: "Inside Lane",
    dek: "TTI Talent Development Program rolls out role-based project management tools and hands-on workshops across divisions.",
    date: "2026-10-01",
    dateLabel: "October 1, 2026",
    readTime: "4 min read",
    heroImage: "/resources/news/rims-enhancements.png",
    heroAlt: "Research Information Management System graphics showing project lifecycle dashboard",
    heroCaption: "Updated RIMS financial tracking and resource allocation dashboards.",
    author: "Talent Development Program",
    tags: ["Announcements", "Talent Development", "Project Management", "Inside Lane"],
    contact: {
      name: "Charlotte Glover",
      email: "c-glover@tti.tamu.edu",
      title: "Training Coordinator",
      note: "For questions regarding training registration and calendar logistics, please contact Charlotte Glover.",
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
              :class="activeArticle === 'mobility8' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken text-text-primary border-surface-border'"
              @click="activeArticle = 'mobility8'"
            >
              Mobility 8 Server
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-bold rounded-sm border transition-all"
              :class="activeArticle === 'rims' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-surface-sunken text-text-primary border-surface-border'"
              @click="activeArticle = 'rims'"
            >
              RIMS Training
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
          <template v-if="activeArticle === 'mobility8'">
            <p>
              Mobility and Data Science and Visualization division researchers now have access to a
              powerful new computing resource designed to support the Institute's growing data and
              analytics needs. Thanks to Permanent University Fund (PUF) support approved earlier this
              year, the new <strong>Mobility 8</strong> server is now online and being used for research use.
            </p>

            <h2 id="system-architecture">Platform Architecture & Capabilities</h2>
            <p>
              Mobility 8 is a GPU-accelerated, single-node high-performance computing platform designed
              to bridge the gap between traditional desktop computing and large-scale supercomputing
              environments. Built on Dell's latest server technology with advanced processors,
              high-speed memory and expanded storage capacity, the system provides researchers with the
              computing power needed to analyze increasingly large and complex transportation datasets.
            </p>

            <h2 id="research-impact">Expanding Data-Intensive Research</h2>
            <p>
              The investment reflects TTI's commitment to expanding research capabilities in data-intensive
              areas such as mobility analytics, geospatial modeling, artificial intelligence, machine
              learning and emerging GeoAI applications. Researchers are increasingly asked to answer
              exploratory “what-if” questions, develop prototypes and rapidly evaluate new technologies.
            </p>
            <p>
              Mobility 8 enables these activities by providing dedicated computing resources that
              complement existing cloud platforms, Databricks environments and the Texas A&amp;M
              High-Performance Research Computing (HPRC) resources.
            </p>

            <h2 id="institutional-legacy">A Proven Track Record of Innovation</h2>
            <p>
              The system is expected to support a wide range of sponsored research efforts over the next
              five to seven years. Similar computing infrastructure has played a key role over the last
              ten years in the development of many of Mobility Division's most visible products,
              including the <em>Urban Mobility Report</em>, <em>TxDOT Top 100 Congested Roadways</em>,
              FHWA's <em>Urban Congestion Report</em> and related analytical tools used by transportation
              agencies across the country.
            </p>

            <h2 id="deployment-readiness">Production Deployment & Next Steps</h2>
            <p>
              The successful deployment of Mobility 8 is also a testament to the collaboration between
              researchers, Financial Services and the Network and Information Systems team, who worked
              together to identify the optimal solution and ensure the system was ready for production
              use. Researchers began using the server immediately upon deployment.
            </p>
          </template>

          <!-- Article 2 Body Content -->
          <template v-else>
            <p>
              The TTI Talent Development Program, in collaboration with researchers and subject matter
              experts across TTI, is excited to announce upcoming enhancements to the Research Information
              Management System (RIMS) and a series of role-based training opportunities designed to help
              employees maximize the value of these new tools.
            </p>

            <p>
              TTI continues to invest in resources that support effective project management, personnel
              planning, and financial oversight throughout the project lifecycle. As part of these ongoing
              improvements, updates to RIMS will provide Division Heads, Project Managers, and Principal
              Investigators with enhanced visibility into project finances, staffing commitments, and
              resource utilization.
            </p>

            <h2 id="why-attend">Why Attend?</h2>
            <p>The updated RIMS tools are designed to support more proactive project management by helping users:</p>
            <ul>
              <li>Monitor project budgets and expenditures in real time.</li>
              <li>Track personnel effort and staffing commitments across tasks.</li>
              <li>Improve resource planning and workload forecasting.</li>
              <li>Identify potential budget variances before they become challenges.</li>
              <li>Strengthen financial oversight and decision-making throughout the life of a project.</li>
            </ul>

            <h2 id="upcoming-sessions">Upcoming Training Sessions</h2>
            <ul>
              <li><strong>Division Head Training</strong> – Oct. 29, 2026</li>
              <li><strong>Project Manager Training Pt. 1</strong> – Nov. 4, 2026</li>
              <li><strong>Project Manager Training Pt. 2</strong> – Nov. 12, 2026</li>
            </ul>

            <h2 id="what-to-expect">What to Expect</h2>
            <p>Training participants will learn how to:</p>
            <ul>
              <li>Utilize RIMS for project budget management and oversight.</li>
              <li>Forecast personnel effort and project resource needs accurately.</li>
              <li>Monitor project performance and financial health.</li>
              <li>Leverage available reporting tools to support planning and executive decision-making.</li>
              <li>Apply best practices for maintaining accurate and effective project data.</li>
            </ul>

            <h2 id="stay-tuned">Stay Tuned & Registration</h2>
            <p>
              Calendar invitations and registration details have been distributed directly to the
              appropriate audiences in advance of each session. We encourage all Division Heads, Project
              Managers, and Principal Investigators to take advantage of these learning opportunities.
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

    <!-- Code & Props Reference -->
    <section class="space-y-4">
      <h2 class="heading--bold text-xl font-bold">Code Example</h2>
      <TuxCodeBlock :code="exampleCode" language="vue" filename="ArticleView.vue" />
    </section>

    <!-- Props Reference Table -->
    <section class="space-y-4">
      <h2 class="heading--bold text-xl font-bold">Props Reference</h2>
      <div class="border border-surface-border rounded-md overflow-hidden bg-surface-raised">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-surface-sunken border-b border-surface-border text-xs font-mono uppercase text-text-muted">
              <th class="p-3">Prop</th>
              <th class="p-3">Type</th>
              <th class="p-3">Default</th>
              <th class="p-3">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-border text-text-secondary">
            <tr>
              <td class="p-3 font-mono text-brand-primary font-bold">title</td>
              <td class="p-3 font-mono">string</td>
              <td class="p-3 font-mono">required</td>
              <td class="p-3">Article headline rendered in high-impact condensed display typography.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono text-brand-primary font-bold">heroLayout</td>
              <td class="p-3 font-mono">'boxed' | 'full-bleed' | 'split' | 'inset-banner' | 'none'</td>
              <td class="p-3 font-mono">'boxed'</td>
              <td class="p-3">Visual presentation of the featured hero image.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono text-brand-primary font-bold">category</td>
              <td class="p-3 font-mono">string</td>
              <td class="p-3 font-mono">'Inside Lane'</td>
              <td class="p-3">Editorial badge displayed above the title with gold accent rule.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono text-brand-primary font-bold">toc</td>
              <td class="p-3 font-mono">boolean</td>
              <td class="p-3 font-mono">true</td>
              <td class="p-3">Renders sticky "On this page" right-rail navigation tracking headings.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono text-brand-primary font-bold">showReadingProgress</td>
              <td class="p-3 font-mono">boolean</td>
              <td class="p-3 font-mono">true</td>
              <td class="p-3">Displays top viewport reading progress bar during scroll.</td>
            </tr>
            <tr>
              <td class="p-3 font-mono text-brand-primary font-bold">showScrollTop</td>
              <td class="p-3 font-mono">boolean</td>
              <td class="p-3 font-mono">true</td>
              <td class="p-3">Floating circular dial with scroll-to-top interaction (EmDash CMS style).</td>
            </tr>
            <tr>
              <td class="p-3 font-mono text-brand-primary font-bold">contact</td>
              <td class="p-3 font-mono">EditorialContact</td>
              <td class="p-3 font-mono">undefined</td>
              <td class="p-3">Structured contact card for training coordinators or lead researchers.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
