/* ==========================================================================
   Blog: sidebar (both pages), list page (blog.html) and article page
   (blog-post.html?post=id). Data: window.MC_BLOG (assets/data/posts.js).
   List URL state: ?page=2  ?tag=Plant  ?q=wood
   ========================================================================== */
(function () {
  const B = window.MC_BLOG;
  if (!B) return;
  const $ = (s) => document.querySelector(s);
  const params = new URLSearchParams(location.search);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  const postUrl = (p) => `blog-post.html?post=${p.id}`;
  const img = (p) => `assets/images/blog/blog-${p.image}.jpg`;
  const d = (iso) => new Date(iso + 'T12:00:00');
  const longDate = (iso) => d(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '');
  const shortDate = (iso) => {
    const x = d(iso);
    return `${x.getDate()} ${x.toLocaleDateString('en-US', { month: 'short' })}, ${x.getFullYear()}`;
  };

  /* ---------- Comments (demo: stored in this browser) ---------- */
  const COMMENTS = 'mc_comments';
  function allComments() {
    try {
      return JSON.parse(localStorage.getItem(COMMENTS) || '{}');
    } catch (e) {
      return {};
    }
  }
  const commentsFor = (id) => allComments()[id] || [];
  function addComment(id, c) {
    const all = allComments();
    (all[id] = all[id] || []).push(c);
    try {
      localStorage.setItem(COMMENTS, JSON.stringify(all));
    } catch (e) {}
  }
  const countLabel = (id) => {
    const n = commentsFor(id).length;
    return `${n} Comment${n === 1 ? '' : 's'}`;
  };

  const ico = (id) => `<svg><use href="#${id}"/></svg>`;
  const metaHTML = (p) => `
    <span class="post-meta-item">${ico('i-calendar')}<time datetime="${p.date}">${longDate(p.date)}</time></span>
    <span class="post-meta-item">${ico('i-user')}${esc(B.author)}</span>
    <span class="post-meta-item" data-comment-count>${ico('i-comment')}${countLabel(p.id)}</span>`;

  /* ---------- Sidebar ---------- */
  function renderSidebar() {
    const box = $('#blogSidebar');
    if (!box) return;
    const active = params.get('tag');
    box.innerHTML = `
      <div class="sb-block sb-cats">
        <div class="sb-cats-title">${ico('i-sort')}<span>Categories</span></div>
        <ul class="sb-cats-list">
          ${B.categories.map((c) => `<li><a href="${c.url}">${esc(c.name)}</a></li>`).join('')}
        </ul>
      </div>

      <form class="sb-block sb-search" action="blog.html" role="search">
        <input type="search" name="q" placeholder="Search" aria-label="Search the blog" value="${esc(params.get('q') || '')}">
        <button type="submit" aria-label="Search">${ico('i-search')}</button>
      </form>

      <div class="sb-block sb-box">
        <p class="sb-title">Recent post</p>
        <div class="sb-recent">
          ${B.posts
            .slice(0, 3)
            .map(
              (p) => `
            <a href="${postUrl(p)}" class="sb-recent-item">
              <span class="sb-recent-img"><img src="${img(p)}" alt="" loading="lazy"></span>
              <span>
                <span class="sb-recent-date">${ico('i-calendar')}${shortDate(p.date)}</span>
                <span class="sb-recent-title">${esc(p.title)}</span>
              </span>
            </a>`
            )
            .join('')}
        </div>
      </div>

      <div class="sb-block sb-box !pb-[30px]">
        <p class="sb-title">Blog tags</p>
        <ul class="sb-tags">
          ${B.tags.map((t) => `<li><a href="blog.html?tag=${encodeURIComponent(t)}" class="${t === active ? 'is-active' : ''}">${esc(t)}</a></li>`).join('')}
        </ul>
      </div>

      <div class="sb-block sb-box">
        <p class="sb-title">Blog banner</p>
        <a href="shop.html" class="sb-banner"><img src="assets/images/blog/sidebar-banner.jpg" alt="Shop the collection" loading="lazy"></a>
      </div>`;
  }

  /* ---------- List page ---------- */
  function renderList() {
    const box = $('#blogList');
    if (!box) return;
    const tag = params.get('tag');
    const q = (params.get('q') || '').trim().toLowerCase();
    let posts = B.posts;
    if (tag) posts = posts.filter((p) => p.tags.includes(tag));
    if (q) posts = posts.filter((p) => p.title.toLowerCase().includes(q));

    const pages = Math.max(1, Math.ceil(posts.length / B.perPage));
    const page = Math.min(pages, Math.max(1, parseInt(params.get('page'), 10) || 1));
    const shown = posts.slice((page - 1) * B.perPage, page * B.perPage);

    const filterNote = tag || q
      ? `<div class="blog-filter">${tag ? `Articles tagged <b>${esc(tag)}</b>` : `Search results for <b>“${esc(params.get('q'))}”</b>`} · ${posts.length} found <a href="blog.html">Clear</a></div>`
      : '';

    if (!shown.length) {
      box.innerHTML = `${filterNote}<div class="blog-none"><p class="text-ink font-bold text-[18px] mb-2">No articles found.</p><p>Try another search or <a href="blog.html" class="underline">see all articles</a>.</p></div>`;
      return;
    }

    box.innerHTML =
      filterNote +
      shown
        .map(
          (p) => `
        <article class="blog-item" data-anim="fade-up">
          <a href="${postUrl(p)}" class="blog-item-img"><img src="${img(p)}" alt="${esc(p.title)}" loading="lazy"></a>
          <h2 class="blog-item-title"><a href="${postUrl(p)}">${esc(p.title)}</a></h2>
          <div class="post-meta">${metaHTML(p)}</div>
          <p class="blog-item-excerpt">${esc(B.excerpt)}</p>
          <a href="${postUrl(p)}" class="btn btn-accent">Read More</a>
        </article>`
        )
        .join('') +
      pagination(page, pages);
  }

  function pageHref(n) {
    const u = new URLSearchParams(params);
    if (n === 1) u.delete('page');
    else u.set('page', n);
    const s = u.toString();
    return 'blog.html' + (s ? '?' + s : '');
  }
  function pagination(page, pages) {
    if (pages < 2) return '';
    let items = '';
    for (let n = 1; n <= pages; n++) {
      items += n === page
        ? `<li><span class="pg-num is-active" aria-current="page">${n}</span></li>`
        : `<li><a class="pg-num" href="${pageHref(n)}">${n}</a></li>`;
    }
    const prev = page > 1 ? `<a class="pg-btn" href="${pageHref(page - 1)}" aria-label="Previous page">${ico('i-chev-l')}</a>` : `<span class="pg-btn is-disabled">${ico('i-chev-l')}</span>`;
    const next = page < pages ? `<a class="pg-btn" href="${pageHref(page + 1)}" aria-label="Next page">${ico('i-chev-r')}</a>` : `<span class="pg-btn is-disabled">${ico('i-chev-r')}</span>`;
    return `<nav class="blog-pagination" aria-label="Pagination"><ul><li class="max-sm:hidden">${prev}</li>${items}<li class="max-sm:hidden">${next}</li></ul></nav>`;
  }

  /* ---------- Article page ---------- */
  function renderPost() {
    const box = $('#postView');
    if (!box) return;
    const i = Math.max(0, B.posts.findIndex((p) => p.id === params.get('post')));
    const p = B.posts[i];
    const prev = B.posts[i + 1]; // older post
    const next = B.posts[i - 1]; // newer post
    const pageUrl = location.href.split('#')[0];
    const enc = encodeURIComponent;

    document.title = `${p.title} – Minicom`;
    $('#postBannerTitle').textContent = p.title;
    $('#postCrumb').textContent = p.title;

    const related = B.posts.filter((x) => x.id !== p.id).slice(0, 6);

    box.innerHTML = `
      <div class="post-thumb"><img src="${img(p)}" alt="${esc(p.title)}"></div>
      <h2 class="post-title">${esc(p.title)}</h2>
      <div class="post-body">${B.body}</div>

      <div class="post-info">
        <div class="post-meta">${metaHTML(p)}</div>
        <div class="post-tools">
          <div class="post-share">
            <button type="button" class="post-tool" aria-expanded="false" data-share-toggle>${ico('i-share-f')}<span>Share</span></button>
            <div class="post-share-menu" hidden>
              <a target="_blank" rel="noopener" href="https://www.facebook.com/sharer.php?u=${enc(pageUrl)}">${ico('i-fb')}Facebook</a>
              <a target="_blank" rel="noopener" href="https://twitter.com/share?text=${enc(p.title)}&url=${enc(pageUrl)}">${ico('i-x')}Tweeter</a>
              <a target="_blank" rel="noopener" href="https://pinterest.com/pin/create/button/?url=${enc(pageUrl)}&description=${enc(p.title)}">${ico('i-pinterest')}Pin it</a>
            </div>
          </div>
          <button type="button" class="post-tool" onclick="window.print()">${ico('i-print')}<span>Print</span></button>
        </div>
      </div>

      <div class="post-nav">
        ${prev ? `<a href="${postUrl(prev)}" class="post-nav-link">${ico('i-arrow-l')}<span>${esc(prev.title)}</span></a>` : '<span></span>'}
        ${next ? `<a href="${postUrl(next)}" class="post-nav-link is-next">${ico('i-arrow-r')}<span>${esc(next.title)}</span></a>` : ''}
      </div>

      <div class="post-related">
        <h3 class="post-related-title">Related News</h3>
        <div class="swiper related-swiper">
          <div class="swiper-wrapper">
            ${related
              .map(
                (r) => `
              <div class="swiper-slide">
                <a href="${postUrl(r)}" class="rel-post-img"><img src="${img(r)}" alt="${esc(r.title)}" loading="lazy"></a>
                <a href="${postUrl(r)}" class="rel-post-title">${esc(r.title)}</a>
                <p class="rel-post-excerpt">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus venenatis ex, et ultr...</p>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </div>

      <div class="post-comments">
        <div id="commentList"></div>
        <form id="commentForm" class="comment-form" novalidate>
          <p class="comment-form-title">Submit comment</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
            <input type="text" name="name" placeholder="Your Name (*)" autocomplete="name" required aria-label="Your name">
            <input type="email" name="email" placeholder="Your Email (*)" autocomplete="email" required aria-label="Your email">
            <input type="tel" name="phone" placeholder="Your Phone (*)" autocomplete="tel" aria-label="Your phone">
          </div>
          <textarea name="body" rows="8" placeholder="Your Message" required aria-label="Your message"></textarea>
          <p class="comment-msg" hidden></p>
          <button type="submit" class="btn btn-accent">Send message</button>
        </form>
      </div>`;

    renderComments(p.id);

    // Share dropdown
    const toggle = box.querySelector('[data-share-toggle]');
    const menu = box.querySelector('.post-share-menu');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
      toggle.setAttribute('aria-expanded', String(!menu.hidden));
    });
    document.addEventListener('click', () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });

    // Comment form
    const form = $('#commentForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.comment-msg');
      const f = Object.fromEntries(new FormData(form));
      const bad = !f.name.trim() ? 'name' : !/^\S+@\S+\.\S+$/.test(f.email) ? 'email' : !f.body.trim() ? 'body' : '';
      form.querySelectorAll('input, textarea').forEach((el) => el.classList.toggle('is-invalid', el.name === bad));
      if (bad) {
        msg.hidden = false;
        msg.className = 'comment-msg is-error';
        msg.textContent = { name: 'Please enter your name.', email: 'Please enter a valid email address.', body: 'Please write a message.' }[bad];
        form.querySelector(`[name="${bad}"]`).focus();
        return;
      }
      addComment(p.id, { name: f.name.trim(), body: f.body.trim(), date: new Date().toISOString().slice(0, 10) });
      form.reset();
      msg.hidden = false;
      msg.className = 'comment-msg';
      msg.textContent = 'Thank you! Your comment has been posted.';
      renderComments(p.id);
    });

    if (window.Swiper) {
      new Swiper('.related-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        breakpoints: { 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 } },
      });
    }
  }

  function renderComments(id) {
    const list = $('#commentList');
    const items = commentsFor(id);
    document.querySelectorAll('[data-comment-count]').forEach((el) => (el.innerHTML = `${ico('i-comment')}${countLabel(id)}`));
    list.innerHTML = items.length
      ? `<p class="comment-form-title">${countLabel(id)}</p>
         <ul class="comment-list">${items
           .map(
             (c) => `
           <li>
             <p class="comment-name">${esc(c.name)} <span>${shortDate(c.date)}</span></p>
             <p>${esc(c.body)}</p>
           </li>`
           )
           .join('')}</ul>`
      : '';
  }

  renderSidebar();
  renderList();
  renderPost();
})();
