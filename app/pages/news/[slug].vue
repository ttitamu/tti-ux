<script setup lang="ts">
/**
 * News Article Reader Page [slug].vue
 * Direct parity with MyTTI WordPress publications + EmDash CMS 1.0 reading features.
 * Includes interactive Hero Presentation Switcher to test and experience:
 *  - Boxed (Kadence 16:9)
 *  - Full Bleed (Cinematic)
 *  - Split (Two-Column)
 *  - Inset Banner (Panoramic 21:9)
 *  - None (Text-First)
 */

const route = useRoute();
const slug = computed(() => (route.params.slug as string) || "new-mobility-8-server-expands-research-computing-capabilities");

// Hero layout switcher state (default 'boxed' matching MyTTI)
const heroLayout = ref<"boxed" | "full-bleed" | "split" | "inset-banner" | "none">("boxed");

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
  contact?: {
    name: string;
    email: string;
    title: string;
    phone?: string;
    note?: string;
  };
}

const articlesDatabase: Record<string, ArticleData> = {
  "new-mobility-8-server-expands-research-computing-capabilities": {
    title: "New Mobility 8 Server Expands Research Computing Capabilities",
    category: "Inside Lane",
    dek: "Permanent University Fund support delivers GPU-accelerated computing power to advance transportation AI, machine learning and big data analytics across TTI.",
    date: "2026-10-01",
    dateLabel: "October 1, 2026",
    readTime: "3 min read",
    author: "Mobility Division & Research Computing",
    heroImage: "/resources/news/mobility-8-server.jpg",
    heroAlt: "Dell GPU-accelerated high performance computing server rack",
    heroCaption: "TTI Mobility 8 high-performance computing platform deployed at RELLIS campus data facility.",
    tags: ["Inside Lane", "Announcements", "Noteworthy", "Research Computing", "GeoAI"],
    contact: {
      name: "Network & Information Systems",
      email: "nis-support@tti.tamu.edu",
      title: "HPC Infrastructure Group",
      note: "For questions about compute allocation and GPU cluster access, contact the NIS team.",
    },
  },
  "new-rims-enhancements-and-training-opportunities-coming-this-fall": {
    title: "New RIMS Enhancements And Training Opportunities Coming This Fall",
    category: "Inside Lane",
    dek: "TTI Talent Development Program rolls out role-based project management tools and hands-on workshops across divisions.",
    date: "2026-10-01",
    dateLabel: "October 1, 2026",
    readTime: "4 min read",
    author: "TTI Talent Development Program",
    heroImage: "/resources/news/rims-enhancements.png",
    heroAlt: "Research Information Management System graphics showing project lifecycle dashboard",
    heroCaption: "Updated RIMS financial tracking and resource allocation dashboards.",
    tags: ["Inside Lane", "Announcements", "Talent Development", "Project Management"],
    contact: {
      name: "Charlotte Glover",
      email: "c-glover@tti.tamu.edu",
      title: "Training Logistics Coordinator",
      note: "For questions regarding training registration, calendar invites, or course materials, please contact Charlotte Glover.",
    },
  },
};

