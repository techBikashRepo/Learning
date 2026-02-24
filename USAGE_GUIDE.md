# 📘 USAGE GUIDE — Premium Learning Platform

A step-by-step guide for using and customizing your new premium learning platform.

---

## 📂 Project Structure

```
site/
├── index.html              → Auto-redirects to home.html
├── home.html               → Landing page (hero, features, course cards)
├── courses.html            → Complete course index
├── about.html              → About the platform
├── example-lesson.html     → Example of perfect lesson formatting
├── template.html           → Template for creating new lessons
├── README.md               → Full documentation
├── USAGE_GUIDE.md          → This file
│
├── css/
│   ├── main.css           → Complete design system (EVERYTHING)
│   ├── landing.css        → Landing page specific styles
│   └── courses.css        → Courses page specific styles
│
├── js/
│   └── main.js            → All interactions (theme, progress, code copy)
│
└── [curriculum folders]/
    ├── networking/
    ├── databases/
    ├── backend/
    ├── security/
    └── architecture/
```

---

## 🚀 Quick Start

### 1. **View the Platform**

Open in browser:

```bash
# Windows
start site\home.html

# Mac/Linux
open site/home.html
```

### 2. **Test Features**

- Click the **moon/sun icon** to toggle dark/light mode
- Scroll a lesson page to see the **progress bar** fill
- Hover over **code blocks** to see copy buttons
- Try the **mobile menu** by resizing your browser
- Press `Ctrl+/` to toggle theme with keyboard

---

## ✍️ Creating New Lessons

### Method 1: Using the Template

1. **Copy `template.html`:**

   ```bash
   cp site/template.html site/networking/lesson-XX.html
   ```

2. **Find and replace these placeholders:**

   ```
   [LESSON_TITLE]          → "TCP 3-Way Handshake"
   [MODULE_NAME]           → "Networking"
   [LESSON_DESCRIPTION]    → "Understanding how TCP..."
   [ICON]                  → "🌐"
   [LESSON_NUM]            → "12"
   [PREVIOUS_LESSON_URL]   → "lesson-11.html"
   [NEXT_LESSON_URL]       → "lesson-13.html"
   [PREVIOUS_LESSON_TITLE] → "TCP vs UDP"
   [NEXT_LESSON_TITLE]     → "TCP Reliability"
   ```

3. **Write your content** in the `<article>` section

4. **Update the sidebar** with all lessons in that module

### Method 2: Copy Example Lesson

1. **Copy `example-lesson.html`:**

   ```bash
   cp site/example-lesson.html site/networking/lesson-XX.html
   ```

2. **Replace content** with your lesson material

3. **Update navigation links**

---

## 🎨 Using Components

### Headings

```html
<h1>Main Lesson Title</h1>
<h2>Major Section</h2>
<h3>Subsection</h3>
<h4>Minor Point</h4>
```

**Rules:**

- Only **one `<h1>`** per page (the lesson title)
- Use `<h2>` for main sections
- Use `<h3>` for subsections under `<h2>`

---

### Callout Boxes

**TIP (Blue):**

```html
<div class="callout callout--tip">
  <div class="callout__icon">💡</div>
  <div class="callout__content">
    <p><strong>Interview Tip</strong></p>
    <p>Use analogies to explain complex concepts.</p>
  </div>
</div>
```

**WARNING (Amber):**

```html
<div class="callout callout--warning">
  <div class="callout__icon">⚠️</div>
  <div class="callout__content">
    <p><strong>Common Mistake</strong></p>
    <p>Don't confuse X with Y.</p>
  </div>
</div>
```

**INFO (Gray):**

```html
<div class="callout callout--info">
  <div class="callout__icon">ℹ️</div>
  <div class="callout__content">
    <p><strong>Quick Note</strong></p>
    <p>Additional context here.</p>
  </div>
</div>
```

**SUCCESS (Green):**

```html
<div class="callout callout--success">
  <div class="callout__icon">✅</div>
  <div class="callout__content">
    <p><strong>Key Takeaways</strong></p>
    <ul>
      <li>Point 1</li>
      <li>Point 2</li>
    </ul>
  </div>
</div>
```

---

### Code Blocks

**Simple (auto-styled):**

```html
<pre><code class="language-javascript">
const example = "Hello World";
console.log(example);
</code></pre>
```

**JavaScript automatically adds:**

