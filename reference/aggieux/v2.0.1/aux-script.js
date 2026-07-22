/**
 * In-Page Nav, Meganavs, Dropdowns, Mobile Overlay, Accordion Toggles and Sidebars.
 */
(function () {
  // --- MOBILE VIEWPORT POSITIONING FIX ---
  function initMobileViewportFix() {
    const setMobileBottom = () => {
      if (window.visualViewport) {
        const bottom = window.innerHeight - window.visualViewport.height;
        document.documentElement.style.setProperty(
          "--v-viewport-bottom",
          `${bottom}px`,
        );
      }
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", setMobileBottom);
      window.visualViewport.addEventListener("scroll", setMobileBottom);
    }
    setMobileBottom();
  }
  // --- ACCESSIBILITY: FOCUS MANAGEMENT ---
  function getFocusableElements(container) {
    const elements = Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      ),
    );
    return elements.filter((el) => {
      const style = window.getComputedStyle(el);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        el.getClientRects().length > 0
      );
    });
  }
  function focusFirstItem(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    setTimeout(() => {
      const firstFocusable = container.querySelector(
        '.back, a:not([tabindex="-1"]), button:not([tabindex="-1"])',
      );
      if (firstFocusable) firstFocusable.focus();
    }, 100);
  }
  function handleFocusTrap(e, container) {
    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;
    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    if (isMobile) {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    } else {
      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        const activeId = container.id;
        const triggers = Array.from(
          document.querySelectorAll(
            ".main-nav__item [data-megamenu]:not(.close):not(.back)",
          ),
        );
        const currentIndex = triggers.findIndex(
          (t) => t.getAttribute("data-megamenu") === activeId,
        );
        const nextTrigger =
          currentIndex >= 0 && currentIndex < triggers.length - 1
            ? triggers[currentIndex + 1]
            : null;
        closeEverything(true);
        if (nextTrigger) setTimeout(() => nextTrigger.focus(), 15);
      } else if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        closeEverything(true);
        // closeEverything already returns focus to the opening trigger
      }
    }
  }
  function handleWaypointTrap(e, container) {
    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;
    const closeBtn = container.querySelector(".close.mobile");
    const nonClose = focusable.filter((el) => el !== closeBtn);
    const first = nonClose[0];
    const last = nonClose[nonClose.length - 1];
    const active = document.activeElement;
    if (!e.shiftKey) {
      if (active === last) {
        e.preventDefault();
        closeBtn?.focus();
        return;
      }
      if (active === closeBtn) {
        e.preventDefault();
        first?.focus();
        return;
      }
    } else {
      if (active === closeBtn) {
        e.preventDefault();
        last?.focus();
        return;
      }
      if (active === first) {
        e.preventDefault();
        closeBtn?.focus();
        return;
      }
    }
  }
  // --- INERT HELPERS ---
  function setMainNavInert(inert) {
    document.querySelectorAll(".megamenu").forEach((panel) => {
      if (inert && !panel.classList.contains("active")) {
        panel.setAttribute("inert", "");
      } else {
        panel.removeAttribute("inert");
      }
    });
  }
  function setQuicklinksInert(inert) {
    const panel = document.getElementById("quicklinks-search");
    if (!panel) return;
    if (inert) {
      panel.setAttribute("inert", "");
    } else {
      panel.removeAttribute("inert");
    }
  }
  // --- IN-PAGE NAVIGATION (H2 Sidebar) ---
  function initInPageNav() {
    const headingTwos = document.querySelectorAll("main#main-content h2");
    const container = document.querySelector("aside#in-page-nav");
    if (!headingTwos.length || !container) return;

    let inPageLinks = "";
    let allHeadingSlugs = [];

    const makeSlug = (text) =>
      text
        .toLowerCase()
        .replace(/\b(a&m|a&amp;m)\b/g, "am ")
        .replace(/\b(a|an|the|and|but|or)\b/g, " ")
        .replace(/(\s{2,})/g, " ")
        .trim()
        .split(" ")
        .slice(0, 3)
        .join("-")
        .replace(/[^\w\-]+/g, "");

    headingTwos.forEach((heading) => {
      let slug = makeSlug(heading.textContent.trim());
      if (allHeadingSlugs.includes(slug)) slug += `-${allHeadingSlugs.length}`;
      heading.id = slug;
      allHeadingSlugs.push(slug);
      inPageLinks += `<li class="internal-nav__item"><a href="#${slug}">${heading.textContent.trim()}</a></li>`;
    });

    container.innerHTML = `
      <nav class="sidebar sidebar--collapsible aux-sticky" aria-label="Sidebar navigation">
        <button
          type="button"
          id="aside_trigger"
          aria-controls="aside"
          aria-expanded="false"
          class="sidebar__trigger"
        >
          On this Page
        </button>
        <div
          class="sidebar__panel"
          id="aside"
          role="region"
          aria-describedby="aside_trigger"
        >
          <span class="nav-heading">On This Page</span>
          <ul class="internal-nav">
            ${inPageLinks}
          </ul>
        </div>
      </nav>`;

    function changeLinkState() {
      const links = container.querySelectorAll(".internal-nav__item");
      let index = headingTwos.length;

      while (--index && window.scrollY + 250 < headingTwos[index].offsetTop) {}

      links.forEach((link) =>
        link.classList.remove("internal-nav__item--current"),
      );
      if (links[index])
        links[index].classList.add("internal-nav__item--current");
    }

    changeLinkState();
    window.addEventListener("scroll", changeLinkState);
  }

  // --- IN-PAGE NAV (for Storybook testing template) ---
  function tryInitInPageNav(retries = 20) {
    const headings = document.querySelectorAll("main#main-content h2");
    if (headings.length) {
      initInPageNav();
    } else if (retries > 0) {
      setTimeout(() => tryInitInPageNav(retries - 1), 50);
    }
  }

  function closeQuicklinksSearch() {
    const searchPanel = document.getElementById("quicklinks-search");
    const searchToggles = document.querySelectorAll(
      ".mobile-toggle__quicklinks-search",
    );
    if (searchPanel) {
      searchPanel.classList.remove("active");
      searchPanel.setAttribute("inert", "");
    }
    searchToggles.forEach((toggle) => {
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-pressed", "false");
    });
  }
  function initDeepLinking() {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash || hash === "#") return;
      try {
        const target = document.querySelector(hash);
        if (target) {
          if (target.tagName === "DETAILS") target.open = true;
          setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      } catch (err) {
        console.warn("Invalid anchor selector:", hash);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
  }
  function updateDetailsToggleLabel(groupContainer) {
    const btn = groupContainer?.querySelector("[data-details-toggle]");
    if (!btn) return;
    const anyOpen = groupContainer.querySelector("details[open]") !== null;
    btn.textContent = anyOpen ? "Collapse All" : "Expand All";
  }
  // --- CLICK HANDLER ---
  function handleGlobalClicks(e) {
    const target = e.target;
    const navContext = target.closest("#navbar.site-header");
    // --- QUICKLINKS & SEARCH TOGGLE (mobile only) ---
    const searchToggle = target.closest(".mobile-toggle__quicklinks-search");
    if (searchToggle && navContext) {
      e.preventDefault();
      const searchPanel = navContext.querySelector("#quicklinks-search");
      const isExpanded = searchToggle.getAttribute("aria-expanded") === "true";
      const newState = !isExpanded;
      if (newState) {
        closeOtherMegamenus(null, null);
        closeOtherDropdowns(null, null); // close any open dropdowns (e.g. "For You") when quicklinks opens
      }
      searchToggle.classList.toggle("active", newState);
      searchToggle.setAttribute("aria-expanded", newState);
      searchToggle.setAttribute("aria-pressed", newState);
      if (searchPanel) {
        searchPanel.classList.toggle("active", newState);
        if (newState) {
          searchPanel.removeAttribute("inert");
          const closeBtn = searchPanel.querySelector(".close");
          if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
        } else {
          searchPanel.setAttribute("inert", "");
        }
      }
      return;
    }
    // --- SIDEBAR TOGGLE ---
    const sidebarTrigger = target.closest(".sidebar__trigger");
    if (sidebarTrigger) {
      e.preventDefault();
      const panel = document.querySelector(".sidebar__panel");
      const isExpanded =
        sidebarTrigger.getAttribute("aria-expanded") === "true";
      sidebarTrigger.setAttribute("aria-expanded", !isExpanded);
      if (panel) panel.classList.toggle("active", !isExpanded);
      return;
    }
    // --- EXPAND/COLLAPSE ALL ---
    const detailsToggle = target.closest("[data-details-toggle]");
    if (detailsToggle) {
      e.preventDefault();
      const groupContainer = detailsToggle.closest("[data-details-collection]");
      if (groupContainer) {
        const accordions = groupContainer.querySelectorAll("details");
        const anyOpen = groupContainer.querySelector("details[open]") !== null;
        const desiredState = !anyOpen;
        accordions.forEach((accordion) => {
          accordion.open = desiredState;
        });
        updateDetailsToggleLabel(groupContainer);
      }
      return;
    }
    // --- BACK BUTTON ---
    const backBtn = target.closest(".back");
    if (backBtn) {
      e.preventDefault();
      const panel = backBtn.closest(".megamenu");
      const triggerId = backBtn.getAttribute("data-megamenu");
      if (panel) panel.classList.remove("active");
      syncAria(triggerId, "megamenu", false);
      document
        .querySelector(".main-header__megamenus")
        ?.classList.remove("active");
      setMainNavInert(false);
      const isMobile = window.matchMedia("(max-width: 1024px)").matches;
      if (isMobile) {
        const overlayTrigger = document.querySelector(
          `.nav-overlay.active [data-megamenu="${triggerId}"]:not(.back):not(.close)`,
        );
        if (overlayTrigger) setTimeout(() => overlayTrigger.focus(), 10);
      } else {
        const trigger = document.querySelector(
          `[data-megamenu="${triggerId}"]:not(.close):not(.back)`,
        );
        if (trigger) setTimeout(() => trigger.focus(), 10);
      }
      return;
    }
    // --- CLOSE BUTTON ---
    if (target.closest(".close")) {
      e.preventDefault();
      e.stopPropagation();
      closeEverything(true);
      return;
    }
    // --- MEGANAV TOGGLE ---
    const megaToggle = target.closest("[data-megamenu]");
    if (megaToggle && !megaToggle.classList.contains("close")) {
      e.preventDefault();
      const id = megaToggle.getAttribute("data-megamenu");
      if (id !== "quicklinks-search") closeQuicklinksSearch();
      if (id === "quicklinks-search") closeOtherDropdowns(null, null); // close any open dropdowns (e.g. "For You") when quicklinks-search opens
      const panel = document.getElementById(id);
      const isExpanded = megaToggle.getAttribute("aria-expanded") === "true";
      closeOtherMegamenus(panel, megaToggle);
      const newState = !isExpanded;
      syncAria(id, "megamenu", newState);
      if (panel) {
        panel.classList.toggle("active", newState);
        if (id === "quicklinks-search") {
          if (newState) {
            panel.removeAttribute("inert");
          } else {
            panel.setAttribute("inert", "");
          }
        }
      }
      document
        .querySelector(".main-header__megamenus")
        ?.classList.toggle("active", newState);
      if (newState) {
        setMainNavInert(true);
        focusFirstItem(id);
      } else {
        setMainNavInert(false);
      }
      return;
    }
    // --- DROPDOWN TOGGLE ---
    const dropToggle = target.closest(".dropdown-toggle");
    if (dropToggle) {
      e.preventDefault();
      const dropdown = dropToggle.nextElementSibling;
      const isOpen = dropdown?.classList.contains("active");
      closeOtherDropdowns(dropdown, dropToggle);
      const newState = !isOpen;
      dropdown?.classList.toggle("active", newState);
      dropToggle.setAttribute("aria-expanded", newState);
      return;
    }
    // --- DROPDOWN LINK CLICK ---
    // Close the dropdown when a link inside it is clicked
    const dropdownLink = target.closest(".dropdown-items a");
    if (dropdownLink) {
      const dropdown = dropdownLink.closest(".dropdown");
      const toggle = dropdown?.previousElementSibling;
      dropdown?.classList.remove("active");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      // don't return — let the link navigate normally
    }
    // --- MOBILE MENU TOGGLE ---
    const mobToggle = target.closest("[data-mobilemenu]");
    if (mobToggle) {
      e.preventDefault();
      closeQuicklinksSearch();
      const id = mobToggle.getAttribute("data-mobilemenu");
      const overlay = document.querySelector(".nav-overlay");
      const isExpanded = mobToggle.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeEverything(true);
      } else {
        syncAria(id, "mobilemenu", true);
        overlay?.classList.add("active");
        const closeBtn = overlay?.querySelector(".close.mobile");
        if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
      }
      return;
    }
    // --- OUTSIDE CLICK ---
    if (
      !target.closest(
        ".megamenu, .nav-overlay, .dropdown, [data-megamenu], .sidebar__panel, .sidebar__trigger, #quicklinks-search",
      )
    ) {
      closeEverything(true);
    }
  }
  // --- KEYBOARD HANDLER ---
  function handleGlobalKeydown(e) {
    const target = e.target;
    const megaToggle = target.closest("[data-megamenu]");
    if (e.key === "Tab") {
      const activeMega = document.querySelector(".megamenu.active");
      const mobileOverlay = document.querySelector(".nav-overlay.active");

      if (activeMega && !e.shiftKey) {
        const openId = activeMega.id;
        const owningTrigger = document.querySelector(
          `.main-nav__item [data-megamenu="${openId}"]:not(.close):not(.back)`,
        );
        if (owningTrigger && document.activeElement === owningTrigger) {
          e.preventDefault();
          const focusable = getFocusableElements(activeMega);
          if (focusable.length) focusable[0].focus();
          return;
        }
      }
      // Only trap if focus is actually inside the open panel
      if (activeMega && activeMega.contains(document.activeElement)) {
        handleFocusTrap(e, activeMega);
        return;
      }
      if (mobileOverlay && window.matchMedia("(max-width: 1024px)").matches) {
        handleWaypointTrap(e, mobileOverlay);
        return;
      }
    }
    if (e.key === "Escape") {
      closeEverything(true);
      return;
    }
    if (megaToggle) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        e.stopImmediatePropagation();
        megaToggle.click();
      }
    }
  }
  function closeOtherMegamenus(exceptPanel, exceptToggle) {
    document.querySelectorAll(".megamenu.active").forEach((p) => {
      if (p !== exceptPanel) p.classList.remove("active");
    });
    document.querySelectorAll("[data-megamenu].active").forEach((t) => {
      if (t !== exceptToggle) {
        t.classList.remove("active");
        t.setAttribute("aria-expanded", "false");
      }
    });
  }
  function closeOtherDropdowns(exceptPanel, exceptToggle) {
    document.querySelectorAll(".dropdown.active").forEach((d) => {
      if (d !== exceptPanel) d.classList.remove("active");
    });
    document
      .querySelectorAll('.dropdown-toggle[aria-expanded="true"]')
      .forEach((t) => {
        if (t !== exceptToggle) t.setAttribute("aria-expanded", "false");
      });
  }
  function closeEverything(closeOverlay = true) {
    const openMenu = document.querySelector(".megamenu.active");
    const menuId = openMenu ? openMenu.id : null;
    const activeMobileTrigger = document.querySelector(
      '[data-mobilemenu][aria-expanded="true"]',
    );
    closeQuicklinksSearch();
    document
      .querySelectorAll(
        ".megamenu.active, .dropdown.active, .sidebar__panel.active",
      )
      .forEach((p) => p.classList.remove("active"));
    if (closeOverlay) {
      document
        .querySelectorAll(".nav-overlay.active")
        .forEach((o) => o.classList.remove("active"));
      document.querySelectorAll("[data-mobilemenu]").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-expanded", "false");
      });
    }
    document
      .querySelectorAll("[data-megamenu], .dropdown-toggle, .sidebar__trigger")
      .forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-expanded", "false");
      });
    document
      .querySelector(".main-header__megamenus")
      ?.classList.remove("active");
    setMainNavInert(false);
    if (menuId) {
      const originalTrigger = document.querySelector(
        `[data-megamenu="${menuId}"]:not(.close):not(.back)`,
      );
      if (originalTrigger) setTimeout(() => originalTrigger.focus(), 10);
    } else if (activeMobileTrigger) {
      setTimeout(() => activeMobileTrigger.focus(), 10);
    }
  }
  function syncAria(id, type, state) {
    const attr = `[data-${type}="${id}"]`;
    document.querySelectorAll(attr).forEach((el) => {
      el.setAttribute("aria-expanded", state);
      el.classList.toggle("active", state);
    });
  }
  function init() {
    // Sanitize any malformed aria-expanded values (e.g. " " from templates)
    document.querySelectorAll("[aria-expanded]").forEach((el) => {
      const val = el.getAttribute("aria-expanded");
      if (!val || val.trim() === "") el.setAttribute("aria-expanded", "false");
    });
    // Ensure no megamenu panels start inert
    document.querySelectorAll(".megamenu").forEach((p) => {
      p.removeAttribute("inert");
    });
    // Lock quicklinks panel out of tab order on page load
    const searchPanel = document.getElementById("quicklinks-search");
    if (searchPanel) searchPanel.setAttribute("inert", "");
    tryInitInPageNav();
    initDeepLinking();
    initMobileViewportFix();
    document.addEventListener("click", handleGlobalClicks);
    document.addEventListener("keydown", handleGlobalKeydown);

    // --- DROPDOWN FOCUS-OUT HANDLER ---
    // Closes any open dropdown when focus leaves it (e.g. tabbing past the last item)
    document.addEventListener("focusout", (e) => {
      const relatedTarget = e.relatedTarget;
      document.querySelectorAll(".dropdown.active").forEach((dropdown) => {
        const toggle = dropdown.previousElementSibling;
        // close if focus is not going to the dropdown itself or its toggle button
        if (!dropdown.contains(relatedTarget) && relatedTarget !== toggle) {
          dropdown.classList.remove("active");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    document.addEventListener(
      "toggle",
      (e) => {
        if (!(e.target instanceof HTMLDetailsElement)) return;
        const groupContainer = e.target.closest("[data-details-collection]");
        if (!groupContainer) return;
        updateDetailsToggleLabel(groupContainer);
      },
      true,
    );
    document
      .querySelectorAll("[data-details-collection]")
      .forEach(updateDetailsToggleLabel);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
