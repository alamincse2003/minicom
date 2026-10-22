/* ==========================================================================
   Account page (demo, no backend)
   Accounts live in this browser only: localStorage "mc_users" with
   SHA-256 password hashes, "mc_session" holds the signed-in email.
   Orders come from checkout.js ("mc_orders"). A real store needs a server.
   ========================================================================== */
(function () {
  const root = document.getElementById('accountApp');
  if (!root) return;
  const $ = (s, el = root) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (n) => (window.MC && window.MC.cart ? window.MC.cart.money(n) : '$' + n);

  const load = (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch (e) {
      return d;
    }
  };
  const store = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  };
  const users = () => load('mc_users', []);
  const session = () => load('mc_session', null);

  async function hash(text) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    return 'plain:' + btoa(unescape(encodeURIComponent(text))); // very old browsers / file:// fallback
  }

  /* ---------- Login / register switch ---------- */
  const switchEl = $('.acc-switch');
  function showPanel(name) {
    root.querySelectorAll('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== name));
    switchEl.dataset.active = name === 'register' ? 'register' : 'login';
    root.querySelectorAll('[data-show]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.show === switchEl.dataset.active)));
    root.querySelectorAll('.acc-msg').forEach((m) => (m.hidden = true));
  }
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-show]');
    if (b) {
      e.preventDefault();
      showPanel(b.dataset.show);
    }
    const eye = e.target.closest('[data-eye]');
    if (eye) {
      const input = eye.parentElement.querySelector('input');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      eye.classList.toggle('is-on', show);
    }
  });

  function msg(form, text, ok) {
    const m = $('.acc-msg', form);
    m.hidden = false;
    m.textContent = text;
    m.classList.toggle('is-ok', !!ok);
  }

  /* ---------- Register ---------- */
  $('#accRegister').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const data = Object.fromEntries(new FormData(f));
    const email = data.email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return msg(f, 'Please enter a valid email address.');
    if (!data.first.trim() || !data.last.trim()) return msg(f, 'Please enter your first and last name.');
    if (data.password.length < 5) return msg(f, 'Password must be at least 5 characters.');
    const list = users();
    if (list.some((u) => u.email === email)) return msg(f, 'An account with this email already exists. Please log in.');
    list.push({ email, first: data.first.trim(), last: data.last.trim(), pass: await hash(data.password), news: !!data.news, since: new Date().toISOString().slice(0, 10) });
    store('mc_users', list);
    store('mc_session', email);
    render();
    window.MC?.toast?.('Welcome! Your account has been created.');
  });

  /* ---------- Login ---------- */
  $('#accLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const email = f.email.value.trim().toLowerCase();
    const user = users().find((u) => u.email === email);
    if (!user || user.pass !== (await hash(f.password.value))) return msg(f, 'Incorrect email or password.');
    store('mc_session', email);
    render();
  });

  /* ---------- Recover ---------- */
  $('#accRecover').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) return msg(f, 'Please enter a valid email address.');
    msg(f, "We've sent you an email with a link to update your password.", true);
    f.reset();
  });

  /* ---------- Dashboard ---------- */
  function dashboard(user) {
    const orders = load('mc_orders', []).filter((o) => o.email && o.email.toLowerCase() === user.email);
    const last = orders[0];
    const rows = orders.length
      ? `<div class="acc-table" role="table">
           <div class="acc-tr acc-th" role="row"><span>Order</span><span>Date</span><span>Items</span><span>Status</span><span>Total</span></div>
           ${orders
             .map(
               (o) => `<div class="acc-tr" role="row">
                 <span><b>${esc(o.no)}</b></span>
                 <span>${new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                 <span>${o.count}</span>
                 <span><em class="acc-status">Processing</em></span>
                 <span><b>${money(o.total)}</b></span>
               </div>`
             )
             .join('')}
         </div>`
      : `<div class="acc-empty">You haven't placed any orders yet. <a href="shop.html">Start shopping</a></div>`;
    return `
      <div class="acc-dash">
        <div class="acc-dash-head">
          <div>
            <p class="acc-hello">Hello, ${esc(user.first)}!</p>
            <p class="text-[13px]">Member since ${new Date(user.since + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          <button type="button" class="btn btn-dark" data-logout>Log out</button>
        </div>
        <div class="acc-dash-grid">
          <section class="acc-box">
            <h2 class="acc-box-title">Order history</h2>
            ${rows}
          </section>
          <aside class="acc-box">
            <h2 class="acc-box-title">Account details</h2>
            <p class="font-bold text-ink">${esc(user.first)} ${esc(user.last)}</p>
            <p>${esc(user.email)}</p>
            <p class="mt-4 font-bold text-ink">Default address</p>
            <p>${last ? esc(last.address) : 'No address saved yet. It is added after your first order.'}</p>
            <div class="acc-links">
              <a href="wishlist.html">My wishlist (<span data-wishlist-count>0</span>)</a>
              <a href="cart.html">My cart (<span data-cart-count>0</span>)</a>
            </div>
          </aside>
        </div>
      </div>`;
  }

  function render() {
    const email = session();
    const user = email && users().find((u) => u.email === email);
    const authBox = $('#accAuth');
    const dashBox = $('#accDash');
    authBox.hidden = !!user;
    dashBox.hidden = !user;
    document.getElementById('accTitle').textContent = user ? 'My Account' : 'Account';
    if (user) {
      dashBox.innerHTML = dashboard(user);
      // refresh counters inside the dashboard
      document.querySelectorAll('[data-cart-count]').forEach((el) => (el.textContent = window.MC?.cart?.count() ?? 0));
      document.querySelectorAll('[data-wishlist-count]').forEach((el) => (el.textContent = window.MC?.wishlist?.items().length ?? 0));
    } else {
      showPanel(location.hash === '#register' ? 'register' : location.hash === '#recover' ? 'recover' : 'login');
    }
  }
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-logout]')) {
      localStorage.removeItem('mc_session');
      render();
    }
  });

  render();
})();
