# Minicom – Furniture & Interior (static landing page)

A static HTML5 + Tailwind CSS + JavaScript version of the Minicom homepage. It is modelled on the
"Minicom – Furniture & Interior Store" Shopify theme demo.

## Run locally

There is no build step. Serve the folder with any static server so every asset loads correctly:

- **VS Code:** right-click `index.html`, then **Open with Live Server**
- **Python:** `python -m http.server 5500`, then open http://localhost:5500

## Stack (loaded from CDNs, pinned versions)

| Library | Version | Used for |
|---|---|---|
| Tailwind CSS (browser build) | 4.1.11 | utility classes; theme tokens in the `@theme` block inside `index.html` |
| GSAP + ScrollTrigger | 3.12.5 | hero captions, scroll reveals, parallax, stacked banners |
| Swiper | 11.1.14 | hero, products, step images, testimonials, blog |
| DM Sans (Google Fonts) | – | all typography |

## Structure

```
index.html              landing page (header, 16 sections, footer, drawers/popups)
assets/css/custom.css   tokens, buttons, marquees, product card, accordions, overrides
assets/js/header.js     sticky/hide header, Menu toggle, drawers, search placeholder
assets/js/sliders.js    all Swiper instances (exposes window.MC.hero / MC.steps)
assets/js/ui.js         marquee cloning, step accordion, FAQ, featured product,
                        wishlist/cart counters, popups, newsletter, back-to-top
assets/js/animations.js GSAP + ScrollTrigger animations
assets/images/          demo images (see licence note below)
```

### Animation hooks

- `data-anim="fade-up | fade-left | fade-right"`: reveals the element on scroll
- `data-parallax`: wrapper whose `<img>` gets scroll parallax
- `data-parallax-bg`: background `<img>` with parallax
- `.stack-card`: banners that pin and stack as you scroll

Everything respects `prefers-reduced-motion`. If the GSAP CDN fails to load, the content is still visible.

## Adding more pages

Copy the shared parts of `index.html` into each new page and change only the `<main>` content:

- the `<head>`
- the SVG sprite
- the `<header>`
- the `<footer>`
- the overlays block
- the script tags

When there are several pages, move the header and footer into `partials/` and inject them with a small fetch script.

## ⚠️ Image licence

All images in `assets/images/` were downloaded from the theme's demo store and are **placeholders only**.
They are licensed with the theme, so **replace them with the client's own images before going live**.

Before going live, also swap the Tailwind browser build for the Tailwind CLI. That generates a small, purged CSS file.
