# 📁 Images Folder

Store all your diagrams and images here.

## 📂 Folder Structure

```
images/
  diagrams/          # General purpose diagrams
  networking/        # Networking module images
  architecture/      # Architecture module images
  backend/           # Backend module images
  security/          # Security module images
  databases/         # Database module images
```

## 📝 Naming Conventions

Use clear, descriptive names:

- `network-request-flow.png`
- `tcp-handshake-diagram.png`
- `layered-architecture.png`
- `database-schema.png`

**Avoid:**

- `diagram1.png`
- `image.png`
- `screenshot.png`

## 🎨 Recommended Image Specs

- **Format:** PNG (diagrams), JPG (photos), SVG (scalable)
- **Width:** 800-1600px
- **File Size:** < 500KB (compress if needed)
- **Resolution:** 72-144 DPI

## 🔗 Usage in HTML

```html
<div class="diagram-image">
  <img
    src="../images/networking/your-diagram.png"
    alt="Descriptive text about the diagram"
  />
  <p class="diagram-caption">Figure 1: Your Caption Here</p>
</div>
```

## 📖 Full Guide

See **DIAGRAM_GUIDE.md** for complete instructions on:

- Creating diagrams
- Exporting images
- Optimization tips
- Styling options
- ASCII diagrams vs images

---

**Need help?** Check the example in `diagrams/example-architecture.svg`
