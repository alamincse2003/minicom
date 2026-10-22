/* ==========================================================================
   Blog posts: single source for blog.html, blog-post.html and the sidebar.
   Edit or add posts here. `image` → assets/images/blog/blog-{image}.jpg
   Open a post with blog-post.html?post={id}
   ========================================================================== */
window.MC_BLOG = {
  name: 'News',
  perPage: 3,

  // Sidebar "Categories" → shop collections
  categories: [
    { name: 'Home Decor', url: 'shop.html?cat=decor' },
    { name: 'Bedroom', url: 'shop.html?cat=bedroom' },
    { name: 'Outdoor', url: 'shop.html' },
    { name: 'Tables & Desks', url: 'shop.html?cat=dining-office' },
    { name: 'Plant Pots', url: 'shop.html?cat=decor&sub=plant-pots' },
    { name: 'Dining Room', url: 'shop.html?cat=dining-office' },
    { name: 'Living Room', url: 'shop.html?cat=living-room' },
  ],

  tags: ['Bedroom', 'Desks', 'Kitchen', 'Livingroom', 'Plant', 'Tables'],

  posts: [
    { id: 'a-guide-to-mixing-wood-tones-in-your-living-space', title: 'A Guide to Mixing Wood Tones in Your Living Space', image: 1, date: '2025-06-19', tags: ['Livingroom', 'Tables'] },
    { id: 'revamping-your-living-room-with-vintage-decor', title: 'Revamping Your Living Room with Vintage Decor', image: 2, date: '2025-06-19', tags: ['Livingroom'] },
    { id: 'simple-ways-to-add-character-to-minimalist-interiors', title: 'Simple Ways to Add Character to Minimalist Interiors', image: 3, date: '2025-06-19', tags: ['Bedroom', 'Plant'] },
    { id: 'top-trends-in-home-office-design-for-2025', title: 'Top Trends in Home Office Design for 2025', image: 4, date: '2025-06-19', tags: ['Desks', 'Tables'] },
    { id: 'a-beginners-guide-to-japandi-interior-style', title: 'A Beginner’s Guide to Japandi Interior Style', image: 5, date: '2025-06-19', tags: ['Livingroom', 'Bedroom'] },
    { id: 'designing-a-cozy-reading-nook-in-small-spaces', title: 'Designing a Cozy Reading Nook in Small Spaces', image: 6, date: '2025-06-19', tags: ['Bedroom'] },
    { id: 'how-to-choose-sustainable-lighting-for-a-greener-home', title: 'How to Choose Sustainable Lighting for a Greener Home', image: 7, date: '2025-06-19', tags: ['Kitchen', 'Livingroom'] },
    { id: 'the-power-of-plants-bringing-nature-indoors', title: 'The Power of Plants: Bringing Nature Indoors', image: 8, date: '2025-06-19', tags: ['Plant'] },
  ],

  author: 'Vinova Theme',

  // Demo article text (same placeholder copy as the reference theme)
  excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus venenatis ex, et ultricies nunc molestie ut. Nullam accumsan id nisi vel convallis. Sed dui risus, ullamcorper vitae aliquet vitae, feugiat in neque. Praesent egestas ligula velit, sed malesuada erat interdum vitae. Aliquam pretium nisi sed turpis posuere pharetra. Suspe...',
  body: `
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus faucibus venenatis ex, et ultricies nunc molestie ut. Nullam accumsan id nisi vel convallis. Sed dui risus, ullamcorper vitae aliquet vitae, feugiat in neque. Praesent egestas ligula velit, sed malesuada erat interdum vitae. Aliquam pretium nisi sed turpis posuere pharetra. Suspendisse faucibus, sem at egestas viverra, erat velit luctus mi, placerat vulputate dui eros a diam. Aliquam facilisis ut massa et gravida. Morbi sed ipsum magna. Nulla elementum finibus dolor pretium condimentum.</p>
    <blockquote><p>Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc gravida diam ac convallis rutrum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at eros diam. Vivamus a pretium orci. Ut sollicitudin posuere libero vitae rhoncus.</p></blockquote>
    <p>Maecenas ultrices, purus ac fermentum tincidunt, nunc leo sagittis erat, vel volutpat dolor justo id lacus. Quisque feugiat imperdiet laoreet. Nunc eget dui ut metus rhoncus volutpat. Morbi luctus tristique lobortis. In mi erat, condimentum eu elementum sit amet, facilisis pellentesque velit. Aenean at est a mauris fermentum luctus. Aliquam erat volutpat. Aliquam eget vehicula purus. Integer pretium egestas metus sed rutrum.</p>
    <div class="post-gallery">
      <img src="assets/images/blog/post-img-1.jpg" alt="" loading="lazy">
      <img src="assets/images/blog/post-img-2.jpg" alt="" loading="lazy">
    </div>
    <p>Nullam quis felis ultricies, vehicula magna ac, sodales elit. Suspendisse mi massa, porttitor at pharetra sit amet, faucibus eget diam. Ut nec erat tellus. Vestibulum lobortis mi a dui maximus, et eleifend augue volutpat. In tincidunt nisl a interdum facilisis. Vivamus nec tempus turpis. Nullam volutpat massa sed neque cursus porta. Integer non metus consequat, dignissim justo iaculis, venenatis sem. Phasellus imperdiet facilisis felis a fermentum.</p>
    <p>Suspendisse sit amet ex eu dui pretium laoreet sit amet sit amet nulla. Morbi ut leo ac nibh cursus cursus. In in elit urna. Quisque commodo vestibulum purus sed volutpat. Praesent quis tellus ac nulla rutrum sagittis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean eget volutpat justo. Quisque nec ex tortor. Integer a felis aliquet, mollis orci id, porttitor sapien. Nulla arcu ipsum, sollicitudin et faucibus eu, efficitur in metus. Nunc pharetra arcu arcu, et porttitor massa varius eget. Morbi nisi turpis, gravida a ligula id, volutpat placerat nulla. Sed ut mi at odio commodo rhoncus et id arcu. Ut ultrices lacinia neque ac feugiat. Suspendisse elementum non nibh in tempor. Vivamus convallis augue a malesuada ullamcorper.</p>`,
};
