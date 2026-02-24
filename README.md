# Premium Technical Learning Platform

A distraction-free, reading-optimized learning platform for technical interview preparation.

## 🎯 Design Philosophy

**"The Digital Study Room"**

This platform is designed around a single principle: **optimize for deep, focused learning**. Every design decision—from typography to spacing to color choices—serves one goal: making it comfortable to read and study for 1-2 hours straight.

### Core Principles

- **Reading-First Design** — Premium typography, optimal line length, generous spacing
- **Dark Mode First** — Built for programmers who study late at night
- **Zero Distractions** — No ads, popups, or unnecessary elements
- **Structured Progression** — Clear path from fundamentals to advanced topics
- **Interview-Focused** — Content covers exactly what you need
- **Fast & Simple** — No frameworks, no bloat, instant loading

---

## 📂 Project Structure

```
site/
├── css/
│   ├── main.css          # Complete design system & base styles
│   ├── landing.css       # Home page specific styles
│   └── courses.css       # Course index page styles
├── js/
│   └── main.js           # Theme toggle, progress bar, code copy
├── home.html             # Landing page with hero & features
├── courses.html          # Complete course index
├── about.html            # About the platform
├── example-lesson.html   # Premium lesson reading experience
└── networking/           # Lesson content (existing)
```

---

## 🎨 Design System

### Color Palette

**Dark Mode (Primary)**

```css
Background:      #0a0a0f (page), #16161d (surface), #12121a (sidebar)
Text:            #e8e8ec (primary), #9999a8 (secondary), #6b6b7d (muted)
Accent:          #6366f1 (indigo)
Link:            #93c5fd (sky blue)
Success:         #10b981 (emerald)
Warning:         #f59e0b (amber)
Error:           #ef4444 (red)
```

**Light Mode**

```css
Background:      #fafbfc (page), #ffffff (surface)
Text:            #1a1a1f (primary), #525266 (secondary)
Accent:          #4f46e5 (darker indigo for contrast)
```

### Typography

**Fonts:**

- **Body & Headings:** Inter (system fallback: -apple-system, Segoe UI)
- **Code:** JetBrains Mono (fallback: Fira Code, SF Mono)

**Type Scale:**

```
Body:     18px / 1.125rem    | Line height: 1.7
H1:       32px / 2rem        | Weight: 700
H2:       24px / 1.5rem      | Weight: 700
H3:       20px / 1.25rem     | Weight: 600
Code:     15px (blocks)      | Family: Monospace
```

**Reading Optimization:**

- **Max content width:** 780px (65-75 characters per line)
- **Line height:** 1.7 (optimal for comprehension)
- **Paragraph spacing:** 1.5em
- **Horizontal padding:** 120px (creates "luxury" white space)

### Layout

**Three-Zone System:**

```
┌─────────────────────────────────────┐
│  Progress Bar (3px)                 │
├──────────┬──────────────────────────┤
│          │  Topbar (60px)           │
├──────────┼──────────────────────────┤
│ Sidebar  │  Main Content            │
│ (280px)  │  (max 780px, centered)   │
│ Fixed    │                          │
└──────────┴──────────────────────────┘
```

---

## ✨ Features Implemented

### 1. **Complete Design System** (`css/main.css`)

- CSS custom properties for all colors, spacing, typography
- Dark/Light mode with system preference detection
- Responsive breakpoints (1024px, 640px)
- Smooth transitions and hover states
- Utility classes for common patterns

### 2. **Landing Page** (`home.html`)

- Hero section with stats
- Features grid (6 cards)
- Course cards with hover effects
- CTA section
- Footer with navigation
- Fully responsive

### 3. **Course Index** (`courses.html`)

- All 5 modules listed
- 26 networking lessons + other modules
- Lesson counter and status
- Module icons and descriptions
- Quick navigation sidebar
- Smooth scroll to sections

### 4. **About Page** (`about.html`)

- Platform philosophy
- Design rationale
- Curriculum overview
- Technical details
- Uses callout components

### 5. **Lesson Reading Experience** (`example-lesson.html`)

- Optimal reading width (780px)
- Premium typography (18px, 1.7 line-height)
- Collapsible sidebar with nested navigation
- Active lesson highlighting
- Reading progress bar
- Code blocks with syntax labels
- Copy code buttons
- Callout boxes (tip, warning, info, success)
- Tables with zebra striping
- Next/Previous navigation
- Breadcrumb navigation

### 6. **JavaScript Interactions** (`js/main.js`)

**Theme Toggle:**

- Saves preference to localStorage
- Smooth icon transition (🌙 ↔ ☀️)
- Keyboard shortcut: `Ctrl/Cmd + /`

**Progress Bar:**

- Tracks reading progress
- Smooth animation (requestAnimationFrame)
- Updates on scroll (throttled for performance)

**Code Copy:**

- Automatically adds copy buttons to all `<pre><code>` blocks
- Wraps in styled containers with language labels
- Visual feedback (✓ Copied! / ✗ Failed)
- Uses Clipboard API

**Other Features:**

- Active navigation highlighting
- Sidebar toggle for mobile
- Smooth scroll for anchor links
- External link handling (target="\_blank")
- Escape key closes sidebar
- Click outside closes sidebar

---

## 🚀 Getting Started

