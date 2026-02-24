/* ─────────────────────────────────────────────────────────────
   CODE.JS — Syntax highlighting + copy buttons + lang badge
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  // Language display names
  const LANG_NAMES = {
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    typescript: "TypeScript",
    py: "Python",
    python: "Python",
    java: "Java",
    sql: "SQL",
    bash: "Bash",
    sh: "Shell",
    shell: "Shell",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    xml: "XML",
    md: "Markdown",
    markdown: "Markdown",
    go: "Go",
    rust: "Rust",
    c: "C",
    cpp: "C++",
    cs: "C#",
    csharp: "C#",
    php: "PHP",
    ruby: "Ruby",
    rb: "Ruby",
    swift: "Swift",
    kotlin: "Kotlin",
    http: "HTTP",
    nginx: "Nginx",
    dockerfile: "Dockerfile",
    graphql: "GraphQL",
    plaintext: "Plain Text",
    text: "Plain Text",
  };

  /**
   * Processes all <pre><code> blocks inside .lesson-body:
   * 1. Extracts language from class (hljs standard: language-xxx)
   * 2. Wraps in a styled container with a header bar
   * 3. Adds language badge
   * 4. Adds copy button
   * 5. Applies highlight.js if available
   */
  function initCodeBlocks() {
    const body = document.querySelector(".lesson-body");
    if (!body) return;

    const preBlocks = body.querySelectorAll("pre");
    if (!preBlocks.length) return;

    preBlocks.forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code) return;

      // ── Detect language ──
      let lang = "";
      const classes = Array.from(code.classList);
      const langClass = classes.find((c) => c.startsWith("language-"));
      if (langClass) {
        lang = langClass.replace("language-", "").toLowerCase();
      }

      // ── Detect architecture / ASCII diagram blocks ──
      // Plain code blocks (no language) that contain box-drawing characters
      // are architecture diagrams — skip syntax highlighting, center content.
      const isDiagram = !lang && containsBoxDrawing(code.textContent);
      if (isDiagram) {
        pre.classList.add("is-diagram");
      }

      const langDisplay = isDiagram
        ? "Diagram"
        : LANG_NAMES[lang] || (lang ? lang.toUpperCase() : "");

      // ── Apply highlight.js if loaded ──
      if (
        !isDiagram &&
        window.hljs &&
        lang &&
        lang !== "plaintext" &&
        lang !== "text"
      ) {
        try {
          hljs.highlightElement(code);
        } catch (e) {
          try {
            hljs.highlightElement(code);
          } catch (_) {}
        }
      }
      // Note: skip hljs auto-detect entirely — it misidentifies ASCII art

      // ── Build header bar ──
      const header = document.createElement("div");
      header.className =
        "code-block-header" + (isDiagram ? " is-diagram-header" : "");

      const langBadge = document.createElement("span");
      langBadge.className = "code-lang";
      langBadge.textContent = langDisplay;

      const copyBtn = buildCopyButton(code);

      header.appendChild(langBadge);
      header.appendChild(copyBtn);

      // ── Inject header before code ──
      pre.insertBefore(header, pre.firstChild);
    });
  }

  /**
   * Creates a copy button for a given code element.
   * @param {HTMLElement} codeEl
   * @returns {HTMLButtonElement}
   */
  function buildCopyButton(codeEl) {
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.setAttribute("aria-label", "Copy code");
    btn.innerHTML = `
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="5.5" y="5.5" width="9" height="9" rx="1.5"/>
        <path d="M3.5 10.5H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v1.5"/>
      </svg>
      <span>Copy</span>`;

    btn.addEventListener("click", () => {
      const text = codeEl.textContent || "";
      copyToClipboard(text).then(() => {
        btn.classList.add("is-copied");
        btn.querySelector("span").textContent = "Copied!";
        btn.innerHTML = `
          <svg viewBox="0 0 16 16" fill="none" stroke="#2ea043" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="2,8 6,12 14,4"/>
          </svg>
          <span>Copied!</span>`;
        setTimeout(() => {
          btn.classList.remove("is-copied");
          btn.innerHTML = `
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="5.5" y="5.5" width="9" height="9" rx="1.5"/>
              <path d="M3.5 10.5H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v1.5"/>
            </svg>
            <span>Copy</span>`;
        }, 2000);
      });
    });

    return btn;
  }

  /**
   * Copies text to clipboard, falling back to execCommand for older browsers.
   * @param {string} text
   * @returns {Promise<void>}
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback
    return new Promise((resolve) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText =
        "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
      } catch (_) {}
      document.body.removeChild(ta);
      resolve();
    });
  }

  /**
   * Upgrades blockquotes that start with a keyword label to styled callout boxes.
   * Supported keywords: NOTE, TIP, WARNING, WARN, DANGER, IMPORTANT
   */
  function upgradeCallouts() {
    const body = document.querySelector(".lesson-body");
    if (!body) return;

    const blockquotes = body.querySelectorAll("blockquote");

    const MAP = {
      NOTE: { cls: "callout-note", icon: "ℹ️", label: "Note" },
      INFO: { cls: "callout-note", icon: "ℹ️", label: "Info" },
      TIP: { cls: "callout-tip", icon: "💡", label: "Tip" },
      HINT: { cls: "callout-tip", icon: "💡", label: "Hint" },
      TIL: { cls: "callout-tip", icon: "💡", label: "TIL" },
      WARNING: { cls: "callout-warn", icon: "⚠️", label: "Warning" },
      WARN: { cls: "callout-warn", icon: "⚠️", label: "Warning" },
      CAUTION: { cls: "callout-warn", icon: "⚠️", label: "Caution" },
      DANGER: { cls: "callout-danger", icon: "🚨", label: "Danger" },
      ERROR: { cls: "callout-danger", icon: "🚨", label: "Error" },
      IMPORTANT: { cls: "callout-note", icon: "📌", label: "Important" },
    };

    blockquotes.forEach((bq) => {
      const firstP = bq.querySelector("p");
      if (!firstP) return;

      // Check if text starts with **KEYWORD** or KEYWORD:
      const raw = firstP.innerHTML.trim();
      let matched = null;
      let keyword = null;

      // Match **KEYWORD** or **KEYWORD:** patterns
      const boldMatch = raw.match(/^<strong>([A-Z]+):?<\/strong>/i);
      if (boldMatch) {
        keyword = boldMatch[1].toUpperCase();
        if (MAP[keyword]) matched = MAP[keyword];
      }

      if (!matched) return;

      // Build callout
      const callout = document.createElement("div");
      callout.className = "callout " + matched.cls;

      const iconEl = document.createElement("div");
      iconEl.className = "callout-icon";
      iconEl.setAttribute("aria-hidden", "true");
      iconEl.textContent = matched.icon;

      const bodyEl = document.createElement("div");
      bodyEl.className = "callout-body";

      const titleEl = document.createElement("div");
      titleEl.className = "callout-title";
      titleEl.textContent = matched.label;

      // Remove the **KEYWORD** from the first paragraph
      firstP.innerHTML = raw
        .replace(/^<strong>[A-Z]+:?<\/strong>\s*/i, "")
        .trim();

      bodyEl.appendChild(titleEl);

      // Move all children of bq into bodyEl
      while (bq.firstChild) {
        bodyEl.appendChild(bq.firstChild);
      }

      callout.appendChild(iconEl);
      callout.appendChild(bodyEl);

      bq.parentNode.replaceChild(callout, bq);
    });
  }

  /**
   * Wraps all <table> elements in a .table-wrapper for horizontal scroll.
   */
  function wrapTables() {
    const body = document.querySelector(".lesson-body");
    if (!body) return;

    body.querySelectorAll("table").forEach((table) => {
      if (table.parentNode.classList.contains("table-wrapper")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }
  /**
   * Returns true if the string contains Unicode box-drawing characters,
   * which indicates an ASCII architecture / flow diagram.
   * @param {string} text
   * @returns {boolean}
   */
  function containsBoxDrawing(text) {
    // Box Drawing block: U+2500–U+257F
    // Block Elements:    U+2580–U+259F
    // Arrows:            common arrow chars used in diagrams
    return /[\u2500-\u257F\u2580-\u259F\u2190-\u21FF▼▲→←↑↓►◄▶◀]/.test(text);
  }
  /**
   * Reformats list items that follow the pattern:
   *   **Term** — description text
   * into a proper card-style definition layout with the term visually
   * separated from the description.
   *
   * Also applies .is-content-heading to standalone bold paragraphs like:
   *   **1. Nodes (End Devices)**
   * so they get proper heading-level styling.
   */
  function formatDefinitionItems() {
    const body = document.querySelector(".lesson-body");
    if (!body) return;

    // ── Pattern 1: <li> starting with <strong>Term</strong> — description ──
    // Matches both em-dash (—), en-dash (–), and double-hyphen (--)
    body.querySelectorAll("li").forEach((li) => {
      const html = li.innerHTML.trim();

      // Must start with <strong>...</strong> immediately followed by a dash + text
      const m = html.match(
        /^(<strong>[\s\S]*?<\/strong>)\s*(?:[—–]|--)\s*([\s\S]+)$/,
      );
      if (!m) return;

      const [, termHTML, descHTML] = m;

      li.classList.add("is-def-item");
      li.innerHTML =
        `<span class="def-content">` +
        `<span class="def-term">${termHTML}</span>` +
        `<span class="def-desc">${descHTML.trim()}</span>` +
        `</span>`;
    });

    // ── Pattern 2: <p> containing ONLY a <strong> block ──
    // e.g. **1. Nodes (End Devices)** rendered as <p><strong>…</strong></p>
    body.querySelectorAll("p").forEach((p) => {
      if (/^<strong>[\s\S]+<\/strong>$/.test(p.innerHTML.trim())) {
        p.classList.add("is-content-heading");
      }
    });
  }

  // Expose
  window.initCodeBlocks = initCodeBlocks;
  window.upgradeCallouts = upgradeCallouts;
  window.wrapTables = wrapTables;
  window.formatDefinitionItems = formatDefinitionItems;
})();
