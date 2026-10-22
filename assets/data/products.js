/* ==========================================================================
   Shop catalogue: the single source of product data for shop.html.
   Loaded as a plain script (not JSON) so it also works when the page is
   opened from file:// without a server.

   Product fields
     id         image prefix: assets/images/products/{id}-1.webp and -2.webp
     cat / sub  category and subcategory slugs (see `categories`)
     price      selling price; `compare` = original price when on sale
     colors     colour names used by the filter (see `colors`)
     variants   optional colour swatches shown on the card
     materials  material names used by the filter
     inStock    false shows a "Sold out" badge and disables add to cart
     isNew      shows a "New" badge
     added      higher = newer (used by "Newest" sort)
     order      position in the default "Featured" sort
     url        product page; default product.html?id={id}
     photos     number of photos ({id}-1.webp … ; default 2)
   ========================================================================== */
window.MC_SHOP = {
  all: {
    name: 'Shop All',
    intro: 'Discover furniture and decor crafted for modern living: timeless pieces that bring style, comfort and quality to every room.',
    image: 'assets/images/slider/slide-2.webp',
  },

  categories: [
    {
      slug: 'living-room', name: 'Living Room', thumb: 'swivel-sofa',
      intro: 'Sofas, armchairs and tables designed for long evenings and easy weekends.',
      image: 'assets/images/banners/banner-2.webp',
      subs: [
        { slug: 'sofas', name: 'Sofas' },
        { slug: 'armchairs', name: 'Armchairs' },
        { slug: 'coffee-tables', name: 'Coffee Tables' },
        { slug: 'tv-storage', name: 'TV & Storage' },
      ],
    },
    {
      slug: 'bedroom', name: 'Bedroom', thumb: 'bed-frame',
      intro: 'Solid wood beds and bedside storage for a calm, restful space.',
      image: 'assets/images/category/cate-5.webp',
      subs: [
        { slug: 'beds', name: 'Beds' },
        { slug: 'nightstands', name: 'Nightstands' },
      ],
    },
    {
      slug: 'dining-office', name: 'Dining & Office', thumb: 'office-desk',
      intro: 'Chairs and desks that make work and mealtimes more comfortable.',
      image: 'assets/images/banners/banner-1.webp',
      subs: [
        { slug: 'chairs', name: 'Chairs' },
        { slug: 'desks', name: 'Desks' },
      ],
    },
    {
      slug: 'lighting', name: 'Lighting', thumb: 'table-lamp',
      intro: 'Warm, soft light to set the mood in every corner.',
      image: 'assets/images/category/cate-6.webp',
      subs: [{ slug: 'table-lamps', name: 'Table Lamps' }],
    },
    {
      slug: 'decor', name: 'Decor & Plants', thumb: 'small-pot',
      intro: 'Planters, stands and baskets: the finishing touches that make a house a home.',
      image: 'assets/images/category/cate-4.webp',
      subs: [
        { slug: 'plant-pots', name: 'Plant Pots' },
        { slug: 'plant-stands', name: 'Plant Stands' },
        { slug: 'baskets', name: 'Baskets' },
      ],
    },
  ],

  colors: {
    Beige: '#d9c6a5',
    Blue: '#4a6b8a',
    Brown: '#8b5a2b',
    Grey: '#a3a3a3',
    White: '#ffffff',
    Coral: '#ff7f50',
    Teal: '#5f9ea0',
  },

  materials: ['Wood', 'Fabric', 'Ceramic', 'Rattan'],

  promo: {
    eyebrow: 'New collection',
    title: 'Lounge in<br>Scandinavian style',
    button: 'Shop armchairs',
    image: 'assets/images/banners/banner-3.webp',
    cat: 'living-room',
    sub: 'armchairs',
  },

  products: [
    { id: 'sofa-chair', title: 'Modern Single Sofa Chair for Stylish Living Room', cat: 'living-room', sub: 'armchairs', price: 200, colors: ['Blue'], materials: ['Fabric', 'Wood'], inStock: true, added: 23, order: 1, url: 'product.html' },
    { id: 'frame-sofa', title: 'Wooden Frame Sofa Chair with Plush Cushion Seat', cat: 'living-room', sub: 'sofas', price: 270, compare: 280, colors: ['White'], materials: ['Wood', 'Fabric'], inStock: true, added: 12, order: 2 },
    { id: 'lounge-chair', title: 'Modern Wooden Lounge Chair with Wide Fabric Arms', cat: 'living-room', sub: 'armchairs', price: 155, colors: ['Brown'], materials: ['Wood', 'Fabric'], inStock: true, added: 20, order: 3 },
    { id: 'cactus-pot', title: 'Decorative Cactus Plant Pot for Indoor Display', cat: 'decor', sub: 'plant-pots', price: 37, colors: ['White', 'Coral', 'Teal'], variants: ['White', 'Coral', 'Teal'], materials: ['Ceramic'], inStock: true, isNew: true, added: 22, order: 4 },
    { id: 'tv-stand', title: 'Solid Wood TV Stand with Storage Drawers Design', cat: 'living-room', sub: 'tv-storage', price: 135, colors: ['Brown'], materials: ['Wood'], inStock: true, added: 21, order: 5 },
    { id: 'beige-armchair', photos: 5, title: 'Modern Beige Armchair with Wooden Legs', cat: 'living-room', sub: 'armchairs', price: 150, colors: ['Beige'], materials: ['Fabric', 'Wood'], inStock: true, added: 15, order: 6 },
    { id: 'swivel-sofa', title: 'Modern Low Profile Swivel Sofa with Soft Seat', cat: 'living-room', sub: 'sofas', price: 125, colors: ['Grey'], materials: ['Fabric'], inStock: true, added: 19, order: 7 },
    { id: 'bed-frame', title: 'Solid Wood Bed Frame with Classic Vintage Design', cat: 'bedroom', sub: 'beds', price: 300, colors: ['Brown'], materials: ['Wood'], inStock: true, added: 9, order: 8 },
    { id: 'coffee-table', title: 'Round Wooden Coffee Table with Marble Top Design', cat: 'living-room', sub: 'coffee-tables', price: 40, colors: ['Brown'], materials: ['Wood'], inStock: true, added: 17, order: 9 },
    { id: 'table-lamp', title: 'Wooden Base Table Lamp with Fabric Shade Design', cat: 'lighting', sub: 'table-lamps', price: 35, colors: ['Beige'], materials: ['Wood', 'Fabric'], inStock: true, isNew: true, added: 18, order: 10 },
    { id: 'office-desk', title: 'Wooden Office Desk with Drawers Open Storage', cat: 'dining-office', sub: 'desks', price: 140, compare: 145, colors: ['Brown'], materials: ['Wood'], inStock: true, added: 8, order: 11 },
    { id: 'wood-chair', title: 'Premium Solid Wood Chair with Comfortable Design', cat: 'dining-office', sub: 'chairs', price: 79, colors: ['Brown'], materials: ['Wood'], inStock: true, added: 13, order: 12 },
    { id: 'nightstand', title: 'Classic Wooden Nightstand with Dual Storage Drawers', cat: 'bedroom', sub: 'nightstands', price: 99, colors: ['Brown'], materials: ['Wood'], inStock: true, added: 10, order: 13 },
    { id: 'small-pot', title: 'Small Decorative Mini Plant Pot for Home Decor', cat: 'decor', sub: 'plant-pots', price: 37, colors: ['Brown', 'Teal', 'White'], variants: ['Brown', 'Teal', 'White'], materials: ['Ceramic'], inStock: true, added: 16, order: 14 },
    { id: 'basket', title: 'Wooden Basket with Clean Towels for Home Decor', cat: 'decor', sub: 'baskets', price: 25, compare: 30, colors: ['Beige'], materials: ['Rattan'], inStock: true, added: 14, order: 15 },
    { id: 'bedside-cabinet', title: 'Solid Wood Bedside Cabinet with Two Storage Drawers', cat: 'bedroom', sub: 'nightstands', price: 265, colors: ['Brown'], materials: ['Wood'], inStock: false, added: 7, order: 16 },
    { id: 'compact-pot', title: 'Compact Mini Plant Pot for Desk or Shelf Display', cat: 'decor', sub: 'plant-pots', price: 37, colors: ['Grey'], materials: ['Ceramic'], inStock: true, added: 11, order: 17 },
    { id: 'fiber-pot', title: 'Durable Plastic Fiber Plant Pot for Indoor Decor', cat: 'decor', sub: 'plant-pots', price: 78, colors: ['Beige'], materials: ['Rattan'], inStock: true, added: 6, order: 18 },
    { id: 'miniature-pot', title: 'Miniature Plant Pot for Stylish Indoor Decoration', cat: 'decor', sub: 'plant-pots', price: 34, colors: ['White'], materials: ['Ceramic'], inStock: false, added: 5, order: 19 },
    { id: 'plant-stand', title: 'Solid Wood Plant Stand for Indoor Pot Display', cat: 'decor', sub: 'plant-stands', price: 12, colors: ['Brown'], materials: ['Wood'], inStock: true, added: 4, order: 20 },
    { id: 'ceramic-pot', title: 'Mini Ceramic Flower Pot for Desk and Home Decor', cat: 'decor', sub: 'plant-pots', price: 15, colors: ['Beige'], materials: ['Rattan'], inStock: true, added: 3, order: 21 },
  ],
};