### 1. Open the Platform

Simply open any HTML file in a browser:

```bash
# Landing page
open site/home.html

# Course index
open site/courses.html

# Example lesson
open site/example-lesson.html
```

### 2. Font Setup (Optional but Recommended)

For the best experience, the design uses:

- **Inter** — https://fonts.google.com/specimen/Inter
- **JetBrains Mono** — https://fonts.google.com/specimen/JetBrains+Mono

Add to `<head>` of HTML files:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

Or download fonts locally for offline use.

### 3. Customize Colors

Edit `css/main.css` line 13-95 to change the color scheme:

```css
:root {
  --accent: #6366f1; /* Change to your brand color */
  --link: #93c5fd; /* Link color */
  /* ... */
}
```

---

## 📱 Responsive Behavior

**Desktop (> 1024px):**

- Full sidebar visible
- 120px horizontal padding
- 780px content width

**Tablet (768px - 1024px):**

- Sidebar toggles with hamburger menu
- 80px horizontal padding
- Optimized spacing

**Mobile (< 640px):**

- Off-canvas sidebar
- 24px horizontal padding
- Reduced font sizes (16px body)
- Stacked layouts
- Larger touch targets (48px minimum)

---

## 🎨 Components

### Callout Boxes

```html
<div class="callout callout--tip">
  <div class="callout__icon">💡</div>
  <div class="callout__content">
    <p><strong>Title</strong></p>
    <p>Content here</p>
  </div>
</div>
```

**Variants:** `callout--tip`, `callout--warning`, `callout--error`, `callout--success`

### Code Blocks

```html
<pre><code class="language-javascript">
const greeting = "Hello World";
console.log(greeting);
</code></pre>
```

JavaScript automatically adds copy buttons and styling.

### Navigation Buttons

```html
<nav class="lesson-nav">
  <a href="prev.html" class="lesson-nav__btn">
    <span class="lesson-nav__label">Previous</span>
    <span class="lesson-nav__title">Lesson Title</span>
  </a>
  <a href="next.html" class="lesson-nav__btn lesson-nav__btn--next">
    <span class="lesson-nav__label">Next</span>
    <span class="lesson-nav__title">Next Lesson</span>
  </a>
</nav>
```

### Tables

```html
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

Automatically styled with hover effects.

---

## ⌨️ Keyboard Shortcuts

- **`Ctrl/Cmd + /`** — Toggle dark/light theme
- **`Ctrl/Cmd + K`** — Focus search (if implemented)
- **`Escape`** — Close sidebar on mobile

---

## 🎯 Performance Features

- **No external dependencies** — Everything is self-contained
- **Minimal JavaScript** — Only ~200 lines for interactions
- **Optimized CSS** — Single file, ~8-12KB gzipped
- **requestAnimationFrame** — Smooth 60fps animations
- **Throttled scroll listeners** — Prevents performance issues
- **System font fallbacks** — Works without custom fonts loaded

---

## 📊 Browser Support

- **Chrome/Edge** — Full support
- **Firefox** — Full support
- **Safari** — Full support (iOS 12+)
- **Modern browsers** — All CSS/JS features work

Uses standard web APIs:

- CSS Custom Properties
- Flexbox & Grid
- Clipboard API
- LocalStorage
- requestAnimationFrame

---

## 🔧 Customization Guide

### Change Accent Color

```css
/* In css/main.css */
:root {
  --accent: #your-color;
  --accent-hover: #your-lighter-color;
}
```

### Adjust Content Width

```css
:root {
  --content-max-width: 780px; /* Change to 900px, 1000px, etc */
}
```

### Change Fonts

```css
:root {
  --font-sans: "Your Font", -apple-system, sans-serif;
  --font-mono: "Your Mono Font", monospace;
}
```

### Modify Sidebar Width

```css
:root {
  --sidebar-width: 280px; /* Change to 300px, 320px, etc */
}
```

---

## 📝 Content Guidelines

When creating new lesson pages:

1. **Use semantic HTML** — `<article>`, `<section>`, `<nav>`
2. **Keep paragraphs short** — 3-5 sentences maximum
3. **Use callouts for emphasis** — Tips, warnings, key points
4. **Add code examples** — Helps visual learners
5. **Include tables** — Great for comparing concepts
6. **End with takeaways** — Summary callout box
7. **Link to next lesson** — Keep learning flow

---

## 🚧 Future Enhancements

Possible additions (not yet implemented):

- [ ] Search functionality
- [ ] Syntax highlighting (Prism.js)
- [ ] Bookmark/progress tracking
- [ ] Print styles
- [ ] PDF export
- [ ] Diagrams with Mermaid.js
- [ ] Interactive code playgrounds
- [ ] Reading time estimates
- [ ] Table of contents for long lessons
- [ ] Filter courses by difficulty

---

## 📄 License

This is a learning platform template. Use it however you want.

---

## 🙏 Credits

**Design Philosophy Inspired By:**

- Stripe Documentation
- Linear's Design System
- Tailwind's Documentation
- GitHub's Primer Design

**Typography Research:**

- "The Elements of Typographic Style" by Robert Bringhurst
- Butterick's Practical Typography
- Web accessibility guidelines (WCAG AAA)

---

Built with focus and care. No frameworks. No bloat. Just learning.
