/* ==========================================================================
   GSAP animations: hero captions, scroll reveals, parallax, stacked banners
   ========================================================================== */
(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // No GSAP (CDN blocked) or reduced motion: show everything, skip animation
  if (!window.gsap || !window.ScrollTrigger || reduced) {
    root.classList.remove('js-anim');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero: caption stagger + slow image zoom ---------- */
  function animateSlide(slide) {
    if (!slide) return;
    const lines = slide.querySelectorAll('.cap-line');
    const img = slide.querySelector('.hero-img');
    gsap.killTweensOf([lines, img]);
    gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 7, ease: 'power1.out' });
    gsap.fromTo(
      lines,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, delay: 0.35, ease: 'power3.out' }
    );
  }
  const hero = window.MC?.hero;
  if (hero) {
    animateSlide(hero.slides[hero.activeIndex]);
    hero.on('slideChangeTransitionStart', (s) => animateSlide(s.slides[s.activeIndex]));
  }

  // Header drops in on load
  gsap.from('#siteHeader', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.1, clearProps: 'transform,opacity' });

  /* ---------- Scroll reveals ---------- */
  const from = {
    'fade-up': { y: 40 },
    'fade-left': { x: -60 },
    'fade-right': { x: 60 },
  };
  document.querySelectorAll('[data-anim]').forEach((el) => {
    gsap.set(el, { opacity: 0, ...(from[el.dataset.anim] || from['fade-up']) });
  });
  root.classList.remove('js-anim'); // GSAP now owns the initial state

  ScrollTrigger.batch('[data-anim]', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, x: 0, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', overwrite: true }),
  });

  /* ---------- Parallax ---------- */
  document.querySelectorAll('[data-parallax] img').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
  document.querySelectorAll('[data-parallax-bg]').forEach((img) => {
    gsap.set(img, { scale: 1.15 });
    gsap.fromTo(
      img,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });

  /* ---------- Stacked banners: earlier cards shrink as the next one covers them ---------- */
  const cards = gsap.utils.toArray('.stack-card');
  cards.forEach((card, i) => {
    card.style.top = 100 + i * 20 + 'px';
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(card, {
      scale: 0.92,
      filter: 'brightness(0.7)',
      ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: `top ${100 + (i + 1) * 20}px`, scrub: true },
    });
  });

  /* ---------- Section titles: subtle letter-spacing settle ---------- */
  gsap.utils.toArray('.sec-title').forEach((t) => {
    gsap.from(t, {
      letterSpacing: '4px',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: t, start: 'top 90%', once: true },
    });
  });

  // Recalculate once images have loaded (heights change)
  // Scripts start after the partials load, so the page may already be complete
  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else window.addEventListener('load', () => ScrollTrigger.refresh());
})();
