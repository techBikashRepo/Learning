/* ─────────────────────────────────────────────────────────────
   PROGRESS.JS — Scroll-based reading progress bar
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /**
   * Initialises the reading progress bar.
   * The bar fills as the user scrolls through the lesson article.
   * Only measures progress within the .lesson-article element, not the full page.
   */
  function initReadingProgress() {
    const bar = document.getElementById("progress-bar");
    const article = document.querySelector(".lesson-article");

    if (!bar) return;

    let ticking = false;

    function updateBar() {
      let percent;

      if (article) {
        const rect = article.getBoundingClientRect();
        const headerH =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--header-height",
            ),
          ) || 56;
        const totalH = article.offsetHeight;
        // How far the top of the article is from the viewport top
        const scrolled = -rect.top + headerH;
        const readable = totalH - (window.innerHeight - headerH);
        percent =
          readable > 0
            ? Math.min(100, Math.max(0, (scrolled / readable) * 100))
            : 0;
      } else {
        // Fallback: full-page scroll
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      }

      bar.style.width = percent.toFixed(2) + "%";
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateBar);
          ticking = true;
        }
      },
      { passive: true },
    );

    // Initial state
    updateBar();
  }

  // Expose
  window.initReadingProgress = initReadingProgress;
})();
