/* ==========================================================================
   Wishlist store (demo, no backend)
   Saved in localStorage ("mc_wishlist") as [{ id, added: 'YYYY-MM-DD' }].
   Any [data-wishlist] button toggles its product (found the same way as
   add-to-cart: data-product, or the card's product image). Buttons for
   saved products get .is-wished. Counters: [data-wishlist-count].
   wishlist.html renders the saved list into [data-wishlist-container].
   ========================================================================== */
(function () {
  window.MC = window.MC || {};
  const KEY = 'mc_wishlist';
  const cart = window.MC.cart;
  const products = (window.MC_SHOP && window.MC_SHOP.products) || [];
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((w) => byId[w.id]) : [];
    } catch (e) {
      return [];
    }
  }
  let items = read();
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {}
    render();
  };
  const has = (id) => items.some((w) => w.id === id);
  function toggle(id) {
    if (!byId[id]) return null;
    if (has(id)) items = items.filter((w) => w.id !== id);
    else items.unshift({ id, added: new Date().toISOString().slice(0, 10) });
    save();
    return has(id);
  }
  window.MC.wishlist = { toggle, has, items: () => items.slice() };

  /* ---------- Buttons ---------- */
  const idFor = (btn) => btn.dataset.product || (cart && cart.productFor(btn));
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wishlist]');
    if (!btn) return;
    e.preventDefault();
    const id = idFor(btn);
    const added = toggle(id);
    if (added === null) return;
    window.MC.toast?.(added ? 'This item has been added to your Wishlist' : 'Removed from Wishlist');
  });

  /* ---------- Wishlist page ---------- */
  const money = (n) => (cart ? cart.money(n) : '$' + n);
  const dateLabel = (iso) => {
    const d = new Date(iso + 'T12:00:00');
    return `${d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
  };
  function itemHTML(w) {
    const p = byId[w.id];
    const url = p.url || 'shop.html';
    const price = p.compare && p.compare > p.price
      ? `<span class="wl-price">${money(p.price)}</span><s class="wl-old">${money(p.compare)}</s>`
      : `<span class="wl-price">${money(p.price)}</span>`;
    return `
      <div class="wl-item">
        <div class="wl-product">
          <button type="button" class="wl-remove" data-wishlist data-product="${p.id}" aria-label="Remove ${p.title} from wishlist"><svg><use href="#i-trash"/></svg></button>
          <a href="${url}" class="wl-thumb"><img src="assets/images/products/${p.id}-1.jpg" alt="${p.title}" loading="lazy"></a>
          <div class="min-w-0">
            <a href="${url}" class="wl-title">${p.title}</a>
            <div class="wl-prices">${price}</div>
            <p class="wl-date"><svg><use href="#i-calendar"/></svg>${dateLabel(w.added)}</p>
          </div>
        </div>
        <div class="wl-actions">
          <button type="button" class="btn btn-dark" data-add-cart data-product="${p.id}" ${p.inStock === false ? 'disabled' : ''}>Add to cart</button>
          <a href="${url}" class="btn btn-accent">Quick View</a>
        </div>
      </div>`;
  }
  function renderPage() {
    const box = document.querySelector('[data-wishlist-container]');
    if (!box) return;
    box.innerHTML = items.length
      ? `<p class="wl-count">${items.length} item${items.length === 1 ? '' : 's'} in your wishlist</p>${items.map(itemHTML).join('')}`
      : `<div class="wl-empty">
           <svg class="wl-empty-icon"><use href="#i-heart"/></svg>
           <h2>Your wishlist is empty</h2>
           <p>Tap the heart on any product to save it here for later.</p>
           <a href="shop.html" class="btn btn-accent mt-6">Continue shopping</a>
         </div>`;
  }

  function markButtons() {
    document.querySelectorAll('[data-wishlist-count]').forEach((el) => (el.textContent = items.length));
    document.querySelectorAll('[data-wishlist]').forEach((btn) => {
      const id = idFor(btn);
      btn.classList.toggle('is-wished', !!id && has(id));
    });
  }
  function render() {
    renderPage();
    markButtons();
  }
  render();
  // Cards drawn later (shop grid, sliders) get their heart state too
  let pending;
  new MutationObserver(() => {
    clearTimeout(pending);
    pending = setTimeout(markButtons, 120);
  }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      items = read();
      render();
    }
  });
})();
