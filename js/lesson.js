/* ─────────────────────────────────────────────────────────────
   LESSON.JS — Main orchestrator for the lesson reader page
   Pipeline: URL → curriculum.json → fetch .md files → render
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════════
     CONSTANTS
     ══════════════════════════════════════════════════════════ */

  const CURRICULUM_PATH = "data/curriculum.json";
  const CONTENT_BASE = "../curriculum";

  /* ══════════════════════════════════════════════════════════
     ENTRY POINT
     ══════════════════════════════════════════════════════════ */

  document.addEventListener("DOMContentLoaded", async () => {
    // ── 1. Init sidebar toggle (mobile) ──
    if (window.initSidebarToggle) initSidebarToggle();

    // ── 2. Init theme button ──
    initThemeButton();

    // ── 3. Init reading progress (starts at 0) ──
    if (window.initReadingProgress) initReadingProgress();

    // ── 4. Parse URL ──
    const lessonParam = getLessonParam();
    if (!lessonParam) {
      renderError(
        "No lesson specified.",
        "Add ?lesson=chapter-slug/lesson-slug to the URL.",
      );
      return;
    }

    const [chapterSlug, lessonSlug] = lessonParam.split("/");
    if (!chapterSlug || !lessonSlug) {
      renderError(
        "Invalid lesson URL.",
        `Expected format: ?lesson=chapter-slug/lesson-slug`,
      );
      return;
    }

    // ── 5. Load curriculum ──
    let curriculum;
    try {
      curriculum = await fetchJSON(CURRICULUM_PATH);
    } catch (e) {
      renderError(
        "Could not load curriculum.",
        "Make sure curriculum.json is present in the data/ folder.",
      );
      return;
    }

    // ── 6. Resolve lesson from manifest ──
    const resolved = resolveLessonFromManifest(
      curriculum,
      chapterSlug,
      lessonSlug,
    );
    if (!resolved) {
      renderError(
        "Lesson not found.",
        `No lesson matches: ${chapterSlug}/${lessonSlug}`,
      );
      if (window.buildSidebar)
        buildSidebar(curriculum, chapterSlug, lessonSlug);
      return;
    }

    const { chapter, lesson, prevLesson, nextLesson } = resolved;

    // ── 7. Update document title & breadcrumb ──
    document.title = `${lesson.title} — ${curriculum.title}`;
    setBreadcrumb(chapter.title, lesson.title);

    // ── 8. Build sidebar (async, no await needed) ──
    if (window.buildSidebar) buildSidebar(curriculum, chapterSlug, lessonSlug);

    // ── 9. Fetch and render markdown ──
    await loadAndRenderLesson(chapter, lesson);

    // ── 10. Post-render enhancements ──
    if (window.upgradeCallouts) upgradeCallouts();
    if (window.wrapTables) wrapTables();
    if (window.initCodeBlocks) initCodeBlocks();
    if (window.formatDefinitionItems) formatDefinitionItems();

    // ── 11. Sticky Part 1 / 2 / 3 nav bar ──
    buildPartNav(lesson.parts);

    // ── 12. Rebuild progress after content paint ──
    requestAnimationFrame(() => {
      if (window.initReadingProgress) initReadingProgress();
    });

    // ── 13. Wire prev/next buttons ──
    renderPageNav(prevLesson, nextLesson, chapterSlug);
  });

  /* ══════════════════════════════════════════════════════════
     URL PARSING
     ══════════════════════════════════════════════════════════ */

  /**
   * Returns the value of the `lesson` query parameter.
   * e.g. "01-networking/01-what-is-a-network"
   * @returns {string|null}
   */
  function getLessonParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get("lesson") || null;
  }

  /* ══════════════════════════════════════════════════════════
     CURRICULUM RESOLUTION
     ══════════════════════════════════════════════════════════ */

  /**
   * Looks up a chapter + lesson by slug in the manifest.
   * Also computes the flat prev/next lesson references.
   *
   * @param {Object} curriculum
   * @param {string} chapterSlug
   * @param {string} lessonSlug
   * @returns {{ chapter, lesson, prevLesson, nextLesson, chapterSlug } | null}
   */
  function resolveLessonFromManifest(curriculum, chapterSlug, lessonSlug) {
    // Flatten all lessons into a single ordered array with chapter context
    const flat = curriculum.chapters.flatMap((ch) =>
      ch.lessons.map((l) => ({ lesson: l, chapter: ch })),
    );

    const idx = flat.findIndex(
      (item) =>
        item.chapter.slug === chapterSlug && item.lesson.slug === lessonSlug,
    );

    if (idx === -1) return null;

    const { chapter, lesson } = flat[idx];
    const prevItem = idx > 0 ? flat[idx - 1] : null;
    const nextItem = idx < flat.length - 1 ? flat[idx + 1] : null;

    return {
      chapter,
      lesson,
      prevLesson: prevItem
        ? {
            ...prevItem.lesson,
            chapterSlug: prevItem.chapter.slug,
            chapterTitle: prevItem.chapter.title,
          }
        : null,
      nextLesson: nextItem
        ? {
            ...nextItem.lesson,
            chapterSlug: nextItem.chapter.slug,
            chapterTitle: nextItem.chapter.title,
          }
        : null,
    };
  }

  /* ══════════════════════════════════════════════════════════
     LESSON LOADING & RENDERING
     ══════════════════════════════════════════════════════════ */

  /**
   * Fetches all markdown parts for a lesson, concatenates them,
   * converts to HTML via marked.js, and injects into the DOM.
   *
   * @param {Object} chapter
   * @param {Object} lesson
   */
  async function loadAndRenderLesson(chapter, lesson) {
    const contentEl = document.getElementById("lesson-content");
    if (!contentEl) return;

    // Show loading spinner
    contentEl.innerHTML = `
      <div class="lesson-loading">
        <div class="spinner"></div>
        <p>Loading lesson…</p>
      </div>`;

    try {
      // Build paths for all parts
      const partPaths = buildPartPaths(chapter, lesson);

      // Fetch all parts in parallel
      const parts = await Promise.all(
        partPaths.map((path, idx) =>
          fetchMarkdownPart(path, idx + 1, lesson.parts),
        ),
      );

      // Render each part's markdown independently so that the injected
      // part-anchor <div> elements are never processed by marked.js.
      const partHtmls = parts.map((md) =>
        md.trim() ? renderMarkdown(md) : "",
      );

      // Assemble: anchor → content → divider (before parts 2, 3, …)
      let fullHtml = "";
      partHtmls.forEach((html, i) => {
        if (!html) return;
        const partNum = i + 1;
        if (fullHtml) {
          fullHtml += `<div class="part-divider"><span class="part-divider-label">Part ${partNum} of ${lesson.parts}</span></div>\n`;
        }
        fullHtml += `<div id="part-anchor-${partNum}" class="part-anchor" data-part="${partNum}"></div>\n`;
        fullHtml += html;
      });

      contentEl.innerHTML = `<div class="lesson-body">${fullHtml}</div>`;
    } catch (err) {
      console.error("Failed to load lesson:", err);
      contentEl.innerHTML = `
        <div class="lesson-error">
          <h2>Lesson files not found</h2>
          <p>Could not load the markdown files for this lesson. Make sure the curriculum folder is accessible from the server.</p>
          <p style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-faint); margin-top: 1rem;">${err.message}</p>
        </div>`;
    }
  }

  /**
   * Builds the encoded fetch paths for all parts of a lesson.
   *
   * File naming convention:
   *   {CONTENT_BASE}/{chapter.folder}/{lesson.folder}/01-{lesson.title}.md
   *
   * All path segments are individually URI-encoded to handle
   * spaces, dashes, em-dashes and special characters.
   *
   * @param {Object} chapter
   * @param {Object} lesson
   * @returns {string[]}
   */
  function buildPartPaths(chapter, lesson) {
    const paths = [];
    for (let i = 1; i <= lesson.parts; i++) {
      const partNum = String(i).padStart(2, "0");
      const fileName = `${partNum}-${lesson.title}.md`;

      const encoded = [
        encodeURIComponent(chapter.folder),
        encodeURIComponent(lesson.folder),
        encodeURIComponent(fileName),
      ].join("/");

      paths.push(`${CONTENT_BASE}/${encoded}`);
    }
    return paths;
  }

  /**
   * Fetches a single markdown part. Returns empty string if 404.
   *
   * @param {string} path
   * @param {number} partNum  1-based
   * @param {number} total    total parts
   * @returns {Promise<string>}
   */
  async function fetchMarkdownPart(path, partNum, total) {
    const res = await fetch(path);
    if (!res.ok) {
      // If a specific part is missing but there are others, return empty rather than failing
      if (res.status === 404 && partNum > 1) return "";
      throw new Error(`HTTP ${res.status} fetching ${path}`);
    }
    return res.text();
  }

  /**
   * Converts a markdown string to HTML.
   * Uses marked.js (expected to be available as window.marked).
   *
   * @param {string} markdown
   * @returns {string} HTML string
   */
  function renderMarkdown(markdown) {
    if (!window.marked) {
      console.warn("marked.js not loaded — cannot render markdown");
      return `<pre>${escapeHtml(markdown)}</pre>`;
    }

    // Configure marked (v9+ removed mangle/headerIds — only gfm/breaks remain)
    marked.use({
      gfm: true, // GitHub Flavored Markdown: tables, strikethrough, task lists
      breaks: false, // Don't turn single newlines into <br> — preserve paragraph flow
    });

    return marked.parse(markdown);
  }

  /* ══════════════════════════════════════════════════════════
     PAGE NAVIGATION (PREV / NEXT)
     ══════════════════════════════════════════════════════════ */

  /**
   * Populates the prev/next navigation area.
   *
   * @param {Object|null} prevLesson
   * @param {Object|null} nextLesson
   * @param {string}      currentChapterSlug  (for context)
   */
  function renderPageNav(prevLesson, nextLesson, currentChapterSlug) {
    const nav = document.getElementById("page-nav");
    if (!nav) return;

    let html = "";

    if (prevLesson) {
      const href = `lesson.html?lesson=${prevLesson.chapterSlug}/${prevLesson.slug}`;
      html += `
        <a class="page-nav-btn is-prev" href="${href}" aria-label="Previous lesson">
          <span class="page-nav-label">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="10,4 6,8 10,12"/>
            </svg>
            Previous
          </span>
          <span class="page-nav-title">${escapeHtml(prevLesson.title)}</span>
          ${prevLesson.chapterTitle ? `<span class="page-nav-chapter">${escapeHtml(prevLesson.chapterTitle)}</span>` : ""}
        </a>`;
    } else {
      html += `<div class="page-nav-btn" style="opacity:0;pointer-events:none;"></div>`;
    }

    if (nextLesson) {
      const href = `lesson.html?lesson=${nextLesson.chapterSlug}/${nextLesson.slug}`;
      html += `
        <a class="page-nav-btn is-next" href="${href}" aria-label="Next lesson">
          <span class="page-nav-label">
            Next
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6,4 10,8 6,12"/>
            </svg>
          </span>
          <span class="page-nav-title">${escapeHtml(nextLesson.title)}</span>
          ${nextLesson.chapterTitle ? `<span class="page-nav-chapter">${escapeHtml(nextLesson.chapterTitle)}</span>` : ""}
        </a>`;
    } else {
      html += `<div class="page-nav-btn" style="opacity:0;pointer-events:none;"></div>`;
    }

    nav.innerHTML = html;
  }

  /* ══════════════════════════════════════════════════════════
     BREADCRUMB
     ══════════════════════════════════════════════════════════ */

  function setBreadcrumb(chapterTitle, lessonTitle) {
    const chapterEl = document.getElementById("breadcrumb-chapter");
    const lessonEl = document.getElementById("breadcrumb-lesson");
    if (chapterEl) chapterEl.textContent = chapterTitle;
    if (lessonEl) lessonEl.textContent = lessonTitle;
  }

  /* ══════════════════════════════════════════════════════════
     THEME BUTTON
     ══════════════════════════════════════════════════════════ */

  function initThemeButton() {
    const btn = document.getElementById("theme-toggle");
    if (!btn || !window.__theme) return;
    btn.addEventListener("click", () => window.__theme.toggle());
    btn.setAttribute("aria-label", "Toggle dark/light mode");
  }

  /* ══════════════════════════════════════════════════════════
     ERROR RENDERING
     ══════════════════════════════════════════════════════════ */

  function renderError(heading, detail) {
    const contentEl = document.getElementById("lesson-content");
    if (!contentEl) return;
    contentEl.innerHTML = `
      <div class="lesson-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-faint)"
             stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h2>${escapeHtml(heading)}</h2>
        <p>${escapeHtml(detail)}</p>
      </div>`;
  }

  /* ══════════════════════════════════════════════════════════
     UTILITIES
     ══════════════════════════════════════════════════════════ */

  async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${path}`);
    return res.json();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ══════════════════════════════════════════════════════
     PART NAVIGATION
     ══════════════════════════════════════════════════════ */

  /**
   * Builds and injects the sticky Part 1 / Part 2 / Part 3 navigation bar.
   * Positioned at the top of the lesson article, sticks below the site header.
   * @param {number} totalParts
   */
  function buildPartNav(totalParts) {
    // Remove any existing nav from a previous lesson load
    const existing = document.getElementById("part-nav");
    if (existing) existing.remove();
    if (totalParts <= 1) return;

    const nav = document.createElement("div");
    nav.id = "part-nav";
    nav.className = "part-nav";
    nav.setAttribute("role", "tablist");
    nav.setAttribute("aria-label", "Navigate between lesson parts");

    for (let i = 1; i <= totalParts; i++) {
      const btn = document.createElement("button");
      btn.className = "part-nav-btn" + (i === 1 ? " is-active" : "");
      btn.dataset.part = String(i);
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", i === 1 ? "true" : "false");
      btn.innerHTML = `
        <span class="part-nav-num" aria-hidden="true">${i}</span>
        <span class="part-nav-label">Part ${i}</span>`;
      btn.addEventListener("click", () => scrollToPart(i));
      nav.appendChild(btn);
    }

    // Insert before #lesson-content so it sits at the top of the article
    const content = document.getElementById("lesson-content");
    if (content && content.parentNode) {
      content.parentNode.insertBefore(nav, content);
    }

    initPartScrollTracking(totalParts, nav);
  }

  /**
   * Smooth-scrolls to a part anchor, accounting for the fixed header
   * and the sticky part-nav bar heights.
   * @param {number} partNum
   */
  function scrollToPart(partNum) {
    const anchor = document.getElementById("part-anchor-" + partNum);
    if (!anchor) return;
    const headerH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
      ) || 56;
    const partNavEl = document.getElementById("part-nav");
    const partNavH = partNavEl ? partNavEl.offsetHeight : 0;
    const top =
      anchor.getBoundingClientRect().top +
      window.scrollY -
      headerH -
      partNavH -
      16;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  /**
   * Highlights the correct Part button as the user scrolls.
   * Uses scroll events + rAF for performance.
   * @param {number} totalParts
   * @param {HTMLElement} nav
   */
  function initPartScrollTracking(totalParts, nav) {
    const btns = nav.querySelectorAll(".part-nav-btn");

    function getActivePart() {
      const headerH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height",
          ),
        ) || 56;
      const partNavEl = document.getElementById("part-nav");
      const navH = partNavEl ? partNavEl.offsetHeight : 48;
      const threshold = headerH + navH + 40;

      let active = 1;
      for (let i = 1; i <= totalParts; i++) {
        const anchor = document.getElementById("part-anchor-" + i);
        if (anchor && anchor.getBoundingClientRect().top <= threshold) {
          active = i;
        }
      }
      return active;
    }

    function updateBtns() {
      const active = getActivePart();
      btns.forEach((btn) => {
        const isActive = parseInt(btn.dataset.part) === active;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    }

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            updateBtns();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true },
    );

    // Set initial state after a short delay (content may still be painting)
    setTimeout(updateBtns, 100);
  }
})();
