/**
 * Pull every individual AggieUX icon from the public CDN into
 * reference/aggieux/icons/.
 *
 * Run: npm run sync:aggieux-icons
 *
 * URL pattern (per https://aux.tamu.edu/ docs):
 *   strip the `aux_` prefix from the library name, append `.svg`
 *   https://aux.tamu.edu/icons/aux-prod-icons/{name}.svg
 *
 * Files land flat under reference/aggieux/icons/ to match the upstream
 * URL layout. The category grouping is preserved in the `CATEGORIES`
 * object below, and emitted into reference/aggieux/icons/INDEX.md for
 * browsing.
 *
 * Windows gotcha: none of these names collide with reserved device stems
 * (CON/PRN/AUX/NUL/COM1-9/LPT1-9), so flat files are safe to track.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE = "https://aux.tamu.edu/icons/aux-prod-icons";

const CATEGORIES = {
  Academic: [
    "backpack", "book", "book-blank", "book-bookmark", "book-open",
    "book-open-cover", "books", "diploma", "graduation-cap",
    "person-chalkboard", "user-graduate",
  ],
  Alert: [
    "check", "circle-check", "circle-exclamation", "circle-info",
    "circle-outline-check", "circle-outline-exclamation",
    "circle-outline-info", "circle-outline-question",
    "circle-outline-xmark", "circle-question", "circle-xmark",
    "exclamation", "info", "question", "triangle-exclamation",
    "triangle-outline-exclamation", "xmark-large", "xmark-small",
  ],
  Arts: [
    "clapperboard-play", "image", "masks-theater", "music",
    "paintbrush-fine", "paintbrush-pencil", "palette", "photo-film",
    "ticket", "trumpet", "violin", "wand-magic-sparkles",
  ],
  Awards: [
    "award", "badge-check", "certificate", "medal", "ranking-star",
    "star", "trophy", "trophy-star",
  ],
  Brand: [
    "bluesky", "facebook", "instagram", "linkedin", "reddit",
    "snapchat", "x-twitter", "youtube",
  ],
  Commerce: [
    "basket-shopping", "cart-shopping", "circle-dollar", "coins",
    "hand-holding-dollar", "money-bill-1", "money-check-dollar-pen",
    "sack-dollar", "square-dollar", "wallet",
  ],
  Communication: [
    "bullhorn", "clipboard", "clipboard-list", "clipboard-list-check",
    "clipboard-user", "comment", "comments", "envelope",
    "envelope-circle-check", "envelope-open-text", "marker",
    "message-question", "messages-question", "newspaper", "notebook",
    "paper-plane", "pen-clip", "pen-nib", "pencil", "phone",
  ],
  Dining: [
    "bottle-droplet", "bottle-water", "bowl-chopsticks-noodles",
    "burger-cheese", "burger-soda", "cup-togo", "glass", "ice-cream",
    "mug-hot", "utensils",
  ],
  Directional: [
    "angle-down", "angle-left", "angle-right", "angle-up",
    "angles-down", "angles-left", "angles-right", "angles-up",
    "arrow-down", "arrow-down-a-z", "arrow-down-arrow-up",
    "arrow-down-long", "arrow-left", "arrow-left-long", "arrow-right",
    "arrow-right-long", "arrow-up", "arrow-up-a-z",
    "arrow-up-arrow-down", "arrow-up-right", "circle-chevron-down",
    "circle-chevron-left", "circle-chevron-right", "circle-chevron-up",
  ],
  Files: [
    "file", "file-certificate", "file-download", "file-excel",
    "file-import", "file-pdf", "file-powerpoint", "file-word",
    "file-zipper", "files", "folder", "folder-empty",
  ],
  Hands: [
    "hand", "hand-holding", "hand-holding-heart", "hand-wave",
    "handshake", "handshake-simple", "thumbs-down", "thumbs-up",
  ],
  Health: [
    "bandage", "briefcase-medical", "glasses", "mask-face",
    "medical-cross", "pills", "staff-snake", "stethoscope", "syringe",
    "tooth", "wave-pulse",
  ],
  Nature: [
    "bag-seedling", "cactus", "corn", "cow", "crab", "dog-collar",
    "dolphin", "droplet", "earth-americas", "fire", "fish",
    "flower-bonnet", "flower-daisy", "flower-tulip", "horse-saddle",
    "leaf", "moon-stars", "paw", "planet-ringed", "raindrops",
    "seashell", "seedling", "snorkeling-goggles", "star-shooting",
    "stars", "strawberry", "tree", "tree-deciduous", "tree-palm",
    "turtle", "water", "watermelon", "wave", "wheat",
  ],
  People: [
    "circle-user", "family", "people-roof", "people-simple", "person",
    "person-simple", "person-walking", "user", "user-cowboy",
    "user-police-tie", "users", "wheelchair", "wheelchair-simple",
  ],
  Places: [
    "bench-tree", "bridge-suspension", "building", "building-columns",
    "buildings", "city", "compass", "hospital", "hotel", "house",
    "landmark", "landmark-dome", "map", "map-location-dot", "school",
  ],
  Research: [
    "atom", "bacteria", "brain", "bug", "chart-column", "chart-mixed",
    "chart-network", "chart-pie", "dna", "farm", "farm-silo", "flask",
    "magnifying-glass-detailed", "rocket", "telescope",
    "temperature-three-quarters", "virus", "waveform",
    "waveform-lines", "wind-turbine",
  ],
  Safety: [
    "eye", "fingerprint", "fire-extinguisher", "key", "key-skeleton",
    "life-ring", "lock", "lock-open", "shoe-prints", "siren-on",
    "unlock",
  ],
  Sports: [
    "baseball", "baseball-bat-ball", "basketball", "basketball-hoop",
    "bowling-ball-pin", "dumbbell", "football", "football-helmet",
    "futbol", "goal-net", "golf-ball-tee", "golf-club",
    "golf-flag-hole", "person-biking", "person-running",
    "person-running-fast", "person-swimming", "racquet", "soccer",
    "table-tennis-paddle-ball", "tennis-ball", "volleyball",
  ],
  Symbols: [
    "arrows-rotate", "backward-step", "ban", "bolt", "calculator-simple",
    "circle-bolt", "circle-calendar", "circle-pause", "circle-play",
    "closed-captions", "expand", "fast-forward", "forward-step",
    "full-screen", "gear", "heart", "lightbulb", "lightbulb-on",
    "location-dot", "mute", "party-popper", "pause", "play",
    "play-pause", "puzzle", "puzzle-piece", "puzzle-piece-simple",
    "recycle", "replay", "rewind", "ribbon", "scale-balanced",
    "shuffle", "sitemap", "skip", "sparkle", "sparkles", "square-bolt",
    "square-check", "universal-access", "volume-down", "volume-up",
  ],
  Technology: [
    "ar-vr-headset", "camera", "camera-cctv", "camera-movie", "code",
    "computer", "computer-mouse", "desktop", "game-console-handheld",
    "gamepad-modern", "globe-pointer", "hand-mic", "headphones",
    "keyboard", "laptop", "microphone", "mobile-screen-button",
    "phone-office", "presentation-screen", "print", "router", "rss",
    "satellite", "speaker", "tv-retro", "video", "voicemail", "wifi",
  ],
  "Texas A&M": [
    "12th-man-towel", "aggie-band", "aggie-ring", "boot-cowboy",
    "fancy-star", "gig-em-outline", "gig-em-solid", "hat-cowboy",
    "hat-cowboy-side", "reveille", "texas", "texas-star",
    "thumbs-down-outline", "thumbs-down-solid",
  ],
  Time: [
    "alarm-clock", "calendar", "calendar-clock", "clock", "hourglass",
    "hourglass-clock", "timer",
  ],
  Transportation: [
    "anchor-detailed", "bicycle", "bus-school", "bus-simple",
    "car-building", "car-bus", "car-mirrors", "charging-station",
    "circle-parking", "pickup-truck", "plane", "sailboat", "scooter",
    "ship", "tractor", "truck",
  ],
  UI: [
    "anchor", "arrow-up-right-from-square", "bars", "house-chimney",
    "link", "link-horizontal", "magnifying-glass", "trash-can",
  ],
  Weather: [
    "cloud", "cloud-rain", "cloud-showers-heavy", "cloud-sun",
    "cloud-sun-rain", "cloud-thunderstorm", "clouds", "snowflake",
    "sun", "sun-cloud", "tornado", "umbrella",
  ],
  Work: [
    "address-book", "ballot-check", "box-archive", "briefcase",
    "briefcase-blank", "brush", "chair-office", "hammer", "hand-trowel",
    "id-card", "ladle", "lamp-desk", "scissors", "screwdriver-wrench",
    "thumbtack", "vest", "wrench",
  ],
};

const outDir = resolve(process.cwd(), "reference/aggieux/icons");
mkdirSync(outDir, { recursive: true });

// Flatten to a unique list — a name could in principle appear in two
// categories (unlikely but possible). Deduplicate to avoid double-fetching.
const allNames = Array.from(
  new Set(Object.values(CATEGORIES).flat()),
);

console.log(`Fetching ${allNames.length} icons from ${BASE}...`);

// Parallelize with a concurrency cap — don't hammer the CDN.
const CONCURRENCY = 10;
let completed = 0;
let failed = 0;
const queue = [...allNames];

async function worker() {
  while (queue.length) {
    const name = queue.shift();
    if (!name) break;
    const url = `${BASE}/${name}.svg`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`  FAIL ${name}  (HTTP ${res.status})`);
        failed += 1;
        continue;
      }
      const body = await res.text();
      if (!body.trim().startsWith("<")) {
        console.error(`  FAIL ${name}  (not SVG)`);
        failed += 1;
        continue;
      }
      writeFileSync(resolve(outDir, `${name}.svg`), body);
      completed += 1;
    } catch (err) {
      console.error(`  FAIL ${name}  (${err.message})`);
      failed += 1;
    }
  }
}

await Promise.all(
  Array.from({ length: CONCURRENCY }, () => worker()),
);

console.log(`\n${completed} succeeded, ${failed} failed.`);

// Emit a categorized browsing index as Markdown so the collection is
// usable with grep + editor preview rather than a ls dump.
const indexLines = [
  "# AggieUX icons — categorized index",
  "",
  "Pulled from https://aux.tamu.edu/icons/aux-prod-icons/ — one SVG per icon.",
  "Upstream names drop the `aux_` prefix (so `aux_circle-check` → `circle-check.svg`).",
  "",
  "Refresh with `npm run sync:aggieux-icons`.",
  "",
  `Total: ${allNames.length} icons across ${Object.keys(CATEGORIES).length} categories.`,
  "",
];
for (const [category, names] of Object.entries(CATEGORIES)) {
  indexLines.push(`## ${category}`, "");
  for (const name of names) {
    indexLines.push(`- [\`${name}\`](./${name}.svg)`);
  }
  indexLines.push("");
}
writeFileSync(resolve(outDir, "INDEX.md"), indexLines.join("\n"));
console.log(`Wrote INDEX.md (${Object.keys(CATEGORIES).length} sections).`);

if (failed > 0) process.exit(1);
