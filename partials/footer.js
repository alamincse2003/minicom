/* Shared partial: Site footer.
   Plain HTML inside String.raw`...` — edit it like an .html file.
   (Loaded as a script so pages also work when opened by double-click.) */
window.MC_PARTIALS = window.MC_PARTIALS || {};
window.MC_PARTIALS.footer = String.raw`
<footer class="site-footer text-white">
  <div class="wrap">
    <div class="ft-top">
      <!-- Brand -->
      <div class="ft-brand" data-anim="fade-up">
        <a href="index.html" class="block w-[130px]"><img src="assets/images/misc/logo-light.webp" alt="Minicom" width="262" height="70" loading="lazy"></a>
        <p class="ft-about">At Minicom, we bring style, comfort, and quality to your home with carefully curated furniture collections. Designed for modern living, our pieces blend functionality with timeless aesthetics. Experience exceptional craftsmanship and elevate your space with us!</p>
        <ul class="ft-social">
          <li><a href="#" aria-label="Facebook"><svg><use href="#i-fb"/></svg></a></li>
          <li><a href="#" aria-label="Instagram"><svg><use href="#i-ig"/></svg></a></li>
          <li><a href="#" aria-label="X"><svg><use href="#i-x"/></svg></a></li>
          <li><a href="#" aria-label="TikTok"><svg><use href="#i-tiktok"/></svg></a></li>
        </ul>
      </div>

      <div data-anim="fade-up">
        <!-- Newsletter -->
        <div class="ft-news">
          <div>
            <p class="text-[16px] font-bold uppercase text-white">Subscribe newsletter</p>
            <p class="text-[10px] uppercase text-white">Stay updated with the latest trends</p>
          </div>
          <div>
            <form class="newsletter-form ft-form" action="#">
              <input type="email" required placeholder="Enter your email" aria-label="Email address">
              <button type="submit">Submit</button>
            </form>
            <p class="form-msg hidden mt-3 text-accent text-[13px]">Thanks for subscribing!</p>
          </div>
        </div>

        <!-- Link columns -->
        <div class="ft-menus">
          <div class="ft-menu">
            <button type="button" class="ft-menu-title" data-ft-toggle>Customer care<svg><use href="#i-plus"/></svg></button>
            <ul class="ft-links">
              <li><a href="faq.html">FAQs</a></li>
              <li><a href="terms.html">Terms of Service</a></li>
              <li><a href="privacy.html">Privacy Policy</a></li>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="gift-card.html">Gift Card</a></li>
            </ul>
          </div>
          <div class="ft-menu">
            <button type="button" class="ft-menu-title" data-ft-toggle>Help &amp; support<svg><use href="#i-plus"/></svg></button>
            <ul class="ft-links">
              <li><a href="faq.html">Shipping Info</a></li>
              <li><a href="faq.html">Returns</a></li>
              <li><a href="faq.html">How To Order</a></li>
              <li><a href="faq.html">How To Track</a></li>
              <li><a href="size-guide.html">Size Guide</a></li>
            </ul>
          </div>
          <div class="ft-menu">
            <button type="button" class="ft-menu-title" data-ft-toggle>Company info<svg><use href="#i-plus"/></svg></button>
            <ul class="ft-links">
              <li><a href="about.html">About Us</a></li>
              <li><a href="blog.html">Our Blog</a></li>
              <li><a href="careers.html">Careers</a></li>
              <li><a href="about.html#stores">Store Locations</a></li>
              <li><a href="index.html#testimonials">Testimonial</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="ft-bottom">
    <div class="wrap ft-bottom-row">
      <p>Copyright © 2025 Nova-Creative.<br>All rights reserved.</p>
      <img src="assets/images/misc/payment-footer.webp" alt="Accepted payments" width="277" height="30" loading="lazy">
    </div>
  </div>
</footer>
`;
