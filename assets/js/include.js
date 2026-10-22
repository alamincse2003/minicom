/* ==========================================================================
   Shared partials loader
   Every page has slots like <div data-include="header"></div>. This file
   loads partials/<name>.js (each sets window.MC_PARTIALS.<name> to an HTML
   string), swaps the slots, applies page state from
   <body data-nav="..." data-header="solid">, then loads the page scripts
   listed in data-scripts, in order.

   Script tags (not fetch) are used on purpose: pages keep working when they
   are opened straight from disk (file://) as well as from a server.
   ========================================================================== */
(function () {
  const me = document.currentScript;
  const base = me.src.replace(/assets\/js\/include\.js.*$/, '');
  const scripts = (me.dataset.scripts || '').split(/\s+/).filter(Boolean);
  const body = document.body;

  // async=false: files load in parallel but run in list order
  function loadScripts(list) {
    return new Promise((resolve, reject) => {
      if (!list.length) return resolve();
      let left = list.length;
      list.forEach((src) => {
        const s = document.createElement('script');
        s.src = base + src;
        s.async = false;
        s.onload = () => --left === 0 && resolve();
        s.onerror = () => reject(new Error('Could not load ' + src));
        document.body.appendChild(s);
      });
    });
  }

  function applyPageState() {
    if (body.dataset.header === 'solid') {
      document.getElementById('siteHeader')?.classList.add('is-solid');
    }
    const nav = body.dataset.nav;
    if (nav) {
      document.querySelectorAll(`[data-nav="${nav}"]`).forEach((el) => el.classList.add('text-accent'));
    }
  }

  const slots = [...document.querySelectorAll('[data-include]')];
  const names = [...new Set(slots.map((s) => s.dataset.include))];

  loadScripts(names.map((n) => `partials/${n}.js`))
    .then(() => {
      slots.forEach((slot) => {
        const html = window.MC_PARTIALS && window.MC_PARTIALS[slot.dataset.include];
        if (html == null) throw new Error('Missing partial: ' + slot.dataset.include);
        slot.outerHTML = html;
      });
      applyPageState();
      document.dispatchEvent(new CustomEvent('partials:loaded'));
      return loadScripts(scripts);
    })
    .catch((err) => console.error('[include.js]', err));
})();
