/* ==========================================================================
   Cart page (cart.html): renders lines, totals, free-shipping bar and
   "You may also like" products from window.MC.cart (assets/js/cart.js).
   ========================================================================== */
(function () {
  const cart = window.MC && window.MC.cart;
  if (!cart) return;
  const $ = (s) => document.querySelector(s);
  const filled = $('#cartFilled');
  const empty = $('#cartEmpty');
  const linesBox = $('#cartLines');
  const money = cart.money;

  $('#cartFreeAt').textContent = money(cart.FREE_SHIPPING);

  function lineHTML(l) {
    const p = l.product;
    const url = p.url || '#';
    return `
      <div class="cart-line" data-id="${l.id}">
        <div class="cart-c-remove">
          <button type="button" class="cart-remove" data-cart-remove="${l.id}" aria-label="Remove ${p.title}"><svg><use href="#i-trash"/></svg></button>
        </div>
        <div class="cart-c-product">
          <a href="${url}" class="cart-img"><img src="assets/images/products/${l.id}-1.jpg" alt="${p.title}" loading="lazy"></a>
          <a href="${url}" class="cart-name">${p.title}<span class="md:hidden"> (x${l.qty})</span></a>
        </div>
        <div class="cart-c-price"><span class="cart-m-label">Price</span>${money(p.price)}</div>
        <div class="cart-c-qty">
          <span class="cart-m-label">Qty</span>
          <div class="cart-qty">
            <button type="button" data-step="-1" aria-label="Decrease quantity">-</button>
            <input type="number" value="${l.qty}" min="1" max="50" aria-label="Quantity for ${p.title}">
            <button type="button" data-step="1" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-c-total"><span class="cart-m-label">Total</span>${money(l.total)}</div>
      </div>`;
  }

  function relatedHTML(p) {
    const url = p.url || '#';
    const price = p.compare
      ? `<span class="text-sale">${money(p.price)}</span><s class="ml-2.5 text-[#d5d5d5]">${money(p.compare)}</s>`
      : money(p.price);
    return `
      <div class="rel-card">
        <div class="rel-img">
          <a href="${url}"><img src="assets/images/products/${p.id}-1.jpg" alt="${p.title}" loading="lazy"></a>
          <button type="button" class="rel-add" data-add-cart data-product="${p.id}">Add to cart</button>
        </div>
        <a href="${url}" class="rel-title">${p.title}</a>
        <p class="rel-price">${price}</p>
      </div>`;
  }

  function renderRelated() {
    const inCart = new Set(cart.lines().map((l) => l.id));
    const pool = (window.MC_SHOP.products || []).filter((p) => p.inStock && !inCart.has(p.id));
    // Same category as the first cart line first, then anything else
    const first = cart.lines()[0];
    pool.sort((a, b) => (b.cat === first?.product.cat) - (a.cat === first?.product.cat) || a.order - b.order);
    $('#cartRelated').innerHTML = pool.slice(0, 4).map(relatedHTML).join('');
  }

  let lastIds = '';
  function render() {
    const lines = cart.lines();
    filled.hidden = !lines.length;
    empty.hidden = !!lines.length;
    if (!lines.length) return;

    // Only rebuild rows when the set of products changes, so typing in a
    // quantity box keeps focus
    const ids = lines.map((l) => l.id).join();
    if (ids !== lastIds) {
      linesBox.innerHTML = lines.map(lineHTML).join('');
      renderRelated();
      lastIds = ids;
    } else {
      lines.forEach((l) => {
        const row = linesBox.querySelector(`[data-id="${l.id}"]`);
        const input = row.querySelector('input');
        if (document.activeElement !== input) input.value = l.qty;
        row.querySelector('.cart-c-total').innerHTML = `<span class="cart-m-label">Total</span>${money(l.total)}`;
        row.querySelector('.cart-name span').textContent = ` (x${l.qty})`;
      });
    }
    $('#cartTotal').textContent = money(cart.subtotal());
    $('#cartShipping').innerHTML = cart.shippingHTML();
  }

  linesBox.addEventListener('click', (e) => {
    const step = e.target.closest('[data-step]');
    if (!step) return;
    const id = step.closest('.cart-line').dataset.id;
    const line = cart.lines().find((l) => l.id === id);
    cart.set(id, Math.max(1, line.qty + Number(step.dataset.step)));
  });
  linesBox.addEventListener('change', (e) => {
    if (!e.target.matches('.cart-qty input')) return;
    const id = e.target.closest('.cart-line').dataset.id;
    cart.set(id, Math.max(1, parseInt(e.target.value, 10) || 1));
  });

  cart.onChange(render);
})();
