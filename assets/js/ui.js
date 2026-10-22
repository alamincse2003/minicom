/* ==========================================================================
   UI behaviour: marquees, step accordion, featured product, FAQ,
   wishlist / cart counters, popups, newsletter, back-to-top.
   ========================================================================== */
(function () {
  window.MC = window.MC || {};

  /* ---------- Marquees: fill + clone the track for a seamless loop ---------- */
  document.querySelectorAll(".marquee").forEach((marquee) => {
    const track = marquee.querySelector(".marquee-track");
    if (!track) return;
    const items = [...track.children];
    // Width of the actual content (the track itself has min-width:100%)
    const contentWidth = () =>
      track.lastElementChild.getBoundingClientRect().right -
      track.firstElementChild.getBoundingClientRect().left;
    // Repeat items until one track's content is wider than the screen (covers 4K too)
    const target = Math.max(window.innerWidth, screen.width || 0) + 200;
    let guard = 0;
    while (contentWidth() < target && guard++ < 12) {
      items.forEach((el) => track.appendChild(el.cloneNode(true)));
    }
    const clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone
      .querySelectorAll("a, button")
      .forEach((el) => el.setAttribute("tabindex", "-1"));
    marquee.appendChild(clone);
  });

  /* ---------- Step-to-buy accordion (synced with the image slider) ---------- */
  const steps = [...document.querySelectorAll(".step")];
  function setStep(i) {
    steps.forEach((s, n) => s.classList.toggle("active", n === i));
    window.MC.steps?.slideTo(i);
  }
  steps.forEach((step, i) =>
    step.querySelector(".step-head").addEventListener("click", () => setStep(i)),
  );
  if (steps.length) {
    // The reference waits for a click; no auto-advance.
    window.MC.steps?.on("slideChange", (s) => {
      steps.forEach((st, n) =>
        st.classList.toggle("active", n === s.activeIndex),
      );
    });
  }

  /* ---------- Featured product: hover zoom (follows the cursor) ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-zoom]").forEach((box) => {
      const img = box.querySelector("img");
      box.addEventListener("mousemove", (e) => {
        const r = box.getBoundingClientRect();
        img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      });
      box.addEventListener("mouseenter", () => box.classList.add("is-zooming"));
      box.addEventListener("mouseleave", () =>
        box.classList.remove("is-zooming"),
      );
    });
  }

  /* ---------- Featured product: share + ask popups (homepage) ---------- */
  const homeShareUrl = document.querySelector("[data-home-share-url]");
  if (homeShareUrl) {
    const url = location.href.split("#")[0];
    const enc = encodeURIComponent(url);
    homeShareUrl.value = url;
    const links = {
      facebook: `https://www.facebook.com/sharer.php?u=${enc}`,
      x: `https://twitter.com/share?url=${enc}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${enc}`,
    };
    document
      .querySelectorAll("[data-home-share]")
      .forEach((a) => (a.href = links[a.dataset.homeShare]));
    document
      .querySelector("[data-home-copy]")
      ?.addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        try {
          await navigator.clipboard.writeText(url);
        } catch (err) {
          homeShareUrl.select();
          document.execCommand?.("copy");
        }
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy"), 1800);
      });
  }
  document.querySelectorAll("[data-home-form]").forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.reset();
      form.querySelector(".form-msg")?.classList.remove("hidden");
    }),
  );

  /* ---------- Quantity steppers ---------- */
  document.querySelectorAll("[data-qty]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      input.value = Math.max(
        1,
        (parseInt(input.value, 10) || 1) + parseInt(btn.dataset.qty, 10),
      );
    }),
  );

  // Estimated delivery: 5–6 days from today
  const deliveryEl = document.getElementById("deliveryDate");
  if (deliveryEl) {
    const add = (d) => new Date(Date.now() + d * 864e5);
    const a = add(5),
      b = add(6);
    const month = b.toLocaleString("en-US", { month: "short" });
    deliveryEl.textContent = `${a.getDate()} – ${b.getDate()} ${month}, ${b.getFullYear()}`;
  }

  /* ---------- FAQ accordion (one open at a time) ---------- */
  document.querySelectorAll(".faq-head").forEach((head) =>
    head.addEventListener("click", () => {
      const item = head.closest(".faq-item");
      const isOpen = item.classList.contains("open");
      item.parentElement
        .querySelectorAll(".faq-item")
        .forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    }),
  );

  /* ---------- Toast ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(text) {
    if (!toast) return;
    toast.querySelector("[data-toast-text]").textContent = text;
    toast.classList.add("is-open");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-open"), 2200);
  }
  window.MC.toast = showToast;

  /* ---------- Swatches (demo only) ----------
     Delegated so cards rendered later (shop grid) work too.
     [data-wishlist] → assets/js/wishlist.js, [data-add-cart] → assets/js/cart.js */
  document.addEventListener("click", (e) => {
    const sw = e.target.closest(".swatch");
    if (sw) {
      sw.parentElement
        .querySelectorAll(".swatch")
        .forEach((s) => s.classList.remove("active"));
      sw.classList.add("active");
      return;
    }
    // [data-add-cart] is handled by assets/js/cart.js (real cart store)
  });

  /* ---------- Popups ---------- */
  // Lock page scroll behind modal dialogs (not the toast)
  const lockScroll = (on) =>
    (document.body.style.overflow = on ? "hidden" : "");
  function openPopup(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("is-open");
    if (el.matches('[role="dialog"]')) lockScroll(true);
  }
  function closePopup(el) {
    el.classList.remove("is-open");
    if (!document.querySelector('.popup.is-open[role="dialog"]'))
      lockScroll(false);
    if (
      el.id === "newsletterPopup" &&
      document.getElementById("popupDismiss")?.checked
    ) {
      try {
        localStorage.setItem("mc_newsletter_dismissed", "1");
      } catch (e) {}
    }
  }
  document.querySelectorAll("[data-popup-open]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openPopup(btn.dataset.popupOpen);
    }),
  );
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.addEventListener("click", (e) => {
      if (e.target === popup || e.target.closest("[data-popup-close]"))
        closePopup(popup);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
      document.querySelectorAll(".popup.is-open").forEach(closePopup);
  });

  // Newsletter popup after 6s unless dismissed earlier.
  // Disabled on request: the popup markup is commented out in each page.
  // let dismissed = false;
  // try {
  //   dismissed = localStorage.getItem("mc_newsletter_dismissed") === "1";
  // } catch (e) {}
  // if (!dismissed) setTimeout(() => openPopup("newsletterPopup"), 6000);

  /* ---------- Newsletter forms ---------- */
  document.querySelectorAll(".newsletter-form").forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.reset();
      form.parentElement.querySelector(".form-msg")?.classList.remove("hidden");
    }),
  );

  /* ---------- Footer link columns collapse on phones ---------- */
  document.querySelectorAll("[data-ft-toggle]").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 575px)").matches)
        btn.closest(".ft-menu").classList.toggle("open");
    }),
  );

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener(
      "scroll",
      () => toTop.classList.toggle("show", window.scrollY > 600),
      { passive: true },
    );
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }
})();
