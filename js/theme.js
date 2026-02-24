/* ─────────────────────────────────────────────────────────────
   THEME.JS — Dark/light mode, FOUC prevention
   This script is inlined in <head> to prevent flash of wrong theme
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  const STORAGE_KEY = "learn-theme";
  const DARK = "dark";
  const LIGHT = "light";

  /**
   * Reads stored preference, then system preference as fallback.
   * Applied immediately (before CSS paint) to prevent FOUC.
   */
  function getInitialTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === DARK || stored === LIGHT) return stored;
    } catch (_) {}

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK
      : LIGHT;
  }

  // Apply before first paint
  const theme = getInitialTheme();
  document.documentElement.setAttribute("data-theme", theme);

  // Expose globally so toggle button can use it
  window.__theme = {
    /**
     * Returns the current theme.
     * @returns {'dark'|'light'}
     */
    get() {
      return document.documentElement.getAttribute("data-theme") || LIGHT;
    },

    /**
     * Sets the theme and persists it.
     * @param {'dark'|'light'} newTheme
     */
    set(newTheme) {
      document.documentElement.setAttribute("data-theme", newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch (_) {}
      window.__theme._notifyListeners(newTheme);
    },

    /**
     * Toggles between dark and light.
     */
    toggle() {
      window.__theme.set(window.__theme.get() === DARK ? LIGHT : DARK);
    },

    /** @private */
    _listeners: [],

    /** @param {Function} fn */
    onChange(fn) {
      window.__theme._listeners.push(fn);
    },

    /** @private */
    _notifyListeners(t) {
      window.__theme._listeners.forEach((fn) => fn(t));
    },
  };
})();