- Copy button (top-right)
- Language label
- Proper styling

**Supported language classes:**

- `language-javascript`
- `language-python`
- `language-java`
- `language-sql`
- `language-bash`
- `language-html`
- `language-css`

---

### Inline Code

Use backticks in your text:

```html
<p>The <code>HTTP</code> protocol uses port 80.</p>
```

---

### Tables

```html
<table>
  <thead>
    <tr>
      <th>Protocol</th>
      <th>Port</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>HTTP</code></td>
      <td>80</td>
      <td>Web traffic</td>
    </tr>
    <tr>
      <td><code>HTTPS</code></td>
      <td>443</td>
      <td>Secure web</td>
    </tr>
  </tbody>
</table>
```

**Features:**

- Zebra striping
- Hover effects
- Responsive (scrolls on mobile)

---

### Lists

**Unordered:**

```html
<ul>
  <li>First point</li>
  <li>Second point</li>
  <li>Third point</li>
</ul>
```

**Ordered:**

```html
<ol>
  <li>Step one</li>
  <li>Step two</li>
  <li>Step three</li>
</ol>
```

---

### Navigation Buttons

**At end of lesson:**

```html
<nav class="lesson-nav">
  <a href="lesson-11.html" class="lesson-nav__btn">
    <span class="lesson-nav__label">Previous Lesson</span>
    <span class="lesson-nav__title">TCP vs UDP</span>
  </a>

  <a href="lesson-13.html" class="lesson-nav__btn lesson-nav__btn--next">
    <span class="lesson-nav__label">Next Lesson</span>
    <span class="lesson-nav__title">TCP Reliability</span>
  </a>
</nav>
```

**First lesson (no previous):**

```html
<nav class="lesson-nav">
  <a href="lesson-02.html" class="lesson-nav__btn lesson-nav__btn--next">
    <span class="lesson-nav__label">Next Lesson</span>
    <span class="lesson-nav__title">LAN vs WAN</span>
  </a>
</nav>
```

---

## 🔧 Customization

### Change Colors

Edit `site/css/main.css` (lines 13-95):

```css
:root {
  /* Change accent color */
  --accent: #6366f1; /* Your brand color */
  --accent-hover: #8b8ff8; /* Lighter version */

  /* Change link color */
  --link: #93c5fd; /* Link color */
  --link-hover: #bfdbfe; /* Hover color */
}
```

### Change Fonts

Edit `site/css/main.css` (lines 42-43):

```css
:root {
  --font-sans: "Your Font", -apple-system, sans-serif;
  --font-mono: "Your Mono Font", Consolas, monospace;
}
```

Then add font link to HTML `<head>`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap"
  rel="stylesheet"
