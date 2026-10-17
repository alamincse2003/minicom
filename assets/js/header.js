/* ==========================================================================
   Header: sticky / hide-on-scroll, desktop menu toggle, drawers,
   search overlay and the rotating search placeholder.
   ========================================================================== */
(function () {
  const header = document.getElementById('siteHeader');
  const overlay = document.querySelector('[data-overlay]');
  if (!header) return;

  /* ---------- Sticky header ---------- */
  let lastY = window.scrollY;
  const STICKY_AT = 250;

  function onScroll() {
    const y = window.scrollY;
    const sticky = y > STICKY_AT;
    header.classList.toggle('is-sticky', sticky);
    // Hide while scrolling down, reveal when scrolling up
    header.classList.toggle('is-hidden', sticky && y > lastY && y > 600 && !header.classList.contains('menu-open'));
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Desktop "Menu" toggle ---------- */
  const menuToggle = document.getElementById('menuToggle');
  menuToggle?.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (header.classList.contains('menu-open') && !header.contains(e.target)) {
      header.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Drawers (mobile menu, cart) ---------- */
  function closeDrawers() {
    document.querySelectorAll('.drawer.is-open').forEach((d) => d.classList.remove('is-open'));
    overlay?.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function openDrawer(id) {
    closeDrawers();
    const drawer = document.getElementById(id);
    if (!drawer) return;
    drawer.classList.add('is-open');
    overlay?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  document.querySelectorAll('[data-drawer-open]').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer(btn.dataset.drawerOpen);
    })
  );
  document.querySelectorAll('[data-drawer-close]').forEach((btn) => btn.addEventListener('click', closeDrawers));
  overlay?.addEventListener('click', closeDrawers);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeDrawers());

  // Expose so other modules (cart) can open the drawer
  window.MC = window.MC || {};
  window.MC.openDrawer = openDrawer;

  /* ---------- Mobile search overlay ---------- */
  document.querySelectorAll('[data-search-open]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const el = document.getElementById('searchOverlay');
      el.classList.add('is-open');
      el.querySelector('input')?.focus();
    })
  );

  /* ---------- Rotating search placeholder ---------- */
  const word = document.getElementById('searchWord');
  const words = ['Plant', 'Sofa', 'Basket', 'Chair'];
  if (word) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      if (window.gsap) {
        gsap.to(word, {
          y: -8, opacity: 0, duration: 0.25, ease: 'power2.in',
          onComplete() {
            word.textContent = words[i];
            gsap.fromTo(word, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
          },
        });
      } else {
        word.textContent = words[i];
      }
    }, 2500);
    word.style.display = 'inline-block';
  }
})();
