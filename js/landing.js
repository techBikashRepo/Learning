// ============================================================
// LANDING PAGE INTERACTIONS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
});

// ------------------------------------------------------------
// THEME TOGGLE
// ------------------------------------------------------------ */
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const moonIcon = document.getElementById("theme-icon-moon");
  const sunIcon = document.getElementById("theme-icon-sun");

  // Check for saved theme preference or default to 'dark'
  const currentTheme = localStorage.getItem("theme") || "dark";
  html.classList.toggle("light", currentTheme === "light");
  updateThemeIcons(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = html.classList.toggle("light");
      const newTheme = isLight ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      updateThemeIcons(newTheme);

      // Add subtle transition effect
      html.style.transition = "background-color 0.3s ease";
      setTimeout(() => {
        html.style.transition = "";
      }, 300);
    });
  }

  function updateThemeIcons(theme) {
    if (moonIcon && sunIcon) {
      if (theme === "light") {
        moonIcon.style.display = "none";
        sunIcon.style.display = "block";
      } else {
        moonIcon.style.display = "block";
        sunIcon.style.display = "none";
      }
    }
  }
}

// ------------------------------------------------------------
// MOBILE MENU
// ------------------------------------------------------------
function initMobileMenu() {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      navLinks.classList.toggle("active");

      // Prevent body scroll when menu is open
      document.body.style.overflow = navLinks.classList.contains("active")
        ? "hidden"
        : "";
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }
}

// ------------------------------------------------------------
// SCROLL ANIMATIONS
// ------------------------------------------------------------
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  document
    .querySelectorAll(".card, .feature-card, .path-card, .testimonial-card")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(el);
    });

  // Add visible class styles dynamically
  const style = document.createElement("style");
  style.textContent = `
    .card.visible,
    .feature-card.visible,
    .path-card.visible,
    .testimonial-card.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ------------------------------------------------------------
// SMOOTH SCROLL
// ------------------------------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const navbarHeight =
          document.querySelector(".navbar")?.offsetHeight || 0;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight -
          20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ------------------------------------------------------------
// NAVBAR SCROLL EFFECT
// ------------------------------------------------------------
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // Add shadow when scrolled
  if (currentScroll > 50) {
    navbar?.classList.add("scrolled");
  } else {
    navbar?.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// Add scrolled class styles
const navbarStyle = document.createElement("style");
navbarStyle.textContent = `
  .navbar.scrolled {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;
document.head.appendChild(navbarStyle);

// ------------------------------------------------------------
// ANIMATED COUNTERS (for stats)
// ------------------------------------------------------------
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  const updateCounter = () => {
    start += increment;
    if (start < target) {
      element.textContent = Math.ceil(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

// Observe hero stats
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statValue = entry.target;
        const text = statValue.textContent;
        const number = parseInt(text.replace(/[^0-9]/g, ""));

        if (number && !isNaN(number)) {
          animateCounter(statValue, number, 1500);
        }

        statsObserver.unobserve(statValue);
      }
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll(".hero-stats .stat-value").forEach((stat) => {
  statsObserver.observe(stat);
});
