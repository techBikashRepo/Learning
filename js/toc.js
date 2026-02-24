/* ─────────────────────────────────────────────────────────────
   TOC.JS — Auto table of contents + active section tracking
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /**
   * Generates a TOC from all h2 and h3 headings inside .lesson-body.
   * Injects the result into #toc-list.
   * Also adds anchor links to each heading.
   */
  function buildTOC() {
    const body = document.querySelector(".lesson-body");
    const tocList = document.getElementById("toc-list");
    const tocEl = document.querySelector(".toc-aside");

    if (!body || !tocList) return;

    const headings = Array.from(body.querySelectorAll("h2, h3"));

    if (headings.length < 2) {
      // Not enough headings to be useful
      if (tocEl) tocEl.style.display = "none";
      return;
    }

    // Build anchor slugs (deduplicate)
    const slugCount = {};

    headings.forEach((h) => {
      // Generate slug from text content
      const rawText = h.textContent.replace(/\s*#\s*$/, "").trim();
      let slug = rawText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-") // spaces → hyphens
        .replace(/-+/g, "-") // collapse multiple hyphens
        .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens

      // Deduplicate slugs
      if (slugCount[slug] !== undefined) {
        slugCount[slug]++;
        slug = slug + "-" + slugCount[slug];
      } else {
        slugCount[slug] = 0;
      }

      h.id = slug;

      // Add anchor link
      const anchor = document.createElement("a");
      anchor.className = "heading-anchor";
      anchor.href = "#" + slug;
      anchor.setAttribute("aria-hidden", "true");
      anchor.textContent = "#";
      h.appendChild(anchor);
    });

    // Build TOC HTML
    const fragment = document.createDocumentFragment();

    headings.forEach((h) => {
      const li = document.createElement("li");
      li.className = "toc-item " + (h.tagName === "H3" ? "toc-h3" : "toc-h2");

      const a = document.createElement("a");
      a.className = "toc-link";
      a.href = "#" + h.id;
      // Strip the trailing # anchor from display text
      a.textContent = h.textContent.replace(/\s*#\s*$/, "").trim();

      a.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById(h.id);
        if (target) {
          const headerH =
            parseInt(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--header-height",
              ),
            ) || 56;
          const top =
            target.getBoundingClientRect().top + window.scrollY - headerH - 16;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });

      li.appendChild(a);
      fragment.appendChild(li);
    });

    tocList.innerHTML = "";
    tocList.appendChild(fragment);

    // ── Active section tracking (IntersectionObserver) ──
    initActiveSectionTracking(headings);
  }

  /**
   * Uses IntersectionObserver to highlight the currently visible
   * TOC section as the user scrolls.
   * @param {Element[]} headings
   */
  function initActiveSectionTracking(headings) {
    const tocLinks = document.querySelectorAll(".toc-link");
    if (!tocLinks.length) return;

    let activeId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        });
        updateActiveLink();
      },
      {
        rootMargin: "-10% 0px -80% 0px",
        threshold: 0,
      },
    );

    headings.forEach((h) => observer.observe(h));

    function updateActiveLink() {
      tocLinks.forEach((link) => {
        const href = link.getAttribute("href").slice(1); // strip '#'
        link.classList.toggle("is-active", href === activeId);
      });
    }
  }

  // Expose
  window.buildTOC = buildTOC;
})();
