/* ==========================================================================
   UI behaviour: marquees, step accordion, featured product, FAQ,
   wishlist / cart counters, popups, newsletter, back-to-top.
   ========================================================================== */
(function () {
  window.MC = window.MC || {};

  /* ---------- Marquees: fill + clone the track for a seamless loop ---------- */
  document.querySelectorAll('.marquee').forEach((marquee) => {
    const track = marquee.querySelector('.marquee-track');
    if (!track) return;
    const items = [...track.children];
    // Width of the actual content (the track itself has min-width:100%)
    const contentWidth = () =>
      track.lastElementChild.getBoundingClientRect().right - track.firstElementChild.getBoundingClientRect().left;
    // Repeat items until one track's content is wider than the screen (covers 4K too)
    const target = Math.max(window.innerWidth, screen.width || 0) + 200;
    let guard = 0;
    while (contentWidth() < target && guard++ < 12) {
      items.forEach((el) => track.appendChild(el.cloneNode(true)));
    }
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a, button').forEach((el) => el.setAttribute('tabindex', '-1'));
    marquee.appendChild(clone);
  });

  /* ---------- Step-to-buy accordion (synced with the image slider) ---------- */
  const steps = [...document.querySelectorAll('.step')];
  let stepTimer;
  function setStep(i) {
    steps.forEach((s, n) => s.classList.toggle('active', n === i));
    window.MC.steps?.slideTo(i);
  }
  function autoSteps() {
    clearInterval(stepTimer);
    stepTimer = setInterval(() => {
      const cur = steps.findIndex((s) => s.classList.contains('active'));
      setStep((cur + 1) % steps.length);
    }, 6000);
  }
  steps.forEach((step, i) =>
    step.querySelector('.step-head').addEventListener('click', () => {
      setStep(i);
      autoSteps();
    })
  );
  if (steps.length) {
    autoSteps();
    window.MC.steps?.on('slideChange', (s) => {
      steps.forEach((st, n) => st.classList.toggle('active', n === s.activeIndex));
    });
  }

  /* ---------- Featured product: thumbnails + quantity ---------- */
  const mainImg = document.getElementById('featuredMain');
  document.querySelectorAll('#featuredThumbs .thumb-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      document.querySelectorAll('#featuredThumbs .thumb-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      mainImg.style.opacity = 0;
      setTimeout(() => {
        mainImg.src = btn.dataset.src;
        mainImg.style.opacity = 1;
      }, 200);
    })
  );
  document.querySelectorAll('[data-qty]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(btn.dataset.qty, 10));
    })
  );

  // Estimated delivery: 5–6 days from today
  const deliveryEl = document.getElementById('deliveryDate');
  if (deliveryEl) {
    const add = (d) => new Date(Date.now() + d * 864e5);
    const a = add(5), b = add(6);
    const month = b.toLocaleString('en-US', { month: 'short' });
    deliveryEl.textContent = `${a.getDate()} – ${b.getDate()} ${month}, ${b.getFullYear()}`;
  }

  /* ---------- Swatches ---------- */
  document.querySelectorAll('.swatch').forEach((sw) =>
    sw.addEventListener('click', () => {
      sw.parentElement.querySelectorAll('.swatch').forEach((s) => s.classList.remove('active'));
      sw.classList.add('active');
    })
  );

  /* ---------- FAQ accordion (one open at a time) ---------- */
  document.querySelectorAll('.faq-head').forEach((head) =>
    head.addEventListener('click', () => {
      const item = head.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    })
  );

  /* ---------- Toast ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(text) {
    if (!toast) return;
    toast.querySelector('[data-toast-text]').textContent = text;
    toast.classList.add('is-open');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-open'), 2200);
  }

  /* ---------- Wishlist / cart counters (demo only) ---------- */
  let wishlist = 0, cart = 0;
  document.querySelectorAll('[data-wishlist]').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const added = btn.classList.toggle('!bg-accent');
      wishlist += added ? 1 : -1;
      document.querySelectorAll('[data-wishlist-count]').forEach((el) => (el.textContent = wishlist));
      showToast(added ? 'This item has been added to your Wishlist' : 'Removed from Wishlist');
    })
  );
  document.querySelectorAll('[data-add-cart]').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const qtyInput = btn.closest('div')?.querySelector('.qty input');
      cart += qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      document.querySelectorAll('[data-cart-count]').forEach((el) => (el.textContent = cart));
      const empty = document.querySelector('[data-cart-empty]');
      if (empty) empty.textContent = `You have ${cart} item${cart > 1 ? 's' : ''} in your cart.`;
      showToast('Added to cart');
    })
  );

  /* ---------- Popups ---------- */
  function openPopup(id) {
    document.getElementById(id)?.classList.add('is-open');
  }
  function closePopup(el) {
    el.classList.remove('is-open');
    if (el.id === 'newsletterPopup' && document.getElementById('popupDismiss')?.checked) {
      try { localStorage.setItem('mc_newsletter_dismissed', '1'); } catch (e) {}
    }
  }
  document.querySelectorAll('[data-popup-open]').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup(btn.dataset.popupOpen);
    })
  );
  document.querySelectorAll('.popup').forEach((popup) => {
    popup.addEventListener('click', (e) => {
      if (e.target === popup || e.target.closest('[data-popup-close]')) closePopup(popup);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.popup.is-open').forEach(closePopup);
  });

  // Newsletter popup after 6s unless dismissed earlier
  let dismissed = false;
  try { dismissed = localStorage.getItem('mc_newsletter_dismissed') === '1'; } catch (e) {}
  if (!dismissed) setTimeout(() => openPopup('newsletterPopup'), 6000);

  /* ---------- Newsletter forms ---------- */
  document.querySelectorAll('.newsletter-form').forEach((form) =>
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      form.parentElement.querySelector('.form-msg')?.classList.remove('hidden');
    })
  );

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600), { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();
