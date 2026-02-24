/* ─────────────────────────────────────────────────────────────
   SIDEBAR.JS — Generate, populate, and control the sidebar
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /**
   * Builds the sidebar navigation from the curriculum manifest.
   *
   * @param {Object}   curriculum  — parsed curriculum.json
   * @param {string}   activeChapterSlug
   * @param {string}   activeLessonSlug
   */
  function buildSidebar(curriculum, activeChapterSlug, activeLessonSlug) {
    const container = document.getElementById("sidebar-nav");
    if (!container || !curriculum) return;

    const fragment = document.createDocumentFragment();

    curriculum.chapters.forEach((chapter, chIdx) => {
      const isActiveChapter = chapter.slug === activeChapterSlug;

      // ── Chapter group wrapper ──
      const chapterEl = document.createElement("div");
      chapterEl.className =
        "sidebar-chapter" + (isActiveChapter ? " is-open" : "");
      chapterEl.dataset.chapterSlug = chapter.slug;

      // ── Chapter header (collapsible toggle) ──
      const header = document.createElement("button");
      header.className = "sidebar-chapter-header";
      header.setAttribute("aria-expanded", isActiveChapter ? "true" : "false");
      header.setAttribute("aria-controls", "chapter-lessons-" + chapter.slug);
      header.innerHTML = `
        <span class="sidebar-chapter-title">${escapeHTML(chapter.title)}</span>
        <svg class="sidebar-chapter-chevron" viewBox="0 0 16 16" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
          <polyline points="6,4 10,8 6,12"/>
        </svg>`;

      header.addEventListener("click", () => {
        const isOpen = chapterEl.classList.toggle("is-open");
        header.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      // ── Lesson list ──
      const lessonList = document.createElement("ul");
      lessonList.className = "sidebar-lessons";
      lessonList.id = "chapter-lessons-" + chapter.slug;
      lessonList.setAttribute("role", "list");

      chapter.lessons.forEach((lesson, lIdx) => {
        const isActive = lesson.slug === activeLessonSlug && isActiveChapter;

        const li = document.createElement("li");
        li.setAttribute("role", "listitem");

        const link = document.createElement("a");
        link.className = "sidebar-lesson-link" + (isActive ? " is-active" : "");
        link.href = `lesson.html?lesson=${chapter.slug}/${lesson.slug}`;
        link.setAttribute("aria-current", isActive ? "page" : "false");

        // Lesson number (1-based, zero-padded)
        const numStr = String(lIdx + 1).padStart(2, "0");

        link.innerHTML = `
          <span class="sidebar-lesson-num">${numStr}</span>
          <span class="truncate">${escapeHTML(lesson.title)}</span>`;

        // Close sidebar on mobile when navigating
        link.addEventListener("click", () => {
          if (window.innerWidth <= 768) {
            closeSidebar();
          }
        });

        li.appendChild(link);
        lessonList.appendChild(li);
      });

      chapterEl.appendChild(header);
      chapterEl.appendChild(lessonList);
      fragment.appendChild(chapterEl);
    });

    container.innerHTML = "";
    container.appendChild(fragment);

    // Scroll active link into view after a short delay (wait for CSS transition)
    setTimeout(() => {
      const activeLink = container.querySelector(
        ".sidebar-lesson-link.is-active",
      );
      if (activeLink) {
        activeLink.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }, 300);
  }

  /* ──────────────────────────────────────────────────────────
     Mobile sidebar open / close
     ────────────────────────────────────────────────────────── */

  function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (!sidebar) return;
    sidebar.classList.add("is-open");
    if (overlay) overlay.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (!sidebar) return;
    sidebar.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  function initSidebarToggle() {
    const toggleBtn = document.getElementById("sidebar-toggle");
    const overlay = document.getElementById("sidebar-overlay");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const sidebar = document.getElementById("sidebar");
        if (sidebar && sidebar.classList.contains("is-open")) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", closeSidebar);
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSidebar();
    });

    // Close on viewport resize back to desktop
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) closeSidebar();
      }, 150);
    });
  }

  /* ──────────────────────────────────────────────────────────
     Helpers
     ────────────────────────────────────────────────────────── */

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Expose
  window.buildSidebar = buildSidebar;
  window.initSidebarToggle = initSidebarToggle;
  window.closeSidebar = closeSidebar;
})();
