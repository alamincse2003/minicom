/* Shared partial: Mobile menu, cart drawer, search, login popup, toast, bottom bar, back-to-top.
   Plain HTML inside String.raw`...` — edit it like an .html file.
   (Loaded as a script so pages also work when opened by double-click.) */
window.MC_PARTIALS = window.MC_PARTIALS || {};
window.MC_PARTIALS.overlays = String.raw`
<div class="overlay fixed inset-0 z-[60] bg-black/50" data-overlay></div>

<!-- Mobile menu drawer -->
<aside id="mobileMenu" class="drawer drawer-left fixed top-0 left-0 z-[70] h-full w-[320px] max-w-[85vw] bg-white overflow-y-auto" aria-label="Mobile menu">
  <div class="flex items-center justify-between p-5 border-b border-line">
    <img src="assets/images/misc/logo-dark.png" alt="Minicom" class="w-[110px]">
    <button data-drawer-close aria-label="Close menu" class="text-ink"><svg class="w-6 h-6"><use href="#i-close"/></svg></button>
  </div>
  <form class="p-5 border-b border-line" action="shop.html" role="search">
    <div class="relative"><input type="search" name="q" placeholder="Enter your keywords" aria-label="Search products" class="w-full h-11 border border-line rounded-[3px] pl-4 pr-10 outline-none focus:border-ink"><svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink"><use href="#i-search"/></svg></div>
  </form>
  <nav class="px-5 py-3 text-ink font-bold uppercase text-[13px]">
    <a href="index.html" data-nav="home" class="block py-3 border-b border-line">Home</a>
    <details class="border-b border-line group"><summary class="flex justify-between items-center py-3 cursor-pointer list-none" data-nav="collections">Collections<svg class="w-4 h-4 transition-transform group-open:rotate-180"><use href="#i-down"/></svg></summary>
      <ul class="pb-3 pl-3 space-y-2 font-normal normal-case text-[14px] text-body"><li><a href="shop.html">Collection left sidebar</a></li><li><a href="shop.html">Collection right sidebar</a></li><li><a href="shop.html">Collection full width</a></li><li><a href="shop.html">Collection deals</a></li></ul></details>
    <details class="border-b border-line group"><summary class="flex justify-between items-center py-3 cursor-pointer list-none" data-nav="products">Products<svg class="w-4 h-4 transition-transform group-open:rotate-180"><use href="#i-down"/></svg></summary>
      <ul class="pb-3 pl-3 space-y-2 font-normal normal-case text-[14px] text-body"><li><a href="product.html">Product detail default</a></li><li><a href="product.html">Product thumb left</a></li><li><a href="product.html">Product image grid</a></li><li><a href="product.html">Product video</a></li></ul></details>
    <details class="border-b border-line group"><summary class="flex justify-between items-center py-3 cursor-pointer list-none" data-nav="pages">Pages<svg class="w-4 h-4 transition-transform group-open:rotate-180"><use href="#i-down"/></svg></summary>
      <ul class="pb-3 pl-3 space-y-2 font-normal normal-case text-[14px] text-body"><li><a href="about.html">About Us</a></li><li><a href="contact.html">Contact Us</a></li><li><a href="faq.html">FAQs Page</a></li><li><a href="about.html#stores">Store Locations</a></li></ul></details>
    <a href="blog.html" data-nav="blog" class="block py-3 border-b border-line">Blog</a>
  </nav>
  <div class="px-5 py-5 text-[14px] space-y-2">
    <p><b class="text-ink">Call Us:</b> +(123)-456-7890</p>
    <p><b class="text-ink">Email:</b> info@example.com</p>
  </div>
</aside>

<!-- Cart drawer -->
<aside id="cartDrawer" class="drawer drawer-right fixed top-0 right-0 z-[70] h-full w-[400px] max-w-[90vw] bg-white flex flex-col" aria-label="Cart">
  <div class="flex items-center justify-between p-6 border-b border-line">
    <h3 class="text-[16px] font-bold uppercase text-ink">My Cart <span class="text-muted">(<span data-cart-count>0</span> items)</span></h3>
    <button data-drawer-close aria-label="Close cart" class="text-ink"><svg class="w-6 h-6"><use href="#i-close"/></svg></button>
  </div>
  <!-- Lines are rendered by assets/js/cart.js -->
  <div class="flex-1 overflow-y-auto" data-mini-cart></div>
  <div class="border-t border-line p-6 bg-soft" data-mini-cart-foot hidden>
    <div class="flex items-center justify-between mb-4">
      <span class="text-[14px] font-bold uppercase text-ink">Subtotal:</span>
      <span class="text-[20px] font-extrabold text-ink" data-mini-subtotal>$0.00</span>
    </div>
    <div class="mb-5" data-mini-shipping></div>
    <div class="grid grid-cols-2 gap-2.5">
      <a href="cart.html" class="btn btn-light !border-ink w-full">View cart</a>
      <a href="checkout.html" class="btn btn-accent w-full">Check out</a>
    </div>
  </div>
</aside>

<!-- Search overlay (mobile) -->
<div id="searchOverlay" class="popup fixed inset-0 z-[80] bg-white flex flex-col">
  <div class="wrap flex items-center gap-4 h-[80px] border-b border-line">
    <svg class="w-6 h-6 text-ink"><use href="#i-search"/></svg>
    <form action="shop.html" role="search" class="flex-1 h-full"><input type="search" name="q" placeholder="Enter your keywords" aria-label="Search products" class="w-full h-full outline-none text-[18px] text-ink"></form>
    <button data-popup-close aria-label="Close search" class="text-ink"><svg class="w-6 h-6"><use href="#i-close"/></svg></button>
  </div>
  <div class="wrap py-6">
    <p class="text-[13px] font-bold uppercase text-ink mb-3">Search Trending:</p>
    <div class="flex flex-wrap gap-2 text-[14px]"><a href="shop.html?q=plant" class="px-4 py-1.5 bg-soft rounded-full hover:bg-accent">Plant</a><a href="shop.html?q=sofa" class="px-4 py-1.5 bg-soft rounded-full hover:bg-accent">Sofa</a><a href="shop.html?q=basket" class="px-4 py-1.5 bg-soft rounded-full hover:bg-accent">Basket</a><a href="shop.html?q=chair" class="px-4 py-1.5 bg-soft rounded-full hover:bg-accent">Chair</a></div>
  </div>
</div>

<!-- Newsletter popup: disabled on request. Remove this comment wrapper and re-enable the timer in assets/js/ui.js to bring it back.
<div id="newsletterPopup" class="popup fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Newsletter">
  <div class="popup-box relative w-full max-w-[800px] bg-white rounded-[10px] overflow-hidden grid md:grid-cols-2">
    <button data-popup-close class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center text-ink hover:bg-accent transition-colors" aria-label="Close"><svg class="w-5 h-5"><use href="#i-close"/></svg></button>
    <img src="assets/images/misc/newsletter.jpg" alt="" class="hidden md:block w-full h-full object-cover" loading="lazy">
    <div class="p-8 md:p-10 flex flex-col justify-center">
      <h3 class="text-[20px] md:text-[24px] font-extrabold uppercase text-ink leading-tight">Subscrible &amp; get <span class="text-accent">15% discount</span></h3>
      <p class="mt-3 mb-6">Sign up for newsletter to receive special offers and exclusive news about products</p>
      <form class="newsletter-form flex flex-col gap-2.5" action="#">
        <input type="email" required placeholder="Your email address" class="h-[50px] px-4 border border-line rounded-[3px] outline-none focus:border-ink" aria-label="Email">
        <button type="submit" class="btn btn-accent w-full">Submit</button>
      </form>
      <p class="form-msg hidden mt-3 text-stock text-[13px]">Thanks for subscribing!</p>
      <label class="mt-5 flex items-center gap-2 text-[13px] cursor-pointer"><input type="checkbox" id="popupDismiss" class="accent-black"> Don't show this popup again</label>
    </div>
  </div>
</div>
-->

<!-- Login popup -->
<div id="loginPopup" class="popup fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Login">
  <div class="popup-box relative w-full max-w-[440px] bg-white rounded-[10px] p-8 md:p-10">
    <button data-popup-close class="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-ink hover:bg-accent transition-colors" aria-label="Close"><svg class="w-5 h-5"><use href="#i-close"/></svg></button>
    <h3 class="text-[20px] font-bold uppercase text-ink">Login</h3>
    <p class="mt-1 mb-6 text-[13px]">Insert your account information:</p>
    <form class="space-y-3" action="#">
      <input type="email" autocomplete="email" placeholder="Email address" class="w-full h-[50px] px-4 border border-line rounded-[3px] outline-none focus:border-ink" aria-label="Email address">
      <input type="password" autocomplete="current-password" placeholder="Password" class="w-full h-[50px] px-4 border border-line rounded-[3px] outline-none focus:border-ink" aria-label="Password">
      <a href="account.html#recover" class="block text-[13px] text-right hover:text-accent">Forgot your password?</a>
      <button type="submit" class="btn btn-dark w-full">Login</button>
      <a href="account.html#register" class="btn btn-accent w-full">Create your account</a>
    </form>
  </div>
</div>

<!-- Toast -->
<div id="toast" class="popup fixed left-1/2 -translate-x-1/2 bottom-24 lg:bottom-8 z-[95] bg-black text-white text-[13px] px-5 py-3 rounded-[5px] flex items-center gap-2 shadow-xl"><svg class="w-4 h-4 text-accent"><use href="#i-check"/></svg><span data-toast-text>Added to cart</span></div>

<!-- Mobile bottom bar -->
<nav class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line grid grid-cols-4 h-[60px] text-[11px] font-medium text-ink" aria-label="Quick links">
  <a href="index.html" class="flex flex-col items-center justify-center gap-1"><svg class="w-5 h-5"><use href="#i-home"/></svg>Home</a>
  <a href="shop.html" class="flex flex-col items-center justify-center gap-1"><svg class="w-5 h-5"><use href="#i-grid"/></svg>Shopping</a>
  <a href="wishlist.html" class="relative flex flex-col items-center justify-center gap-1"><svg class="w-5 h-5"><use href="#i-heart"/></svg>Wishlist<span class="absolute top-1.5 left-1/2 ml-1.5 min-w-4 h-4 px-1 rounded-full bg-accent text-[9px] font-bold leading-4 text-center" data-wishlist-count>0</span></a>
  <a href="account.html" class="flex flex-col items-center justify-center gap-1"><svg class="w-5 h-5"><use href="#i-user"/></svg>Account</a>
</nav>

<!-- Back to top -->
<button id="toTop" class="to-top fixed right-5 bottom-20 lg:bottom-8 z-40 w-11 h-11 rounded-full bg-accent text-ink flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-colors" aria-label="Back to top"><svg class="w-5 h-5"><use href="#i-up"/></svg></button>
`;
