# 📐 ADDING DIAGRAMS & IMAGES GUIDE

Guide for adding architecture diagrams and images to your lesson pages.

---

## 📁 Image Folder Structure

```
site/
  images/
    diagrams/          # General diagrams
    networking/        # Networking lesson images
    architecture/      # Architecture lesson images
    backend/           # Backend lesson images
    security/          # Security lesson images
    databases/         # Database lesson images
```

---

## 🎨 Option 1: Use ASCII Diagrams (Text-based)

Perfect for simple flowcharts and architecture diagrams.

### Example:

```html
<pre class="ascii-diagram">
[User's Browser]
      |
      | HTTP Request
      |
[Load Balancer]
      |
      +----> [Web Server 1]
      |
      +----> [Web Server 2]
      |
      +----> [Web Server 3]
      |
[Database Server]
</pre>
```

### ✅ Advantages:

- No external files needed
- Fast loading
- Easy to edit
- Version control friendly
- Works perfectly in both light and dark mode

### 🎨 Styling:

- **Light background** in both modes (fixed!)
- **Dark text** for better readability
- Monospace font for alignment
- Border and padding for clarity

---

## 🖼️ Option 2: Use Image Diagrams (Recommended for Complex Diagrams)

Better for detailed architecture diagrams, screenshots, or complex visuals.

### Step 1: Create Your Diagram

Use any of these tools:

- **Excalidraw** (https://excalidraw.com) - Simple, hand-drawn style
- **Draw.io** (https://app.diagrams.net) - Professional diagrams
- **Figma** - Advanced design tool
- **PowerPoint/Keynote** - Traditional presentation tools
- **Lucidchart** - Collaborative diagramming
- **PlantUML** - Code-based diagrams

### Step 2: Export Image

- Format: **PNG** (best for diagrams) or **JPG** (for photos)
- Resolution: **1200-1600px width** recommended
- File size: Keep under **500KB** (compress if needed)
- Naming: Use descriptive names like `network-request-flow.png`

### Step 3: Save to Correct Folder

```
site/images/networking/network-request-flow.png
site/images/architecture/layered-architecture.png
site/images/diagrams/tcp-handshake.png
```

### Step 4: Add to Your HTML

**Simple image:**

```html
<div class="diagram-image">
  <img
    src="../images/networking/network-request-flow.png"
    alt="Network request flow from browser to server"
  />
  <p class="diagram-caption">Figure 1: Network Request Flow Architecture</p>
</div>
```

**Image with link (for large diagrams):**

```html
<div class="diagram-image">
  <a href="../images/networking/network-request-flow.png" target="_blank">
    <img
      src="../images/networking/network-request-flow.png"
      alt="Network request flow from browser to server"
    />
  </a>
  <p class="diagram-caption">
    Figure 1: Network Request Flow (Click to enlarge)
  </p>
</div>
```

---

## 🎯 When to Use What?

### Use ASCII Diagrams For:

- ✅ Simple flowcharts
- ✅ Basic hierarchies
- ✅ Linear processes
- ✅ Tree structures
- ✅ Quick sketches

### Use Image Diagrams For:

- ✅ Complex architectures
- ✅ Multiple connections
- ✅ Color-coded elements
- ✅ Screenshots
- ✅ UI mockups
- ✅ Database schemas

---

## 📝 Complete Example: Replacing ASCII with Image

### Before (ASCII):

```html
<p>Below is the network architecture:</p>
<pre class="ascii-diagram">
[Browser] --> [Router] --> [Server]
</pre>
```

### After (Image):

```html
<p>Below is the network architecture:</p>
<div class="diagram-image">
  <img
    src="../images/networking/network-architecture.png"
    alt="Complete network architecture diagram showing browser, router and server connections"
  />
  <p class="diagram-caption">Network Architecture - Browser to Server Flow</p>
</div>
```

---

## 🖌️ Image Optimization Tips

### 1. Compress Images

Use online tools to reduce file size:

- **TinyPNG** (https://tinypng.com)
- **Squoosh** (https://squoosh.app)
- **ImageOptim** (Mac)

### 2. Use Appropriate Dimensions

```
Small diagrams:  800px wide
Medium diagrams: 1200px wide
Large diagrams:  1600px wide
```

### 3. Ensure Legibility

- Use **16px minimum font size** in diagrams
- High contrast text
- Clear labels
- Adequate spacing

### 4. Consistent Style

- Use same color scheme across diagrams
- Consistent shapes for same concepts
- Same font family
- Professional appearance

---

## 🎨 Creating Professional Diagrams

### Recommended Excalidraw Settings:

1. Go to https://excalidraw.com
2. Draw your diagram
3. Use these settings:
   - Font: Cascadia, Virgil, or Helvetica
   - Stroke: Medium
   - Background: White
4. Export as PNG (2x resolution)

### Recommended Draw.io Settings:

1. Go to https://app.diagrams.net
2. Create diagram
3. File → Export as → PNG
4. Settings:
   - Border Width: 10
   - Zoom: 150%
   - Transparent: No (use white)

---

## 🔧 Styling Reference

### Diagram Image Classes:

```css
.diagram-image {
  margin: 24px 0;
  text-align: center;
  /* Centers the image */
}

.diagram-image img {
  max-width: 100%;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  /* Responsive, bordered, rounded, with shadow */
}

.diagram-caption {
  margin-top: 12px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
  /* Smaller, muted, italic caption text */
}

.ascii-diagram {
  background: light gray;
  color: dark text;
  font-family: monospace;
  /* Works perfectly in light mode now! */
}
```

---

## ❓ FAQ

### Can I use both ASCII and images in the same lesson?

**Yes!** Use ASCII for simple flows and images for complex diagrams.

### What if my image is too large?

Compress it using TinyPNG or reduce dimensions to 1200px width.

### Can I add multiple images?

Absolutely! Just wrap each in a `diagram-image` div.

### How do I center text diagrams?

Use `<pre class="ascii-diagram">` - it's already styled and centered.

### Can I use dark background images?

Yes, but ensure they work in both light and dark modes. Test both!

---

## ✅ Quick Checklist

Before adding a diagram:

- [ ] Image is under 500KB
- [ ] Width is 800-1600px
- [ ] Saved in correct folder
- [ ] Descriptive filename
- [ ] Alt text provided
- [ ] Caption added
- [ ] Tested in both light/dark mode

---

## 🚀 Ready to Add Diagrams!

You now have:

- ✅ Fixed ASCII diagram styling (light mode works!)
- ✅ Image folders created
- ✅ Styling for image diagrams
- ✅ Complete examples

Happy diagramming! 📐✨
