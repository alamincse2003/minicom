/* ==========================================================================
   Product page: media gallery (images + 3D), hover zoom, lightbox, tabs,
   reviews form, share / compare, live viewers, sticky add-to-cart.
   ========================================================================== */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const toast = (text) => window.MC?.toast?.(text);

  /* ---------- Gallery: main slider + thumbnails ---------- */
  const thumbs = $$('.pd-thumb');
  let main = null;
  function setThumb(i) {
    thumbs.forEach((t, n) => {
      t.classList.toggle('active', n === i);
      t.setAttribute('aria-selected', n === i);
    });
  }
  if (window.Swiper && $('.pd-main')) {
    main = new Swiper('.pd-main', {
      speed: 500,
      spaceBetween: 10,
      // Dragging on the 3D slide rotates the model instead of changing slide
      noSwipingClass: 'swiper-no-swiping',
      navigation: { prevEl: '.pd-prev', nextEl: '.pd-next' },
      on: {
        slideChange(s) {
          setThumb(s.activeIndex);
          // Fullscreen only applies to images, not the 3D model
          const expand = $('.pd-expand');
          if (expand) expand.hidden = !s.slides[s.activeIndex].querySelector('[data-zoom]');
        },
      },
    });
  }
  thumbs.forEach((t) => t.addEventListener('click', () => main?.slideTo(+t.dataset.index)));
  $$('[data-goto-slide]').forEach((b) => b.addEventListener('click', () => main?.slideTo(+b.dataset.gotoSlide)));

  /* ---------- 3D model: hint once loaded, friendly message if it fails ---------- */
  const mv = $('model-viewer');
  if (mv) {
    const hint = $('.pd-3d-hint');
    const error = $('.pd-3d-error');
    mv.addEventListener('load', () => {
      hint.hidden = false;
      // Fade the hint after the first interaction
      mv.addEventListener('camera-change', (e) => {
        if (e.detail.source === 'user-interaction') hint.classList.add('is-faded');
      });
    });
    mv.addEventListener('error', () => {
      error.hidden = false;
      // Browsers block loading model files into pages opened straight from disk
      if (location.protocol === 'file:') {
        $('.pd-3d-error-text', error).textContent =
          'The 3D model can only load when the site is served over http (e.g. http://localhost/minicom/product.html), not opened as a file.';
        console.warn('[3D] model-viewer cannot fetch local files over file://. Open the site through XAMPP / a web server.');
      }
    });
  }

  /* ---------- Hover zoom (mouse only) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('[data-zoom]').forEach((box) => {
      const img = box.querySelector('img');
      box.addEventListener('mousemove', (e) => {
        const r = box.getBoundingClientRect();
        img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      });
      box.addEventListener('mouseenter', () => box.classList.add('is-zoomed'));
      box.addEventListener('mouseleave', () => box.classList.remove('is-zoomed'));
    });
  }

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById('pdLightbox');
  if (lb) {
    const imgs = $$('[data-zoom] img').map((i) => ({ src: i.getAttribute('src'), alt: i.alt }));
    const lbImg = $('[data-lb-img]', lb);
    const lbCount = $('[data-lb-count]', lb);
    let cur = 0;
    const show = (i) => {
      cur = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[cur].src;
      lbImg.alt = imgs[cur].alt;
      lbCount.textContent = `${cur + 1} / ${imgs.length}`;
    };
    // Open on the image that is currently showing (the 3D slide falls back to the first image)
    $$('[data-lightbox-open]').forEach((b) =>
      b.addEventListener('click', () => {
        const active = main?.slides[main.activeIndex]?.querySelector('[data-zoom] img');
        show(active ? Math.max(0, imgs.findIndex((x) => x.src === active.getAttribute('src'))) : 0);
      })
    );
    // Clicking an image opens the lightbox too
    $$('[data-zoom]').forEach((box) => box.addEventListener('click', () => $('.pd-expand')?.click()));
    $('[data-lb-prev]', lb).addEventListener('click', () => show(cur - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => show(cur + 1));
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* ---------- Live viewers counter (demo) ---------- */
  const viewers = $('[data-viewers]');
  if (viewers) setInterval(() => (viewers.textContent = 12 + Math.floor(Math.random() * 20)), 5000);

  /* ---------- Terms checkbox unlocks "Buy it now" ---------- */
  const terms = document.getElementById('pdTerms');
  const buyNow = document.getElementById('pdBuyNow');
  terms?.addEventListener('change', () => (buyNow.disabled = !terms.checked));
  // Buy it now: cart.js adds the item and opens cart.html (data-buy-now)

  /* ---------- Compare ---------- */
  $$('[data-compare]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const added = btn.classList.toggle('text-accent');
      toast(added ? 'Added to compare' : 'Removed from compare');
    })
  );

  /* ---------- Share ---------- */
  const url = encodeURIComponent(location.href);
  const title = encodeURIComponent(document.title);
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    x: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
  };
  $$('[data-share]').forEach((a) => (a.href = shareLinks[a.dataset.share]));
  const shareInput = $('[data-share-url]');
  if (shareInput) shareInput.value = location.href;
  $('[data-copy-link]')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
    } catch (e) {
      shareInput?.select();
      document.execCommand?.('copy');
    }
    toast('Link copied to clipboard');
  });

  /* ---------- Tabs (with arrow-key support) ---------- */
  const tabs = $$('[data-tab]');
  function openTab(id) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
    });
    $$('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== id));
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => openTab(t.dataset.tab));
    t.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      openTab(next.dataset.tab);
    });
  });
  $$('[data-tab-link]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openTab(a.dataset.tabLink);
      document.getElementById('pdTabs')?.scrollIntoView({ behavior: 'smooth' });
    })
  );

  /* ---------- Review form toggle ---------- */
  const reviewToggle = $('[data-review-toggle]');
  reviewToggle?.addEventListener('click', () => {
    const form = document.getElementById('reviewForm');
    const open = form.classList.toggle('hidden') === false;
    reviewToggle.setAttribute('aria-expanded', open);
    reviewToggle.textContent = open ? 'Cancel review' : 'Write a review';
  });

  /* ---------- Demo forms (review, ask a question) ---------- */
  $$('[data-demo-form]').forEach((form) =>
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      form.querySelector('.form-msg')?.classList.remove('hidden');
    })
  );

  /* ---------- Sticky add-to-cart bar ---------- */
  const bar = document.getElementById('stickyAtc');
  const buy = document.getElementById('pdBuy');
  if (bar && buy && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      // Show only once the main buy row has scrolled up out of view
      const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      bar.classList.toggle('show', show);
      bar.inert = !show;
      document.body.classList.toggle('has-sticky-atc', show);
    }).observe(buy);
  }

  /* ---------- Recently viewed carousel ---------- */
  if (window.Swiper && $('.recent-swiper')) {
    new Swiper('.recent-swiper', {
      slidesPerView: 2,
      spaceBetween: 15,
      speed: 700,
      grabCursor: true,
      navigation: { prevEl: '.recent-prev', nextEl: '.recent-next' },
      pagination: { el: '.recent-dots', clickable: true },
      breakpoints: {
        768: { slidesPerView: 3, spaceBetween: 30 },
        1200: { slidesPerView: 4, spaceBetween: 30 },
        1500: { slidesPerView: 5, spaceBetween: 30 },
      },
    });
  }
})();
