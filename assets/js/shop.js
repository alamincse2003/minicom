/* ==========================================================================
   Shop page: category navigation, filters (price, colour, material,
   availability), sorting, grid view, active-filter chips, load more.
   State lives in the URL (?cat=&sub=&color=&material=&min=&max=&stock=&sale=&sort=)
   so filtered views can be shared and survive a refresh.
   Data: window.MC_SHOP from assets/data/products.js
   ========================================================================== */
(function () {
  const DATA = window.MC_SHOP;
  const grid = document.getElementById('shopGrid');
  if (!DATA || !grid) return;

  const { categories, colors, materials, products, promo } = DATA;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const PAGE = 12;
  const PRICE_MAX = Math.ceil(Math.max(...products.map((p) => p.price)) / 50) * 50;
  const money = (n) => '$' + n.toFixed(2);
  const catOf = (slug) => categories.find((c) => c.slug === slug);
  const subOf = (cat, slug) => catOf(cat)?.subs.find((s) => s.slug === slug);

  /* ---------- State <-> URL ---------- */
  const params = new URLSearchParams(location.search);
  const list = (k) => (params.get(k) || '').split(',').filter(Boolean);
  const state = {
    cat: params.get('cat') || '',
    sub: params.get('sub') || '',
    colors: list('color').filter((c) => colors[c]),
    materials: list('material').filter((m) => materials.includes(m)),
    min: Math.max(0, +params.get('min') || 0),
    max: Math.min(PRICE_MAX, +params.get('max') || PRICE_MAX),
    stock: params.get('stock') === '1',
    sale: params.get('sale') === '1',
    sort: params.get('sort') || 'featured',
    shown: PAGE,
  };
  if (!catOf(state.cat)) state.cat = state.sub = '';
  else if (!subOf(state.cat, state.sub)) state.sub = '';

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.cat) p.set('cat', state.cat);
    if (state.sub) p.set('sub', state.sub);
    if (state.colors.length) p.set('color', state.colors.join(','));
    if (state.materials.length) p.set('material', state.materials.join(','));
    if (state.min > 0) p.set('min', state.min);
    if (state.max < PRICE_MAX) p.set('max', state.max);
    if (state.stock) p.set('stock', '1');
    if (state.sale) p.set('sale', '1');
    if (state.sort !== 'featured') p.set('sort', state.sort);
    const qs = p.toString();
    try { history.replaceState(null, '', qs ? '?' + qs : location.pathname); } catch (e) {}
  }

  /* ---------- Filtering & sorting ---------- */
  // `skip` leaves one facet out so its own counts show what selecting it would give
  const matches = (p, skip) =>
    (!state.cat || p.cat === state.cat) &&
    (!state.sub || p.sub === state.sub) &&
    (skip === 'color' || !state.colors.length || p.colors.some((c) => state.colors.includes(c))) &&
    (skip === 'material' || !state.materials.length || p.materials.some((m) => state.materials.includes(m))) &&
    p.price >= state.min && p.price <= state.max &&
    (!state.stock || p.inStock) &&
    (!state.sale || p.compare);

  const sorters = {
    featured: (a, b) => a.order - b.order,
    newest: (a, b) => b.added - a.added,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'name-asc': (a, b) => a.title.localeCompare(b.title),
  };
  if (!sorters[state.sort]) state.sort = 'featured';

  const results = () => products.filter((p) => matches(p)).sort(sorters[state.sort]);
  const hasFilters = () =>
    state.colors.length || state.materials.length || state.min > 0 || state.max < PRICE_MAX || state.stock || state.sale;

  /* ---------- Templates ---------- */
  function card(p, i) {
    // Rounded down, matching the badges on the home page (-3%, -16%)
    const off = p.compare ? Math.floor((1 - p.price / p.compare) * 100) : 0;
    const badge = !p.inStock
      ? '<span class="p-badge !bg-ink">Sold out</span>'
      : off ? `<span class="p-badge">-${off}%</span>`
      : p.isNew ? '<span class="p-badge !bg-stock">New</span>' : '';
    const price = p.compare
      ? `<span class="text-sale">${money(p.price)}</span> <del class="ml-1.5 text-muted font-normal">${money(p.compare)}</del>`
      : money(p.price);
    const swatches = p.variants
      ? `<div class="flex gap-1.5 mt-3">${p.variants
          .map((c, n) => `<button class="swatch${n ? '' : ' active'}" style="background:${colors[c]}" title="${c}" aria-label="${c}"></button>`)
          .join('')}</div>`
      : '';
    const url = p.url || '#';
    return `
      <div class="p-card shop-item" style="--i:${i % PAGE}">
        <div class="p-thumb">
          ${badge}
          <a href="${url}" aria-label="${p.title}"><img class="img-1" src="assets/images/products/${p.id}-1.jpg" alt="${p.title}" loading="lazy"><img class="img-2" src="assets/images/products/${p.id}-2.jpg" alt="" loading="lazy"></a>
          <div class="p-actions">
            <button class="p-act" data-wishlist aria-label="Add to wishlist"><svg class="w-4 h-4"><use href="#i-heart"/></svg><span class="tip">Add To Wishlist</span></button>
            <a class="p-act" href="${url}" aria-label="Quick view"><svg class="w-4 h-4"><use href="#i-eye"/></svg><span class="tip">Quick View</span></a>
          </div>
          <div class="p-add"><button data-add-cart ${p.inStock ? 'aria-label="Add to cart"' : 'disabled aria-label="Sold out"'}><svg class="w-[18px] h-[18px]"><use href="#i-bag"/></svg></button></div>
        </div>
        <div class="pt-[15px]">
          <a href="${url}" class="p-title">${p.title}</a>
          <p class="mt-1.5 text-[14px] font-bold text-ink">${price}</p>
          ${swatches}
        </div>
      </div>`;
  }

  const promoCard = () => `
    <a href="?cat=${promo.cat}&sub=${promo.sub}" class="shop-promo group relative col-span-2 flex items-end min-h-[300px] rounded-[10px] overflow-hidden" data-set-cat="${promo.cat}" data-set-sub="${promo.sub}">
      <img src="${promo.image}" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
      <span class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></span>
      <span class="relative block p-6 md:p-10 text-white">
        <span class="dot-caption block text-[11px] uppercase tracking-[3px] mb-3">${promo.eyebrow}</span>
        <span class="block text-[22px] md:text-[28px] font-extrabold uppercase leading-[1.2]">${promo.title}</span>
        <span class="btn btn-accent mt-5">${promo.button} <svg class="arrow"><use href="#i-arrow"/></svg></span>
      </span>
    </a>`;

  /* ---------- Hero + breadcrumb ---------- */
  function renderHero() {
    const cat = catOf(state.cat);
    const sub = subOf(state.cat, state.sub);
    const info = cat || DATA.all;
    const title = sub ? sub.name : info.name;
    $('#shopTitle').textContent = title;
    $('#shopIntro').textContent = info.intro;
    const img = $('#shopHeroImg');
    if (img.getAttribute('src') !== info.image) {
      img.classList.add('is-swapping');
      setTimeout(() => {
        img.src = info.image;
        img.onload = () => img.classList.remove('is-swapping');
      }, 200);
    }
    const crumbs = [`<li><a href="index.html">Home</a></li>`];
    const sep = '<li aria-hidden="true" class="opacity-50">/</li>';
    if (cat) {
      crumbs.push(sep, `<li><a href="shop.html" data-set-cat="">Shop</a></li>`);
      crumbs.push(sep, sub ? `<li><a href="?cat=${cat.slug}" data-set-cat="${cat.slug}">${cat.name}</a></li>` : `<li aria-current="page">${cat.name}</li>`);
      if (sub) crumbs.push(sep, `<li aria-current="page">${sub.name}</li>`);
    } else {
      crumbs.push(sep, `<li aria-current="page">Shop</li>`);
    }
    $('#shopCrumbs').innerHTML = crumbs.join('');
    document.title = `${title} – Minicom`;
  }

  /* ---------- Sidebar: categories ---------- */
  const countIn = (cat, sub) => products.filter((p) => p.cat === cat && (!sub || p.sub === sub)).length;
  function renderCats() {
    const all = `<li><button class="f-cat${state.cat ? '' : ' active'}" data-set-cat="" ${state.cat ? '' : 'aria-current="true"'}>All Products<span>${products.length}</span></button></li>`;
    $('#fCats').innerHTML = all + categories.map((c) => {
      const open = c.slug === state.cat;
      return `<li class="f-cat-item${open ? ' open' : ''}">
        <button class="f-cat${open && !state.sub ? ' active' : ''}" data-set-cat="${c.slug}" aria-expanded="${open}" ${open && !state.sub ? 'aria-current="true"' : ''}>${c.name}<span>${countIn(c.slug)}</span></button>
        <div class="f-subs"><ul>${c.subs.map((s) => {
          const on = open && state.sub === s.slug;
          return `<li><button class="f-sub${on ? ' active' : ''}" data-set-cat="${c.slug}" data-set-sub="${s.slug}" ${on ? 'aria-current="true"' : ''}>${s.name}<span>${countIn(c.slug, s.slug)}</span></button></li>`;
        }).join('')}</ul></div>
      </li>`;
    }).join('');
  }

  /* ---------- Mobile: round category chips ---------- */
  function renderChips() {
    const chip = (slug, name, thumb) => `
      <button class="cat-chip${state.cat === slug ? ' active' : ''}" data-set-cat="${slug}">
        <span class="cat-chip-img">${thumb ? `<img src="assets/images/products/${thumb}-1.jpg" alt="" loading="lazy">` : '<svg class="w-6 h-6"><use href="#i-grid"/></svg>'}</span>
        <span class="cat-chip-label">${name}</span>
      </button>`;
    $('#shopCatChips').innerHTML = chip('', 'All', '') + categories.map((c) => chip(c.slug, c.name, c.thumb)).join('');
    $('.cat-chip.active')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  /* ---------- Sidebar: colour + material facets ---------- */
  function renderFacets() {
    const colorPool = products.filter((p) => matches(p, 'color'));
    $('#fColors').innerHTML = Object.entries(colors).map(([name, hex]) => {
      const n = colorPool.filter((p) => p.colors.includes(name)).length;
      const on = state.colors.includes(name);
      return `<li><button class="f-color${on ? ' active' : ''}" data-color="${name}" aria-pressed="${on}" ${n || on ? '' : 'disabled'}>
        <span class="f-color-dot" style="background:${hex}"></span>${name}<span>${n}</span></button></li>`;
    }).join('');

    const matPool = products.filter((p) => matches(p, 'material'));
    $('#fMaterials').innerHTML = materials.map((m) => {
      const n = matPool.filter((p) => p.materials.includes(m)).length;
      const on = state.materials.includes(m);
      return `<li><label class="f-check${n || on ? '' : ' is-disabled'}"><input type="checkbox" value="${m}" data-material ${on ? 'checked' : ''} ${n || on ? '' : 'disabled'}><span class="f-box"><svg class="w-3 h-3"><use href="#i-check"/></svg></span>${m}<span class="ml-auto text-muted">${n}</span></label></li>`;
    }).join('');

    $('#fStock').checked = state.stock;
    $('#fSale').checked = state.sale;
    syncPrice();
  }

  /* ---------- Price slider ---------- */
  const minInput = $('#fPriceMin');
  const maxInput = $('#fPriceMax');
  minInput.max = maxInput.max = PRICE_MAX;
  function syncPrice() {
    minInput.value = state.min;
    maxInput.value = state.max;
    paintPrice();
  }
  function paintPrice() {
    const a = +minInput.value, b = +maxInput.value;
    const fill = $('#fPriceFill');
    fill.style.left = (a / PRICE_MAX) * 100 + '%';
    fill.style.right = 100 - (b / PRICE_MAX) * 100 + '%';
    $('#fPriceLabel').textContent = `${money(a).replace('.00', '')} – ${money(b).replace('.00', '')}`;
  }
  let priceTimer;
  [minInput, maxInput].forEach((input) =>
    input.addEventListener('input', () => {
      // Keep the two thumbs from crossing
      if (+minInput.value > +maxInput.value - 5) {
        if (input === minInput) minInput.value = +maxInput.value - 5;
        else maxInput.value = +minInput.value + 5;
      }
      paintPrice();
      clearTimeout(priceTimer);
      priceTimer = setTimeout(() => {
        state.min = +minInput.value;
        state.max = +maxInput.value;
        update();
      }, 250);
    })
  );

  /* ---------- Active filter chips ---------- */
  function renderActive() {
    const chips = [];
    const chip = (label, key, value = '') =>
      chips.push(`<button class="active-chip" data-remove="${key}" data-value="${value}">${label}<svg class="w-3 h-3"><use href="#i-close"/></svg></button>`);
    state.colors.forEach((c) => chip(c, 'color', c));
    state.materials.forEach((m) => chip(m, 'material', m));
    if (state.min > 0 || state.max < PRICE_MAX) chip(`${money(state.min).replace('.00', '')} – ${money(state.max).replace('.00', '')}`, 'price');
    if (state.stock) chip('In stock', 'stock');
    if (state.sale) chip('On sale', 'sale');
    const box = $('#activeChips');
    box.innerHTML = chips.length ? chips.join('') + '<button class="text-[13px] font-bold uppercase text-ink underline underline-offset-4 hover:text-accent" data-clear>Clear all</button>' : '';
    box.hidden = !chips.length;
    const badge = $('#filterCount');
    badge.textContent = chips.length;
    badge.hidden = !chips.length;
  }

  /* ---------- Grid ---------- */
  function renderGrid(appendFrom = 0) {
    const items = results();
    const visible = items.slice(0, state.shown);
    const html = [];
    visible.forEach((p, i) => {
      if (i < appendFrom) return;
      html.push(card(p, i));
      // Editorial banner after the 4th product when browsing broadly
      if (i === 3 && items.length > 6 && !state.sub && promo) html.push(promoCard());
    });
    if (appendFrom) grid.insertAdjacentHTML('beforeend', html.join(''));
    else grid.innerHTML = html.join('');

    $('#shopEmpty').hidden = items.length > 0;
    grid.hidden = items.length === 0;
    $('#shopCount').innerHTML = items.length
      ? `Showing <b class="text-ink">${visible.length}</b> of <b class="text-ink">${items.length}</b> product${items.length > 1 ? 's' : ''}`
      : 'No products found';
    $('#fShowCount').textContent = `Show ${items.length} product${items.length === 1 ? '' : 's'}`;

    const more = $('#shopMore');
    more.hidden = items.length <= PAGE;
    $('#shopMoreText').textContent = `You've viewed ${visible.length} of ${items.length} products`;
    $('#shopMoreBar').style.width = (visible.length / items.length) * 100 + '%';
    $('#shopMoreBtn').hidden = visible.length >= items.length;
  }

  function update({ scroll = false } = {}) {
    state.shown = PAGE;
    syncUrl();
    renderHero();
    renderCats();
    renderChips();
    renderFacets();
    renderActive();
    renderGrid();
    if (scroll) {
      const top = $('#shopTop').getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * 0.6) window.scrollTo({ top: top + scrollY - 90, behavior: 'smooth' });
    }
  }

  /* ---------- Events ---------- */
  document.addEventListener('click', (e) => {
    const setCat = e.target.closest('[data-set-cat]');
    if (setCat) {
      e.preventDefault();
      const cat = setCat.dataset.setCat;
      const sub = setCat.dataset.setSub || '';
      // Clicking the open category again collapses it in the sidebar
      if (setCat.classList.contains('f-cat') && cat && cat === state.cat && !state.sub && !sub) state.cat = '';
      else { state.cat = cat; state.sub = sub; }
      update({ scroll: !setCat.closest('#filterDrawer') });
      return;
    }
    const color = e.target.closest('[data-color]');
    if (color) {
      const c = color.dataset.color;
      state.colors = state.colors.includes(c) ? state.colors.filter((x) => x !== c) : [...state.colors, c];
      update();
      return;
    }
    const remove = e.target.closest('[data-remove]');
    if (remove) {
      const { remove: key, value } = remove.dataset;
      if (key === 'color') state.colors = state.colors.filter((x) => x !== value);
      if (key === 'material') state.materials = state.materials.filter((x) => x !== value);
      if (key === 'price') { state.min = 0; state.max = PRICE_MAX; }
      if (key === 'stock') state.stock = false;
      if (key === 'sale') state.sale = false;
      update();
      return;
    }
    if (e.target.closest('[data-clear]')) {
      Object.assign(state, { colors: [], materials: [], min: 0, max: PRICE_MAX, stock: false, sale: false });
      update();
      return;
    }
    const head = e.target.closest('.f-head');
    if (head) {
      const group = head.closest('.f-group');
      head.setAttribute('aria-expanded', group.classList.toggle('open'));
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-material]')) {
      const m = e.target.value;
      state.materials = e.target.checked ? [...state.materials, m] : state.materials.filter((x) => x !== m);
      update();
    }
  });
  $('#fStock').addEventListener('change', (e) => { state.stock = e.target.checked; update(); });
  $('#fSale').addEventListener('change', (e) => { state.sale = e.target.checked; update(); });

  const sortSelect = $('#shopSort');
  sortSelect.value = state.sort;
  sortSelect.addEventListener('change', () => {
    state.sort = sortSelect.value;
    update();
  });

  $('#shopMoreBtn').addEventListener('click', () => {
    const from = state.shown;
    state.shown += PAGE;
    renderGrid(from);
  });

  /* ---------- Grid view toggle (desktop) ---------- */
  const viewBtns = $$('[data-view]');
  function setView(cols) {
    grid.dataset.cols = cols;
    viewBtns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.view === cols));
  }
  let savedView = null;
  try { savedView = localStorage.getItem('mc_shop_cols'); } catch (e) {}
  setView(savedView || (innerWidth >= 1500 ? '4' : '3'));
  viewBtns.forEach((b) =>
    b.addEventListener('click', () => {
      setView(b.dataset.view);
      try { localStorage.setItem('mc_shop_cols', b.dataset.view); } catch (e) {}
    })
  );

  update();
})();