/>
```

### Change Content Width

Edit `site/css/main.css` (line 47):

```css
:root {
  --content-max-width: 780px; /* Change to 900px, 1000px, etc */
}
```

### Change Sidebar Width

Edit `site/css/main.css` (line 45):

```css
:root {
  --sidebar-width: 280px; /* Change to 300px, 320px, etc */
}
```

---

## 🔄 Migrating Existing Lessons

Your existing lessons in `networking/`, `databases/`, etc. still use the old `css/style.css`.

### Option 1: Quick Update (Recommended)

Replace old CSS references:

**Find:**

```html
<link rel="stylesheet" href="../css/style.css" />
```

**Replace with:**

```html
<link rel="stylesheet" href="../css/main.css" />
```

### Option 2: Gradual Migration

1. Keep using old `style.css` for existing lessons
2. Use new `main.css` for new lessons
3. Gradually update old lessons when editing them

### Option 3: Merge Systems

If you want ONE system:

1. Copy relevant styles from old `style.css` into `main.css`
2. Update all lessons to use `main.css`
3. Test thoroughly

---

## 📱 Responsive Breakpoints

The design automatically adjusts at:

- **1024px and below:** Sidebar becomes hamburger menu
- **640px and below:** Mobile optimizations (smaller fonts, stacked layouts)

**Test responsive design:**

1. Open site in browser
2. Press `F12` (DevTools)
3. Click device toggle icon
4. Test different screen sizes

---

## ⌨️ Keyboard Shortcuts

Built-in shortcuts:

- **`Ctrl+/` (or `Cmd+/`)** — Toggle theme
- **`Escape`** — Close mobile sidebar
- **`Ctrl+K` (or `Cmd+K`)** — Focus search (if added)

---

## ✅ Content Guidelines

### Writing Style

1. **Short paragraphs** — 3-5 sentences max
2. **Clear headings** — Descriptive, scannable
3. **Use examples** — Code, diagrams, tables
4. **Add callouts** — Highlight key points
5. **Link concepts** — Reference previous lessons
6. **End with summary** — Key takeaways section

### Reading Optimization

- **Line length:** Keep under 80 characters (auto-handled by 780px width)
- **Line spacing:** 1.7 line-height (already set)
- **Font size:** 18px body text (already set)
- **Paragraph spacing:** 1.5em between paragraphs (already set)

### Accessibility

- **Alt text** for images (when you add them)
- **Descriptive link text** (not "click here")
- **Proper heading hierarchy** (don't skip levels)
- **High contrast text** (already implemented)
- **Keyboard navigable** (already implemented)

---

## 🐛 Troubleshooting

### Theme Not Saving

**Problem:** Theme resets on page reload

**Solution:** Check browser allows localStorage:

- Open DevTools (F12)
- Go to Application > Storage
- Ensure localStorage is enabled

### Progress Bar Not Working

**Problem:** Progress bar doesn't move

**Solution:**

1. Ensure `main.js` is loaded: `<script src="../js/main.js"></script>`
2. Check console for errors (F12 > Console)
3. Verify `.progress-bar` element exists in HTML

### Code Copy Button Not Appearing

**Problem:** Code blocks have no copy button

**Solution:**

1. Check `main.js` is loaded
2. Ensure code is inside `<pre><code>` tags
3. Check console for JavaScript errors

### Sidebar Not Opening on Mobile

**Problem:** Hamburger menu doesn't work

**Solution:**

1. Verify checkbox exists: `<input type="checkbox" id="sidebar-toggle">`
2. Check label has correct `for` attribute
3. Test on actual mobile device (not just resized browser)

---

## 📊 Performance Tips

### Optimize Images (When Added)

```html
<!-- Use modern formats -->
<img src="diagram.webp" alt="Network diagram" loading="lazy" />

<!-- Provide multiple sizes -->
<img
  srcset="small.jpg 480w, large.jpg 1200w"
  sizes="(max-width: 640px) 480px, 1200px"
  src="large.jpg"
  alt="Diagram"
/>
```

### Minimize JavaScript

The platform is already minimal. If adding features:

- Use vanilla JS (no jQuery/React)
- Throttle/debounce scroll/resize listeners
- Use `requestAnimationFrame` for animations
- Load scripts at end of `<body>`

### CSS Best Practices

Already implemented:

- Single CSS file per page (main.css + page-specific)
- CSS variables for easy customization
- Mobile-first responsive design
- Minimal specificity

---

## 🎯 Next Steps

1. **Test everything:**

   ```bash
   start site\home.html
   start site\courses.html
   start site\example-lesson.html
   ```

2. **Create your first lesson:**
   - Copy `template.html`
   - Fill in content
   - Test all links

3. **Customize colors:**
   - Edit `css/main.css`
   - Change `--accent` color
   - Test in both themes

4. **Update existing lessons:**
   - Change CSS references
   - Add callout boxes
   - Improve formatting

5. **Add content:**
   - Complete unfinished modules
   - Add diagrams/images
   - Write more lessons

---

## 📞 Quick Reference

**Main Files:**

- Design system: `css/main.css`
- Interactions: `js/main.js`
- Template: `template.html`
- Example: `example-lesson.html`

**Key Variables (in main.css):**

- Accent color: `--accent`
- Content width: `--content-max-width`
- Font family: `--font-sans`, `--font-mono`
- Spacing: `--space-*`
- Colors: `--text-primary`, `--bg-surface`, etc.

**Component Classes:**

- Callouts: `.callout`, `.callout--tip/warning/info/success`
- Code: `<pre><code class="language-*">`
- Navigation: `.lesson-nav`, `.lesson-nav__btn`
- Tables: `<table>` (auto-styled)

---

## 🎓 Resources

**Design Principles:**

- [The Elements of Typographic Style](http://webtypography.net/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals)

**Inspiration:**

- Stripe Docs
- Linear Documentation
- Tailwind CSS Docs
- GitHub Primer Design

---

Built with focus. Designed for learning. 🎯
