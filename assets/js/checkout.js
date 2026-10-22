/* ==========================================================================
   Checkout (demo, no real payment)
   Reads the cart from window.MC.cart, renders the order summary, offers
   shipping methods once an address is entered, validates the form and
   shows a thank-you screen (the cart is then emptied).
   ========================================================================== */
(function () {
  const cart = window.MC && window.MC.cart;
  if (!cart) return;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const money = cart.money;
  const form = $('#coForm');

  const SHIPPING = [
    { id: 'standard', name: 'Standard', eta: '5 to 8 business days', price: 25 },
    { id: 'express', name: 'Express', eta: '2 to 3 business days', price: 45 },
  ];
  let shipping = null; // selected method id

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#coToast');
    el.textContent = msg;
    el.classList.add('is-open');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-open'), 2600);
  }

  /* ---------- Totals ---------- */
  const freeShipping = () => cart.subtotal() >= cart.FREE_SHIPPING;
  function shippingCost() {
    if (!shipping) return null;
    const m = SHIPPING.find((s) => s.id === shipping);
    return m.id === 'standard' && freeShipping() ? 0 : m.price;
  }
  function renderTotals() {
    const ship = shippingCost();
    const total = cart.subtotal() + (ship || 0);
    $$('[data-co-count]').forEach((el) => (el.textContent = cart.count()));
    $$('[data-co-subtotal]').forEach((el) => (el.textContent = money(cart.subtotal())));
    $$('[data-co-shipping]').forEach((el) => {
      el.textContent = ship == null ? 'Enter shipping address' : ship === 0 ? 'FREE' : money(ship);
      el.classList.toggle('text-body', ship == null);
    });
    $$('[data-co-total]').forEach((el) => (el.textContent = money(total)));
  }

  /* ---------- Order summary lines ---------- */
  function renderLines() {
    $('#coLines').innerHTML = cart
      .lines()
      .map(
        (l) => `
        <div class="co-line">
          <span class="co-line-img"><img src="assets/images/products/${l.id}-1.webp" alt="" loading="lazy"><b>${l.qty}</b></span>
          <span class="co-line-name">${l.product.title}</span>
          <span class="co-line-price">${money(l.total)}</span>
        </div>`
      )
      .join('');
  }

  /* ---------- Shipping methods appear once the address is complete ---------- */
  const addressReady = () => ['#coAddress', '#coCity', '#coZip'].every((s) => $(s).value.trim());
  function renderShipping() {
    const box = $('#coShipping');
    if (!addressReady()) {
      shipping = null;
      box.className = 'co-ship-empty';
      box.textContent = 'Enter your shipping address to view available shipping methods.';
      renderTotals();
      return;
    }
    if (!shipping) shipping = 'standard';
    box.className = 'co-pay-box';
    box.innerHTML = SHIPPING.map((m) => {
      const price = m.id === 'standard' && freeShipping() ? 'FREE' : money(m.price);
      return `
        <label class="co-radio-row ${shipping === m.id ? 'is-active' : ''}">
          <input type="radio" name="shipping" value="${m.id}" ${shipping === m.id ? 'checked' : ''}>
          <span class="co-radio"></span>
          <span class="flex-1">${m.name}<small class="block text-[12px] text-body">${m.eta}</small></span>
          <b class="text-ink">${price}</b>
        </label>`;
    }).join('');
    renderTotals();
  }
  $('#coShipping').addEventListener('change', (e) => {
    if (e.target.name !== 'shipping') return;
    shipping = e.target.value;
    renderShipping();
  });
  ['#coAddress', '#coCity', '#coZip'].forEach((s) => $(s).addEventListener('input', renderShipping));

  /* ---------- Payment method panels ---------- */
  form.addEventListener('change', (e) => {
    if (e.target.name !== 'payment') return;
    $$('input[name="payment"]').forEach((r) => r.closest('.co-radio-row').classList.toggle('is-active', r.checked));
    $$('[data-pay-panel]').forEach((p) => (p.hidden = p.dataset.payPanel !== e.target.value));
  });

  /* ---------- Card input formatting ---------- */
  $('#coCard').addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 19);
    e.target.value = digits.replace(/(.{4})/g, '$1 ').trim();
  });
  $('#coExp').addEventListener('input', (e) => {
    const d = e.target.value.replace(/\D/g, '').slice(0, 4);
    e.target.value = d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  });
  $('#coCvc').addEventListener('input', (e) => (e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4)));

  /* ---------- Validation ---------- */
  const rules = {
    coEmail: (v) => (/^\S+@\S+\.\S+$/.test(v) || /^\+?[\d\s()-]{7,}$/.test(v) ? '' : 'Enter an email or phone number'),
    coLast: (v) => (v ? '' : 'Enter a last name'),
    coAddress: (v) => (v ? '' : 'Enter an address'),
    coCity: (v) => (v ? '' : 'Enter a city'),
    coZip: (v) => (v ? '' : 'Enter a ZIP / postal code'),
    coCard: (v) => (v.replace(/\D/g, '').length >= 13 ? '' : 'Enter a valid card number'),
    coExp: (v) => {
      const m = v.match(/^(\d{2}) \/ (\d{2})$/);
      if (!m || +m[1] < 1 || +m[1] > 12) return 'Enter a valid expiration date';
      const end = new Date(2000 + +m[2], +m[1], 1);
      return end > new Date() ? '' : 'Enter a valid expiration date';
    },
    coCvc: (v) => (/^\d{3,4}$/.test(v) ? '' : 'Enter the CVV or security code on your card'),
    coName: (v) => (v ? '' : 'Enter your name exactly as it’s written on your card'),
  };
  function check(id) {
    const input = document.getElementById(id);
    if (input.closest('[hidden]')) return '';
    const msg = rules[id](input.value.trim());
    input.closest('.co-field').classList.toggle('has-error', !!msg);
    const err = document.querySelector(`[data-error-for="${id}"]`);
    if (err) err.textContent = msg;
    return msg;
  }
  Object.keys(rules).forEach((id) =>
    document.getElementById(id).addEventListener('blur', (e) => e.target.value && check(id))
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstBad = Object.keys(rules).find((id) => check(id));
    if (firstBad) {
      document.getElementById(firstBad).focus();
      return;
    }
    if (!shipping) {
      toast('Choose a shipping method');
      return;
    }
    placeOrder();
  });

  /* ---------- Thank-you screen ---------- */
  function placeOrder() {
    const btn = form.querySelector('.co-submit');
    btn.disabled = true;
    btn.textContent = 'Processing…';
    setTimeout(() => {
      const ship = shippingCost();
      const order = '#MC' + String(Date.now()).slice(-6);
      const name = $('#coFirst').value.trim();
      const address = [$('#coAddress').value, $('#coApt').value, $('#coCity').value, $('#coState').value, $('#coZip').value, $('#coCountry').value]
        .map((s) => s.trim())
        .filter(Boolean)
        .join(', ');
      const method = SHIPPING.find((s) => s.id === shipping);
      $('#coOrderNo').textContent = order;
      $('#coThanksName').textContent = name ? `, ${name}` : '';
      $('#coThanksDetails').innerHTML = `
        <div><dt>Contact</dt><dd>${escapeHTML($('#coEmail').value)}</dd></div>
        <div><dt>Ship to</dt><dd>${escapeHTML(address)}</dd></div>
        <div><dt>Shipping</dt><dd>${method.name} · ${ship === 0 ? 'FREE' : money(ship)}</dd></div>
        <div><dt>Payment</dt><dd>${form.payment.value === 'card' ? 'Card ending in ' + $('#coCard').value.replace(/\D/g, '').slice(-4) : 'PayPal'} · ${money(cart.subtotal() + ship)}</dd></div>`;
      // Save the order for the account page (account.html → Order history)
      try {
        const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
        orders.unshift({
          no: order,
          date: new Date().toISOString(),
          email: $('#coEmail').value.trim(),
          address,
          count: cart.count(),
          items: cart.lines().map((l) => ({ id: l.id, qty: l.qty })),
          total: cart.subtotal() + ship,
        });
        localStorage.setItem('mc_orders', JSON.stringify(orders));
      } catch (e) {}

      // Keep the summary showing what was bought, then empty the cart
      frozen = true;
      cart.clear();
      form.hidden = true;
      $('#coThanks').hidden = false;
      $('.co-express')?.remove();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  }
  const escapeHTML = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  /* ---------- Discount code (demo: no codes are active) ---------- */
  const code = $('#coCode');
  const apply = $('#coDiscount .co-apply');
  code.addEventListener('input', () => {
    apply.disabled = !code.value.trim();
    $('#coCodeError').textContent = '';
    code.closest('.co-field').classList.remove('has-error');
  });
  $('#coDiscount').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!code.value.trim()) return;
    code.closest('.co-field').classList.add('has-error');
    $('#coCodeError').textContent = 'Enter a valid discount code or gift card';
  });

  /* ---------- Express buttons + login link (demo) ---------- */
  $$('[data-express]').forEach((b) => b.addEventListener('click', () => toast(`${b.dataset.express} is not connected in this demo`)));
  $('[data-co-login]').addEventListener('click', (e) => {
    e.preventDefault();
    toast('Customer login is not connected in this demo');
  });

  /* ---------- Phones: collapsible summary ---------- */
  const toggle = $('#coSummaryToggle');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', open);
    $('#coSummary').classList.toggle('is-open', open);
    $('#coToggleText').textContent = open ? 'Hide order summary' : 'Show order summary';
  });

  /* ---------- Render ---------- */
  let frozen = false;
  cart.onChange(() => {
    if (frozen) return; // after ordering, keep the receipt on screen
    const empty = !cart.count();
    form.hidden = empty;
    $('#coEmpty').hidden = !empty;
    document.body.classList.toggle('co-is-empty', empty);
    renderLines();
    renderShipping();
  });
})();
