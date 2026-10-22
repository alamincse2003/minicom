/* ==========================================================================
   Shared partials loader
   Every page has slots like <div data-include="header"></div>. This file
   fetches partials/<name>.html (icons → partials/icons.svg), swaps them in,
   applies page state from <body data-nav="..." data-header="solid">, then
   loads the page scripts listed in data-scripts, in order.

   Needs a web server (Live Server / XAMPP): browsers block fetch() on file://.
   ========================================================================== */
(function () {
  const me = document.currentScript;
  const base = me.src.replace(/assets\/js\/include\.js.*$/, '');
  const scripts = (me.dataset.scripts || '').split(/\s+/).filter(Boolean);
  const body = document.body;

  const fileFor = (name) => `${base}partials/${name}.${name === 'icons' ? 'svg' : 'html'}`;

  function loadPartial(slot) {
    return fetch(fileFor(slot.dataset.include))
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.url}`);
        return res.text();
      })
      .then((html) => {
        slot.outerHTML = html;
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

  // async=false keeps execution in list order while still loading in parallel
  function loadScripts(list) {
    return new Promise((resolve) => {
      if (!list.length) return resolve();
      list.forEach((src, i) => {
        const s = document.createElement('script');
        s.src = base + src;
        s.async = false;
        if (i === list.length - 1) s.onload = s.onerror = resolve;
        document.body.appendChild(s);
      });
    });
  }

  function showServerNotice(err) {
    console.error('[include.js] Could not load shared partials:', err);
    const note = document.createElement('div');
    note.setAttribute('role', 'alert');
    note.style.cssText =
      'position:fixed;inset:auto 16px 16px 16px;z-index:9999;padding:14px 18px;border-radius:6px;' +
      'background:#181818;color:#fff;font:14px/1.5 sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.3)';
    note.textContent =
      'Header/footer could not load. Open this site through a local server (VS Code Live Server or XAMPP), not by double-clicking the file.';
    body.appendChild(note);
  }

  const slots = [...document.querySelectorAll('[data-include]')];
  Promise.all(slots.map(loadPartial))
    .then(() => {
      applyPageState();
      document.dispatchEvent(new CustomEvent('partials:loaded'));
      return loadScripts(scripts);
    })
    .catch(showServerNotice);
})();
