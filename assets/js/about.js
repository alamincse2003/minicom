/* ==========================================================================
   About page: customer-video slider + lightbox, team and location sliders
   ========================================================================== */
(function () {
  /* ---------- Sliders ---------- */
  if (window.Swiper) {
    // Centre slide with the neighbours peeking in (reference: 27vw side padding)
    new Swiper('.video-swiper', {
      slidesPerView: 1.67, // 60vw centre slide on phones
      centeredSlides: true,
      spaceBetween: 15,
      loop: true,
      speed: 700,
      grabCursor: true,
      breakpoints: { 576: { slidesPerView: 2.17, spaceBetween: 30 } }, // 46vw centre slide
    });
    new Swiper('.team-swiper', {
      slidesPerView: 2,
      spaceBetween: 15,
      loop: true,
      speed: 700,
      grabCursor: true,
      breakpoints: { 768: { slidesPerView: 3, spaceBetween: 30 }, 1200: { slidesPerView: 4, spaceBetween: 30 } },
    });
    // Only 3 stores: no loop (it needs more slides than are visible)
    new Swiper('.loc-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 700,
      grabCursor: true,
      breakpoints: { 576: { slidesPerView: 2 }, 768: { slidesPerView: 3 } },
    });
  }

  /* ---------- Video lightbox (YouTube embed, cleared on close) ---------- */
  const popup = document.getElementById('videoPopup');
  const frame = document.getElementById('videoFrame');
  if (!popup || !frame) return;
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-video]');
    if (!btn) return;
    frame.src = btn.dataset.video;
    popup.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
  // ui.js closes the popup; stop the video when it does
  new MutationObserver(() => {
    if (!popup.classList.contains('is-open')) {
      frame.src = '';
      document.body.style.overflow = '';
    }
  }).observe(popup, { attributes: true, attributeFilter: ['class'] });
})();