const currentArticle = computed<ArticleData>(() => {
  return articlesDatabase[slug.value] || articlesDatabase["new-mobility-8-server-expands-research-computing-capabilities"]!;
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
            EMDASH CMS 1.0
          </span>
          <span class="text-xs font-mono text-text-muted hidden sm:inline">Hero Presentation Options:</span>
        </div>

        <!-- Layout buttons -->
        <div class="flex items-center gap-1.5" role="group" aria-label="Hero layout switcher">
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
      :toc="true"
      :show-reading-progress="true"
      :show-scroll-top="true"
      :show-share="true"
      :tags="currentArticle.tags"
      :contact="currentArticle.contact"
      :back-to="{ label: 'Back to Inside Lane Feed', to: '/news' }"
    >
      <!-- MOBILITY 8 ARTICLE PROSE -->
      <template v-if="slug.includes('mobility-8')">
        <p>
          Mobility and Data Science and Visualization division researchers now have access to a powerful
          new computing resource designed to support the Institute's growing data and analytics needs.
          Thanks to Permanent University Fund (PUF) support approved earlier this year, the new
          <strong>Mobility 8</strong> server is now online and being used for research use.
        </p>

        <h2 id="platform-architecture">Platform Architecture & Capabilities</h2>
        <p>
          Mobility 8 is a GPU-accelerated, single-node high-performance computing platform designed to
          bridge the gap between traditional desktop computing and large-scale supercomputing environments.
          Built on Dell's latest server technology with advanced processors, high-speed memory and expanded
          storage capacity, the system provides researchers with the computing power needed to analyze
          increasingly large and complex transportation datasets.
        </p>

        <h2 id="research-expansion">Expanding Data-Intensive Research</h2>
        <p>
          The investment reflects TTI's commitment to expanding research capabilities in data-intensive
          areas such as mobility analytics, geospatial modeling, artificial intelligence, machine learning
          and emerging GeoAI applications. Researchers are increasingly asked to answer exploratory
          “what-if” questions, develop prototypes and rapidly evaluate new technologies.
        </p>
        <p>
          Mobility 8 enables these activities by providing dedicated computing resources that complement
          existing cloud platforms, Databricks environments and the Texas A&amp;M High-Performance
          Research Computing (HPRC) resources.
        </p>

        <h2 id="ten-year-legacy">A Decade of Research Computing Impact</h2>
        <p>
          The system is expected to support a wide range of sponsored research efforts over the next five
          to seven years. Similar computing infrastructure has played a key role over the last ten years
          in the development of many of Mobility Division's most visible products, including the
          <em>Urban Mobility Report</em>, <em>TxDOT Top 100 Congested Roadways</em>, FHWA's
          <em>Urban Congestion Report</em> and related analytical tools used by transportation agencies
          across the country. Collectively, projects supported by these capabilities have generated
          millions of dollars in sponsored research over the past decade.
        </p>

        <h2 id="interdisciplinary-collaboration">Collaborative Deployment & Production Use</h2>
        <p>
          The successful deployment of Mobility 8 is also a testament to the collaboration between
          researchers, Financial Services and the Network and Information Systems team, who worked
          together to identify the optimal solution and ensure the system was ready for production use.
          Researchers began using the server immediately upon deployment on September 1.
        </p>

        <h2 id="future-outlook">Future Outlook</h2>
        <p>
          As transportation research continues to evolve, investments like Mobility 8 help position TTI
          to respond more quickly to sponsor needs, explore innovative ideas and demonstrate the “art of
          the possible” in data-driven transportation solutions. The new platform strengthens the ability
          to compete for future research opportunities while delivering long-term value to sponsors,
          partners and the transportation community.
        </p>
      </template>

      <!-- RIMS ENHANCEMENTS ARTICLE PROSE -->
      <template v-else>
        <p>
          The TTI Talent Development Program, in collaboration with researchers and subject matter experts
          across TTI, is excited to announce upcoming enhancements to the Research Information Management
          System (RIMS) and a series of role-based training opportunities designed to help employees
          maximize the value of these new tools.
        </p>

        <p>
          TTI continues to invest in resources that support effective project management, personnel
          planning, and financial oversight throughout the project lifecycle. As part of these ongoing
          improvements, updates to RIMS will provide Division Heads, Project Managers, and Principal
          Investigators with enhanced visibility into project finances, staffing commitments, and
          resource utilization.
        </p>

        <p>
          To support these enhancements and ensure employees are equipped to fully leverage the system's
          capabilities, the TTI Talent Development Program has partnered with researchers, project
          leaders, and key stakeholders across the institute to develop and deliver role-based training
          opportunities this fall. This effort is being spearheaded by <strong>Michael Manser</strong>,
          <strong>Brianne Glover</strong> and <strong>Thomas Motyka</strong>, whose expertise and
          leadership have been instrumental in the development of the training curriculum and rollout
          strategy.
        </p>

        <h2 id="why-attend">Why Attend?</h2>
        <p>The updated RIMS tools are designed to support more proactive project management by helping users:</p>
        <ul>
          <li>Monitor project budgets and expenditures in real time.</li>
          <li>Track personnel effort and staffing commitments across task codes.</li>
          <li>Improve resource planning and workload forecasting.</li>
          <li>Identify potential budget variances before they become challenges.</li>
          <li>Strengthen financial oversight and decision-making throughout the life of a project.</li>
        </ul>
        <p>
          Whether you oversee projects at a leadership level, manage project operations or serve as a
          Principal Investigator, these sessions will provide practical guidance and hands-on instruction
          tailored to your role.
        </p>

        <h2 id="upcoming-training-sessions">Upcoming Training Sessions</h2>
        <ul>
          <li><strong>Division Head Training</strong> – Oct. 29, 2026</li>
          <li><strong>Project Manager Training Pt. 1</strong> – Nov. 4, 2026</li>
          <li><strong>Project Manager Training Pt. 2</strong> – Nov. 12, 2026</li>
        </ul>
        <p>
          Additional training opportunities for Principal Investigators and other research personnel
          will be offered throughout the year.
        </p>

        <h2 id="what-to-expect">What to Expect</h2>
        <p>Training participants will learn how to:</p>
        <ul>
          <li>Utilize RIMS for project budget management and financial oversight.</li>
          <li>Forecast personnel effort and project resource needs accurately.</li>
          <li>Monitor project performance and institutional account health.</li>
          <li>Leverage available reporting tools to support planning and executive decision-making.</li>
          <li>Apply best practices for maintaining accurate and effective project data.</li>
        </ul>
        <p>
          Sessions will be facilitated by researchers, project leaders and subject matter experts who
          have helped shape the latest RIMS enhancements, providing participants with practical insights
          and real-world applications tailored to their roles.
        </p>

        <h2 id="stay-tuned">Stay Tuned & Registration</h2>
        <p>
          Calendar invitations and registration details have been distributed directly to the appropriate
          audiences in advance of each session. We encourage all Division Heads, Project Managers,
          Principal Investigators and other research professionals to take advantage of these learning
          opportunities as we continue enhancing RIMS and strengthening TTI's project management
          capabilities.
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
            <template v-if="slug.includes('mobility-8')">
              Read about the upcoming RIMS financial enhancements and role-based training workshops this fall.
            </template>
            <template v-else>
              Learn about the newly deployed Mobility 8 GPU server expanding research compute capabilities.
            </template>
          </p>
          <NuxtLink
            :to="slug.includes('mobility-8')
              ? '/news/new-rims-enhancements-and-training-opportunities-coming-this-fall'
              : '/news/new-mobility-8-server-expands-research-computing-capabilities'"
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
                Texas A&M Transportation Institute
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
