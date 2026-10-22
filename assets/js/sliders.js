/* ==========================================================================
   Sliders (Swiper 11)
   ========================================================================== */
(function () {
  if (!window.Swiper) return;
  window.MC = window.MC || {};
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------- Hero ---------- */
  const heroEl = document.querySelector('.hero-swiper');
  if (heroEl) {
    const current = heroEl.querySelector('.hero-current');
    const total = heroEl.querySelector('.hero-total');
    const progress = heroEl.querySelector('.hero-progress');

    window.MC.hero = new Swiper(heroEl, {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: true,
      speed: 1200,
      autoplay: { delay: 7000, disableOnInteraction: false },
      navigation: { prevEl: '.hero-prev', nextEl: '.hero-next' },
      on: {
        slideChange(s) {
          current.textContent = pad(s.realIndex + 1);
        },
        autoplayTimeLeft(s, time, pct) {
          progress.style.width = (1 - pct) * 100 + '%';
        },
      },
    });
    total.textContent = pad(window.MC.hero.slides.length);
  }

  /* ---------- Product carousel (bleeds off the right edge) ---------- */
  if (document.querySelector('.products-swiper')) {
    // Pages a full view at a time, like the reference (one dot per page)
    new Swiper('.products-swiper', {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 15,
      speed: 700,
      grabCursor: true,
      navigation: { prevEl: '.products-prev', nextEl: '.products-next' },
      pagination: { el: '.products-dots', clickable: true },
      breakpoints: {
        768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 30 },
        1200: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 30 },
        1500: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 30 },
      },
    });
  }

  /* ---------- Step-to-buy images (driven by the accordion) ---------- */
  if (document.querySelector('.steps-swiper')) {
    // Slides sideways with a 10px gap; the next image peeks in from the right edge
    window.MC.steps = new Swiper('.steps-swiper', {
      slidesPerView: 1,
      spaceBetween: 10,
      speed: 700,
      allowTouchMove: true,
    });
  }

  /* ---------- Featured product images (one at a time, arrows on hover) ---------- */
  if (document.querySelector('.feat-swiper')) {
    new Swiper('.feat-swiper', {
      slidesPerView: 1,
      speed: 600,
      rewind: true,
      grabCursor: true,
      navigation: { prevEl: '.feat-prev', nextEl: '.feat-next' },
    });
  }

  /* ---------- Testimonials ---------- */
  if (document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      speed: 800,
      autoHeight: false,
      navigation: { prevEl: '.testi-prev', nextEl: '.testi-next' },
      pagination: { el: '.testi-dots', clickable: true },
      breakpoints: { 768: { slidesPerView: 2 } },
    });
  }

  /* ---------- Blog ---------- */
  if (document.querySelector('.blog-swiper')) {
    new Swiper('.blog-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 700,
      navigation: { prevEl: '.blog-prev', nextEl: '.blog-next' },
      pagination: { el: '.blog-dots', clickable: true },
      breakpoints: {
        576: { slidesPerView: 2, slidesPerGroup: 2 },
        992: { slidesPerView: 3, slidesPerGroup: 3 },
      },
    });
  }
})();
