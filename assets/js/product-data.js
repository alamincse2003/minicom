/* ==========================================================================
   Product page data: product.html?id={product id} shows that product.
   Runs before product.js so the gallery, zoom and lightbox are built from
   the swapped images. Without ?id (or ?id=sofa-chair) the page keeps its
   hand-made sofa-chair content, including the 3D model.
   Data: window.MC_SHOP.products (assets/data/products.js)
   ========================================================================== */
(function () {
  const DATA = window.MC_SHOP;
  const id = new URLSearchParams(location.search).get('id');
  if (!DATA || !id || id === 'sofa-chair') return;
  const p = DATA.products.find((x) => x.id === id);
  if (!p) return;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (n) => (window.MC && window.MC.cart ? window.MC.cart.money(n) : '$' + Number(n).toFixed(2));
  const cat = DATA.categories.find((c) => c.slug === p.cat);
  const sub = cat && cat.subs.find((s) => s.slug === p.sub);
  const img = (n) => `assets/images/products/${p.id}-${n}.jpg`;
  const photos = Array.from({ length: p.photos || 2 }, (_, i) => img(i + 1));

  /* ---------- Page title, breadcrumb ---------- */
  document.title = `${p.title} – Minicom`;
  const crumbs = $$('nav[aria-label="Breadcrumb"] li');
  if (crumbs.length >= 5) {
    crumbs[2].innerHTML = `<a href="shop.html?cat=${p.cat}" class="text-ink">${esc(cat ? cat.name : 'Shop')}</a>`;
    crumbs[4].textContent = p.title;
  }

  /* ---------- Gallery (photos only; the 3D model belongs to the sofa chair) ---------- */
  $('.pd-thumbs').innerHTML = photos
    .map((src, i) => `<button class="pd-thumb${i ? '' : ' active'}" data-index="${i}" role="tab" aria-selected="${!i}" aria-label="Image ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`)
    .join('');
  $('.pd-main .swiper-wrapper').innerHTML = photos
    .map((src, i) => `<div class="swiper-slide"><div class="pd-media pd-zoom" data-zoom><img src="${src}" alt="${esc(p.title)}, view ${i + 1}" width="1000" height="1240"${i ? ' loading="lazy"' : ' fetchpriority="high"'}></div></div>`)
    .join('');
  $('[data-goto-slide="1"].order-3')?.remove(); // "View in 3D" button

  /* ---------- Info ---------- */
  const info = $('.pd-info');
  info.querySelector('h1').textContent = p.title;
  const priceEl = [...info.querySelectorAll('p')].find((x) => /^\$/.test(x.textContent.trim()));
  if (priceEl) {
    priceEl.innerHTML = p.compare
      ? `<span class="text-sale">${money(p.price)}</span> <s class="ml-2 text-[16px] font-normal text-muted">${money(p.compare)}</s> <span class="ml-2 align-middle inline-block px-2 py-0.5 rounded-[3px] bg-sale text-white text-[12px]">-${Math.floor((1 - p.price / p.compare) * 100)}%</span>`
      : money(p.price);
  }
  const stockLine = info.querySelector('p.text-stock');
  if (p.inStock === false) {
    if (stockLine) stockLine.innerHTML = '<span class="w-2 h-2 rounded-full bg-sale"></span>Sold out';
    stockLine?.classList.replace('text-stock', 'text-sale');
    $$('[data-add-cart]').forEach((b) => (b.disabled = true));
  }

  // Every buy / wishlist button on the page → this product
  $$('#pdBuy [data-add-cart], #pdBuy [data-wishlist], #pdBuyNow, #stickyAtc [data-add-cart]').forEach((b) => (b.dataset.product = p.id));

  // Meta list
  const meta = [...info.querySelectorAll('ul li')];
  const metaRow = (label) => meta.find((li) => li.textContent.trim().startsWith(label));
  const sku = metaRow('SKU');
  if (sku) sku.innerHTML = `<b class="text-ink">SKU:</b> MC-${p.id.toUpperCase().slice(0, 12)}`;
  const avail = metaRow('Availability');
  if (avail) avail.innerHTML = `<b class="text-ink">Availability:</b> ${p.inStock === false ? '<span class="text-sale">Sold out</span>' : '<span class="text-stock">In stock</span>'}`;
  const cats = metaRow('Categories');
  if (cats && cat) {
    cats.innerHTML = `<b class="text-ink">Categories:</b> <a href="shop.html?cat=${cat.slug}" class="hover:text-accent">${esc(cat.name)}</a>${sub ? `, <a href="shop.html?cat=${cat.slug}&amp;sub=${sub.slug}" class="hover:text-accent">${esc(sub.name)}</a>` : ''}`;
  }
  const tags = metaRow('Tags');
  if (tags) {
    const list = [...new Set([...(p.materials || []), ...(p.colors || [])])];
    tags.innerHTML = `<b class="text-ink">Tags:</b> ` + list.map((t) => `<a href="shop.html?q=${encodeURIComponent(t.toLowerCase())}" class="hover:text-accent">${esc(t)}</a>`).join(', ');
  }

  /* ---------- Sticky bar + "Ask a question" popup ---------- */
  const fill = (box) => {
    if (!box) return;
    box.querySelectorAll('img[src*="products/sofa-chair"]').forEach((i) => (i.src = img(1)));
    box.querySelectorAll('p, span').forEach((el) => {
      if (el.children.length) return;
      if (el.textContent.trim() === 'Modern Single Sofa Chair for Stylish Living Room') el.textContent = p.title;
      if (el.textContent.trim() === '$200.00') el.textContent = money(p.price);
    });
    box.querySelectorAll('b').forEach((b) => {
      if (b.textContent.trim() === '$200.00') b.textContent = money(p.price);
    });
  };
  fill($('#stickyAtc'));
  fill($('#askPopup'));
})();
