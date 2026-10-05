/**
 * useTuxFramework — global preferred code framework for the TTI-UX component library.
 *
 * Synchronizes code example syntax across all TuxExample instances and
 * the shell header switcher.
 *
 * Supported frameworks:
 *   - "vue"   : Canonical Vue 3 / Nuxt template (@tti/tti-ux)
 *   - "react" : React JSX / TSX (@tti/tti-ux-react)
 *   - "wc"    : Web Components / Custom Elements (@tti/tti-ux-elements)
 *   - "razor" : C# / .NET Razor Tag Helpers & Blazor (Tti.Tux.AspNetCore / Blazor)
 *
 * Backed by useState for cross-component reactive state, and persisted
 * to localStorage (SSR-safe via onMounted).
 */
import { computed, onMounted } from "vue";

export type TuxFrameworkId =
  | "vue"
  | "react"
  | "wc"
  | "razor"
  | "python"
  | "php"
  | "swift"
  | "kotlin";

export interface TuxFrameworkMeta {
  id: TuxFrameworkId;
  label: string;
  shortLabel: string;
  badge: string;
  icon: string;
  description: string;
  targetPackage: string;
}

export const TUX_FRAMEWORKS: readonly TuxFrameworkMeta[] = [
  {
    id: "vue",
    label: "Vue 3 / Nuxt",
    shortLabel: "Vue",
    badge: "Canonical",
    icon: "lucide:file-code",
    description: "Canonical Nuxt UI / Vue 3 SFC templates",
    targetPackage: "@tti/tti-ux",
  },
  {
    id: "react",
    label: "React JSX",
    shortLabel: "React",
    badge: "JSX / TSX",
    icon: "lucide:atom",
    description: "React 19, Gutenberg blocks & Kadence",
    targetPackage: "@tti/tti-ux-react",
  },
  {
    id: "wc",
    label: "Web Component",
    shortLabel: "Web Comp",
    badge: "Custom Elements",
    icon: "lucide:code-xml",
    description: "Light-DOM custom elements for any HTML host",
    targetPackage: "@tti/tti-ux-elements",
  },
  {
    id: "razor",
    label: ".NET Razor / Blazor",
    shortLabel: ".NET / C#",
    badge: "C# / Razor",
    icon: "lucide:hash",
    description: "ASP.NET Core Tag Helpers & Blazor components",
    targetPackage: "Tti.Tux.AspNetCore / Tti.Tux.Blazor",
  },
  {
    id: "python",
    label: "Python (Streamlit/Dash)",
    shortLabel: "Python",
    badge: "Python 3.10+",
    icon: "lucide:terminal",
    description: "Python dataclasses, Streamlit & Dash components",
    targetPackage: "tti-ux-python",
  },
  {
    id: "php",
    label: "PHP / WordPress",
    shortLabel: "PHP",
    badge: "PHP 8.2+",
    icon: "lucide:file-type-2",
    description: "PHP 8.2+ classes, theme.json & WordPress blocks",
    targetPackage: "tti-ux-php",
  },
  {
    id: "swift",
    label: "SwiftUI / iOS",
    shortLabel: "Swift",
    badge: "SwiftUI",
    icon: "lucide:smartphone",
    description: "Swift 5.9+ SwiftUI Views & Design Tokens",
    targetPackage: "TtiUxSwift",
  },
  {
    id: "kotlin",
    label: "Jetpack Compose",
    shortLabel: "Kotlin",
    badge: "Compose",
    icon: "lucide:smartphone-charging",
    description: "Kotlin 2.0+ Jetpack Compose Composables",
    targetPackage: "edu.tamu.tti.ux",
  },
] as const;

const STORAGE_KEY = "tux-preferred-framework";

export function useTuxFramework() {
  const framework = useState<TuxFrameworkId>("tux-framework-preference", () => "vue");

  // Client-side rehydration from storage
  onMounted(() => {
    try {
      if (typeof window === "undefined") return;
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && TUX_FRAMEWORKS.some((f) => f.id === stored)) {
        framework.value = stored as TuxFrameworkId;
      }
    } catch {
      // Storage unavailable or blocked
    }
  });

  function setFramework(id: TuxFrameworkId, options: { notify?: boolean } = {}) {
    if (!TUX_FRAMEWORKS.some((f) => f.id === id)) return;
    if (framework.value === id) return;

    framework.value = id;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, id);
      }
    } catch {
      // Storage unavailable
    }

    if (options.notify) {
      const meta = TUX_FRAMEWORKS.find((f) => f.id === id);
      if (meta) {
        try {
          const toast = useTuxToast();
          toast.show({
            title: `Switched to ${meta.label}`,
            description: `Showcase code snippets are now formatted for ${meta.targetPackage}.`,
            tone: "info",
            duration: 2500,
          });
        } catch {
          // Toast bus optional
        }
      }
    }
  }

  const currentMeta = computed(() => {
    return TUX_FRAMEWORKS.find((f) => f.id === framework.value) || TUX_FRAMEWORKS[0];
  });

  return {
    framework,
    setFramework,
    currentMeta,
    frameworks: TUX_FRAMEWORKS,
  };
}
