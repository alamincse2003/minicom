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
| model-viewer | 3.5.0 | 3D / AR product model (product page only) |

## Structure

```
partials/header.html    shared header + desktop menu (one copy for every page)
partials/footer.html    shared footer
partials/overlays.html  shared mobile menu, cart drawer, search, login popup, toast,
                        mobile bottom bar, back-to-top
partials/icons.svg      shared SVG icon sprite (every icon used on any page)
assets/js/include.js    loads the partials into each page, then the page scripts
index.html              landing page (16 sections + page-only popups)
product.html            product detail page (gallery + 3D, info, tabs, related,
                        recently viewed, sticky add-to-cart, lightbox/ask/share popups)
shop.html               shop / collection page (category banner, filter sidebar,
                        product grid, sort, load more); cards rendered from data
assets/data/products.js product catalogue for the shop: categories, colours,
                        materials, products. Add or edit products here only.
assets/css/custom.css   tokens, buttons, marquees, product card, accordions, product page, overrides
assets/js/header.js     sticky/hide header, Menu toggle, drawers, search placeholder
assets/js/sliders.js    all Swiper instances (exposes window.MC.hero / MC.steps)
assets/js/ui.js         marquee cloning, step accordion, FAQ, featured product,
                        wishlist/cart counters, popups, newsletter, back-to-top
assets/js/animations.js GSAP + ScrollTrigger animations
assets/js/product.js    product page: gallery, zoom, lightbox, tabs, reviews, share,
                        sticky add-to-cart, recently viewed slider
assets/js/shop.js       shop page: filters, facet counts, sorting, URL state
                        (?cat=&sub=&color=&material=&min=&max=&stock=&sale=&sort=),
                        grid view toggle, active-filter chips, load more
assets/images/          demo images (see licence note below)
assets/models/          demo 3D model (.glb) for the product page
```

### Animation hooks

- `data-anim="fade-up | fade-left | fade-right"`: reveals the element on scroll
- `data-parallax`: wrapper whose `<img>` gets scroll parallax
- `data-parallax-bg`: background `<img>` with parallax
- `.stack-card`: banners that pin and stack as you scroll

Everything respects `prefers-reduced-motion`. If the GSAP CDN fails to load, the content is still visible.

## Adding more pages

The header, footer, overlays and icons live once in `partials/`. Edit them there and every page updates.

To make a new page, copy `shop.html` (the smallest page) and change only the `<main>` content. Keep these parts:

- the `<head>` (fonts, Tailwind, Swiper CSS, `custom.css`)
- the slots `<div data-include="icons">`, `header`, `footer` and `overlays`
- the include script at the bottom:

```html
<script src="assets/js/include.js" data-scripts="assets/js/header.js assets/js/sliders.js assets/js/ui.js assets/js/animations.js"></script>
```

  Add page scripts (for example `assets/js/cart.js`) to `data-scripts`, before `animations.js`.

Set the page state on `<body>`:

| Attribute | Values | Effect |
|---|---|---|
| `data-nav` | `home`, `collections`, `products`, `pages`, `blog` | highlights that menu link (desktop + mobile) |
| `data-header` | `solid` | black header for inner pages (leave it off on the homepage) |

The partials are loaded with `fetch()`, so always open the site through Live Server or XAMPP. Opened from `file://`, the page shows a notice instead of the header and footer.

## ⚠️ Image licence

All images in `assets/images/` and the model in `assets/models/` were downloaded from the theme's demo store and are **placeholders only**.
The 3D model must be served over HTTP (XAMPP / Live Server); it will not load from `file://`.
They are licensed with the theme, so **replace them with the client's own images before going live**.

Before going live, also swap the Tailwind browser build for the Tailwind CLI. That generates a small, purged CSS file.
