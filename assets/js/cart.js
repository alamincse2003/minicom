/* ==========================================================================
   Cart store (demo, no backend)
   Lines live in localStorage ("mc_cart") as [{ id, qty }]. Product details
   come from window.MC_SHOP.products (assets/data/products.js).

   window.MC.cart API
     add(id, qty)  set(id, qty)  remove(id)  clear()
     lines()       -> [{ id, qty, product, total }]
     count()       subtotal()    money(n)
     onChange(fn)  -> fn(cart) after every change (and once on load)

   Any [data-add-cart] button works: its product is read from data-product,
   or from the nearest card's product image (assets/images/products/{id}-1.jpg).
   ========================================================================== */
(function () {
  window.MC = window.MC || {};
  const KEY = 'mc_cart';
  const FREE_SHIPPING = 1000; // same threshold as the reference cart
  const products = (window.MC_SHOP && window.MC_SHOP.products) || [];
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const listeners = [];

  const money = (n) =>
    '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((l) => byId[l.id] && l.qty > 0) : [];
    } catch (e) {
      return [];
    }
  }
  let state = read();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
    emit();
  }

  const lines = () =>
    state.map((l) => ({ ...l, product: byId[l.id], total: byId[l.id].price * l.qty }));
  const count = () => state.reduce((n, l) => n + l.qty, 0);
  const subtotal = () => lines().reduce((n, l) => n + l.total, 0);

  function add(id, qty = 1) {
    if (!byId[id]) return false;
    const line = state.find((l) => l.id === id);
    if (line) line.qty = Math.min(50, line.qty + qty);
    else state.push({ id, qty: Math.min(50, qty) });
    save();
    return true;
  }
  function set(id, qty) {
    const line = state.find((l) => l.id === id);
    if (!line) return;
    if (qty <= 0) return remove(id);
    line.qty = Math.min(50, qty);
    save();
  }
  function remove(id) {
    state = state.filter((l) => l.id !== id);
    save();
  }
  function clear() {
    state = [];
    save();
  }

  const api = { add, set, remove, clear, lines, count, subtotal, money, FREE_SHIPPING, product: (id) => byId[id] };
  api.onChange = (fn) => {
    listeners.push(fn);
    fn(api);
  };
  function emit() {
    listeners.forEach((fn) => fn(api));
  }
  window.MC.cart = api;

  /* ---------- Free-shipping progress (used by drawer + cart page) ---------- */
  api.shippingHTML = function () {
    const total = subtotal();
    const left = Math.max(0, FREE_SHIPPING - total);
    const pct = Math.min(100, (total / FREE_SHIPPING) * 100);
    const msg = left > 0
      ? `Spend ${money(left)} for <span class="text-[#30b94d]">Free Shipping</span>`
      : `Congratulations! You've got <span class="text-[#30b94d]">Free Shipping</span>`;
    return `
      <div class="threshold">
        <p class="threshold-spend">${msg}</p>
        <div class="threshold-bar"><span class="threshold-fill" style="width:${pct}%"><span><svg><use href="#i-truck"/></svg></span></span></div>
      </div>`;
  };

  /* ---------- Which product does an add-to-cart button belong to? ---------- */
  function productFor(btn) {
    if (btn.dataset.product) return btn.dataset.product;
    // Product cards: read the id from the card's product image
    const card = btn.closest('.p-card, .feat-row, .rel-card');
    const img = card && card.querySelector('img[src*="assets/images/products/"]');
    const m = img && img.getAttribute('src').match(/products\/([a-z0-9-]+)-\d+\.jpg/);
    if (m) return m[1];
    return btn.closest('[data-product]')?.dataset.product || null;
  }

  api.productFor = productFor; // shared with wishlist.js

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add-cart]');
    if (!btn || btn.disabled) return;
    e.preventDefault();
    const id = productFor(btn);
    const qtyInput = btn.closest('div, form')?.querySelector('.qty input');
    const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
    if (id && add(id, qty)) {
      window.MC.toast?.(`Added to cart: ${byId[id].title}`);
      if (btn.hasAttribute('data-buy-now')) location.href = 'cart.html';
    } else {
      window.MC.toast?.('Sorry, this product is unavailable');
    }
  });

  /* ---------- Header counters + mini cart in the drawer ---------- */
  function renderMini() {
    document.querySelectorAll('[data-cart-count]').forEach((el) => (el.textContent = count()));
    const box = document.querySelector('[data-mini-cart]');
    const foot = document.querySelector('[data-mini-cart-foot]');
    if (!box) return;
    const ls = lines();
    if (!ls.length) {
      box.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center p-8">
          <svg class="w-16 h-16 text-line mb-4"><use href="#i-bag"/></svg>
          <p class="text-ink font-bold mb-1">Your cart is currently empty.</p>
          <p class="text-[13px] mb-6">Free shipping for any orders above ${money(FREE_SHIPPING)}</p>
          <a href="shop.html" class="btn btn-dark">Continue shopping</a>
        </div>`;
      if (foot) foot.hidden = true;
      return;
    }
    box.innerHTML = ls
      .map(
        (l) => `
        <div class="mini-line">
          <a href="${l.product.url || '#'}" class="mini-img"><img src="assets/images/products/${l.id}-1.jpg" alt="" loading="lazy"></a>
          <div class="min-w-0 flex-1">
            <a href="${l.product.url || '#'}" class="mini-title">${l.product.title}</a>
            <p class="text-[12px] mt-1"><span class="text-body">${l.qty} ×</span> <b class="text-ink">${money(l.product.price)}</b></p>
          </div>
          <button type="button" class="mini-remove" data-cart-remove="${l.id}" aria-label="Remove ${l.product.title}"><svg><use href="#i-close"/></svg></button>
        </div>`
      )
      .join('');
    if (foot) {
      foot.hidden = false;
      foot.querySelector('[data-mini-subtotal]').textContent = money(subtotal());
      foot.querySelector('[data-mini-shipping]').innerHTML = api.shippingHTML();
    }
  }
  document.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-cart-remove]');
    if (rm) {
      e.preventDefault();
      remove(rm.dataset.cartRemove);
    }
  });

  api.onChange(renderMini);
  // Keep tabs in sync
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = read();
      emit();
    }
  });
})();
