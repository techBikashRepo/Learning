/* ============================================================
   MAIN JAVASCRIPT - Premium Learning Platform
   ============================================================ */

(function () {
  "use strict";

  // Theme Toggle
  const initThemeToggle = () => {
    const themeToggle = document.getElementById("theme-toggle");
    const html = document.documentElement;

    if (!themeToggle) return;

    // Load saved theme (default to light for better reading)
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "light") {
      html.classList.add("light");
      updateThemeIcon("☀️");
    } else {
      updateThemeIcon("🌙");
    }

    themeToggle.addEventListener("click", () => {
      const isLight = html.classList.toggle("light");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      updateThemeIcon(isLight ? "☀️" : "🌙");
    });

    function updateThemeIcon(icon) {
      const iconElement = themeToggle.querySelector(".theme-toggle__icon");
      if (iconElement) {
        iconElement.textContent = icon;
      }
    }
  };

  // Reading Progress Bar
  const initProgressBar = () => {
    const progressBar = document.querySelector(".progress-bar");
    if (!progressBar) return;

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const progress = (scrollTop / documentHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  };

  // Responsive Tables
  const initResponsiveTables = () => {
    const tables = document.querySelectorAll("article table");
    tables.forEach((table) => {
      if (!table.parentElement.classList.contains("table-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "table-wrapper";
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  };

  // Initialize
  const init = () => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeFeatures);
    } else {
      initializeFeatures();
    }
  };

  const initializeFeatures = () => {
    initThemeToggle();
    initProgressBar();
    initResponsiveTables();
    console.log("✨ Learning Platform initialized");
  };

  init();
})();
