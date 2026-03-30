require("dotenv").config();

const { db, admin } = require("./src/config/firebase");

const CATEGORY_IDS = {
  concealer: "concealer",
  foundation: "foundation",
  lipstick: "lipstick",
  mascara: "mascara",
  skincare: "skincare",
};

const SHADES = [
  "lt-01", "lt-02", "lt-03", "lt-04",
  "lm-01", "lm-02", "lm-03", "lm-04",
  "md-01", "md-02", "d-03", "md-4",
  "mt-01", "mt-02", "mt03", "mt04",
  "mdp-01", "mdp-02", "mdp-03", "mdp-4",
  "dp-01", "dp-02", "dp-03", "dp-04",
];

const ALL_SKIN_TYPES = ["normal", "oily", "dry"];
const NO_SKIN_TYPE = ["-"];

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = {
  pending: "pending",
  processing: "paid",
  shipped: "paid",
  delivered: "paid",
  cancelled: "failed",
};


const COLLECTIONS_TO_DELETE = [
  "reviews",
  "orders",
  "carts",
  "products",
  "categories",
  "users",
  "test",
];

const categories = [
  {
    id: CATEGORY_IDS.concealer,
    name: "Concealer",
    slug: "concealer",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
  },
  {
    id: CATEGORY_IDS.foundation,
    name: "Foundation",
    slug: "foundation",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: CATEGORY_IDS.lipstick,
    name: "Lipstick",
    slug: "lipstick",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
  },
  {
    id: CATEGORY_IDS.mascara,
    name: "Mascara",
    slug: "mascara",
    image: "https://images.unsplash.com/photo-1631214540242-6f5c8f0db3d8",
  },
  {
    id: CATEGORY_IDS.skincare,
    name: "Skincare",
    slug: "skincare",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
  },
];

const users = [
  {
    email: "admin@gmail.com",
    password: "123456",
    fullName: "Admin User",
    phone: "0711111111",
    role: "admin",
  },
  {
    email: "client@gmail.com",
    password: "123456",
    fullName: "Main Client",
    phone: "0722222222",
    role: "customer",
  },
  {
    email: "emma.wilson@gmail.com",
    password: "123456",
    fullName: "Emma Wilson",
    phone: "0730000001",
    role: "customer",
  },
  {
    email: "olivia.smith@gmail.com",
    password: "123456",
    fullName: "Olivia Smith",
    phone: "0730000002",
    role: "customer",
  },
  {
    email: "ava.johnson@gmail.com",
    password: "123456",
    fullName: "Ava Johnson",
    phone: "0730000003",
    role: "customer",
  },
  {
    email: "mia.brown@gmail.com",
    password: "123456",
    fullName: "Mia Brown",
    phone: "0730000004",
    role: "customer",
  },
  {
    email: "sophia.davis@gmail.com",
    password: "123456",
    fullName: "Sophia Davis",
    phone: "0730000005",
    role: "customer",
  },
];

function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany(arr, count) {
  const copy = [...arr];
  const picked = [];

  while (picked.length < count && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(index, 1)[0]);
  }

  return picked;
}

function rotateShades(start, count) {
  const result = [];
  for (let i = 0; i < count; i += 1) {
    result.push(SHADES[(start + i) % SHADES.length]);
  }
  return result;
}

function buildLongDescription({
  name,
  brand,
  type,
  benefits,
  ingredients,
  usage,
  finish,
  skinType,
}) {
  return `${name} by ${brand} is a premium ${type} product created for users who want a reliable formula, comfortable wear, and a polished final result. This product is designed to fit naturally into a daily beauty routine while still offering the performance expected from a modern makeup and skincare selection. The texture is developed to apply smoothly, distribute evenly, and support a refined appearance without feeling unnecessarily heavy when used correctly.

Key benefits: ${benefits}. The formula is built to help improve the visible look of the skin, lips, or lashes depending on the category, while also giving a more even, balanced, and flattering finish. Whether used for everyday wear or for a more complete beauty routine, it aims to deliver consistency, comfort, and a visually polished result.

Ingredients and formula notes: ${ingredients}. These components are selected to support cosmetic performance, texture stability, ease of blending, and a pleasant feel during application and wear. In products designed for complexion use, the formula may help create a smoother-looking surface and a more uniform tone. In color cosmetics, the structure is intended to support color payoff, adherence, and a more elegant finish throughout the day.

How to use: ${usage}. Apply on clean and properly prepared skin, lips, or lashes depending on the product type. Layer gradually for the best control over intensity and finish. For complexion products, start from the center of the face and blend outward. For lip products, apply directly or with a lip brush for precision. For mascara, begin at the base of the lashes and sweep upward. For skincare, use on freshly cleansed skin and follow with the rest of your routine if needed.

Finish: ${finish || "-"}. Skin type suitability: ${Array.isArray(skinType) && skinType.length ? skinType.join(", ") : "-"}. Store at room temperature away from direct sunlight and excessive heat. Patch testing is recommended for sensitive skin.`;
}

function product({
  name,
  brand,
  categoryId,
  price,
  stock,
  featured,
  discountPercent = 0,
  shades = [],
  finish = "",
  skinType = NO_SKIN_TYPE,
  images = [],
  benefits,
  ingredients,
  usage,
}) {
  const slug = slugify(name);

  return {
    id: slug,
    name,
    slug,
    brand,
    categoryId,
    description: buildLongDescription({
      name,
      brand,
      type: categoryId,
      benefits,
      ingredients,
      usage,
      finish,
      skinType,
    }),
    price,
    currency: "RON",
    stock,
    images,
    featured,
    discountPercent,
    shades,
    finish,
    skinType,
    isActive: true,
    averageRating: 0,
    reviewsCount: 0,
  };
}

/*
  IMPORTANT:
  Replace the image URLs below with the exact direct image links you want.
  Each array already has 3 image slots because your frontend expects 3 images.
*/

const products = [
  // CONCEALER (5)
  product({
    name: "Maybelline Instant Anti-Age Eraser Concealer",
    brand: "Maybelline",
    categoryId: CATEGORY_IDS.concealer,
    price: 49.99,
    stock: 70,
    featured: true,
    shades: rotateShades(0, 6),
    finish: "natural",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://s13emagst.akamaized.net/products/5770/5769178/images/res_93687271d01a74f855bd2599090a7db4.jpg",
      "https://licilasicdn.s3.amazonaws.com/public/product_images/43813/gallery/original/348938277.jpg",
    ],
    benefits: "medium to high coverage, smoother-looking under-eyes, soft brightening, and quick correction of visible imperfections",
    ingredients: "glycerin, water, emollients, smoothing agents, and finely dispersed pigments",
    usage: "apply a small amount under the eyes or over imperfections and blend gently with fingertips, a sponge, or a brush until seamless",
  }),
  product({
    name: "L'Oréal Paris Infaillible More Than Concealer",
    brand: "L'Oréal Paris",
    categoryId: CATEGORY_IDS.concealer,
    price: 56.99,
    stock: 65,
    featured: true,
    shades: rotateShades(2, 6),
    finish: "matte",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPsWj31XX-D_lUs4fY6FgxTCZt13ua1uWDYw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1ANxDdRyqQdGryasdJSAoV34dUAQuAfB63Q&s",
     
    ],
    benefits: "high coverage, long wear, efficient spot correction, and a smooth matte look",
    ingredients: "silica, glycerin, film-forming agents, emollients, and color pigments",
    usage: "apply only where needed and blend immediately after application for the smoothest finish",
  }),
  product({
    name: "NYX Bare With Me Concealer Serum",
    brand: "NYX",
    categoryId: CATEGORY_IDS.concealer,
    price: 55,
    stock: 50,
    featured: false,
    shades: rotateShades(4, 6),
    finish: "natural",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://media.douglas.ro/ro/media/68/b9/9c/1663966991/800897129767_2.jpg",
      "https://i5.walmartimages.com/seo/NYX-Professional-Makeup-Bare-With-Me-Concealer-Serum-Medium-Coverage-Beige-0-32-fl-oz_4ad4b4d7-d222-4930-8902-5c2b9660b1fd.a42a92f9548fd71010e4fb7a9c124312.jpeg",
      "https://www.nyxcosmetics.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-cpd-nyxusa-master-catalog/default/dw683ed349/ProductImages/2021/Face/BARE-WITH-ME-CONCEALER-SERUM/BWMCCS-HERO/202201XX-DMI-ERetail-ATF-Swatch-11-BWMCCS.jpg",
    ],
    benefits: "hydrating wear, medium coverage, a skin-like finish, and a fresh under-eye appearance",
    ingredients: "humectants, soothing ingredients, water, emollients, and lightweight pigments",
    usage: "dispense a small amount and blend over dark circles, redness, or blemishes for a natural corrected look",
  }),
  product({
    name: "e.l.f. Hydrating Camo Concealer",
    brand: "e.l.f.",
    categoryId: CATEGORY_IDS.concealer,
    price: 42.9,
    stock: 80,
    featured: false,
    shades: rotateShades(6, 6),
    finish: "satin",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://s13emagst.akamaized.net/products/82464/82463642/images/res_8702ff8eccbd047c6ee6a6197f2c7efe.jpg",
      "https://assets.kmart.com.au/transform/0552b0be-dc43-43a7-a6e8-26e1ca73fcbf/43014873-1?io=transform:fit,width:3840,height:4800&quality=90",
    ],
    benefits: "comfortable wear, good coverage, balanced hydration, and a smoother-looking skin texture",
    ingredients: "squalane, glycerin, emollients, water, and pigment dispersions",
    usage: "dot under the eyes or over uneven areas and blend before the product sets fully",
  }),
  product({
    name: "Catrice True Skin High Cover Concealer",
    brand: "Catrice",
    categoryId: CATEGORY_IDS.concealer,
    price: 31.99,
    stock: 75,
    featured: false,
    shades: rotateShades(8, 6),
    finish: "natural",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://s13emagst.akamaized.net/products/40573/40572120/images/res_7c0df68907f58fa241c5e2baba24a835.jpg",
      "https://media.farmaciatei.ro/gallery/96853/corector-warm-macadamia-005-true-skin-high-cover-4-5-ml-catrice-9609.jpg",
    ],
    benefits: "high correction, even application, flexible wear, and a natural-looking result",
    ingredients: "hyaluronic acid, glycerin, water, emollients, and soft-focus pigments",
    usage: "apply to target areas using the applicator and pat gently until fully blended",
  }),

  // FOUNDATION (15)
  product({
    name: "Maybelline Fit Me Matte + Poreless Foundation",
    brand: "Maybelline",
    categoryId: CATEGORY_IDS.foundation,
    price: 49.99,
    stock: 120,
    featured: true,
    discountPercent: 10,
    shades: rotateShades(0, 8),
    finish: "matte",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://i5.walmartimages.com/seo/Maybelline-Fit-Me-Matte-Poreless-Liquid-Foundation-Makeup-Creamy-Beige-1-fl-oz_91c75de6-d88b-4c97-9501-dcc94c88ce06.67729f548742c34f5c3c8d9e563d22c9.jpeg",
    
    ],
    benefits: "medium buildable coverage, a matte finish, a smoother pore-blurring look, and better oil control throughout the day",
    ingredients: "water, silica, pigments, emollients, and texture-balancing agents",
    usage: "apply from the center of the face and blend outward with a sponge, brush, or fingertips for even coverage",
  }),
  product({
    name: "L'Oréal Paris True Match Foundation",
    brand: "L'Oréal Paris",
    categoryId: CATEGORY_IDS.foundation,
    price: 67.5,
    stock: 100,
    featured: true,
    shades: rotateShades(2, 8),
    finish: "natural",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://licilasicdn.s3.amazonaws.com/public/product_images/43692/main/original.jpg",
 
    ],
    benefits: "natural-looking coverage, smooth blending, a lightweight feel, and a skin-like finish suitable for daily wear",
    ingredients: "hyaluronic acid, glycerin, water, pigments, and lightweight smoothing agents",
    usage: "shake well, apply a moderate amount to clean skin, and blend gradually for the desired level of coverage",
  }),
  product({
    name: "Estée Lauder Double Wear Stay-in-Place Foundation",
    brand: "Estée Lauder",
    categoryId: CATEGORY_IDS.foundation,
    price: 239.99,
    stock: 60,
    featured: true,
    shades: rotateShades(4, 8),
    finish: "matte",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://www.bb-shop.ro/_files/galerie_foto/cosmetice/11/10216/800_cosm_10216.jpg",
    ],
    benefits: "long wear, consistent coverage, better shine control, and a polished complexion for many hours",
    ingredients: "pigments, water, emollients, film-forming agents, and complexion-smoothing ingredients",
    usage: "apply in thin sections and blend quickly for the most even and controlled long-wear finish",
  }),
  product({
    name: "Fenty Beauty Pro Filt'r Soft Matte Longwear Foundation",
    brand: "Fenty Beauty",
    categoryId: CATEGORY_IDS.foundation,
    price: 214.99,
    stock: 70,
    featured: true,
    shades: rotateShades(6, 8),
    finish: "soft matte",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://media.sephora.eu/content/dam/digital/pim/published/F/FENTY_BEAUTY/P3079040/16670-media_principal.jpg?scaleWidth=585&scaleHeight=585&scaleMode=fit",

    ],
    benefits: "soft matte coverage, an even-looking complexion, lightweight wear, and a refined modern finish",
    ingredients: "finely milled pigments, water, oil-balancing agents, and flexible texture enhancers",
    usage: "start with a small amount and build coverage only where needed for the most flattering result",
  }),
  product({
    name: "NARS Natural Radiant Longwear Foundation",
    brand: "NARS",
    categoryId: CATEGORY_IDS.foundation,
    price: 235,
    stock: 55,
    featured: false,
    shades: rotateShades(8, 8),
    finish: "radiant",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://media.sephora.eu/content/dam/digital/pim/published/N/NARS/429552/34628-media_swatch.jpg?scaleWidth=265&scaleHeight=265&scaleMode=fit",
    ],
    benefits: "radiant medium coverage, a healthier-looking complexion, long wear, and a smoother visible skin texture",
    ingredients: "emollients, pigments, water, and long-wear adhesion ingredients",
    usage: "apply after moisturizer or primer and blend evenly for a luminous but polished finish",
  }),
  product({
    name: "MAC Studio Fix Fluid SPF 15 Foundation",
    brand: "MAC",
    categoryId: CATEGORY_IDS.foundation,
    price: 199.99,
    stock: 80,
    featured: false,
    shades: rotateShades(10, 8),
    finish: "matte",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://i.makeup.ro/6/6c/6ceyuqjj11wn.jpg",
  
    ],
    benefits: "medium to high coverage, a professional-looking finish, smoother skin appearance, and strong wear performance",
    ingredients: "pigments, water, emollients, silica, and film-forming agents",
    usage: "apply a thin layer all over the face and add more only where greater coverage is required",
  }),
  product({
    name: "Dior Backstage Face & Body Foundation",
    brand: "Dior",
    categoryId: CATEGORY_IDS.foundation,
    price: 225.99,
    stock: 50,
    featured: false,
    shades: rotateShades(12, 8),
    finish: "natural",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://i.makeup.ro/t/th/thjrjg9zunso.jpg",
    ],
    benefits: "natural coverage, flexible application, a lighter feel, and a smooth realistic complexion",
    ingredients: "water, pigments, emollients, and balancing texture agents",
    usage: "apply in thin layers with a brush or sponge and build gradually for a natural-looking result",
  }),
  product({
    name: "Catrice HD Liquid Coverage Foundation",
    brand: "Catrice",
    categoryId: CATEGORY_IDS.foundation,
    price: 39.99,
    stock: 95,
    featured: false,
    shades: rotateShades(14, 8),
    finish: "matte",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://static.beautytocare.com/media/catalog/product/c/a/catrice-hd-liquid-coverage-foundation-010-light-beige-30ml_1.jpg",
    ],
    benefits: "good coverage, lightweight feel, smoother visible texture, and a more perfected complexion",
    ingredients: "water, silica, pigments, glycerin, and texture-stabilizing agents",
    usage: "use a small amount and blend evenly to avoid applying more product than necessary",
  }),
  product({
    name: "Bourjois Healthy Mix Foundation",
    brand: "Bourjois",
    categoryId: CATEGORY_IDS.foundation,
    price: 62.99,
    stock: 85,
    featured: false,
    shades: rotateShades(16, 8),
    finish: "radiant",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbCYATjansLeojnAbVxuo8bcgiJynGjo5W-w&s",

    ],
    benefits: "fresh-looking radiance, even coverage, a healthy complexion effect, and comfortable wear",
    ingredients: "vitamin-enriched components, water, pigments, humectants, and emollients",
    usage: "spread over moisturized skin and blend especially well around the center of the face",
  }),
  product({
    name: "Revlon ColorStay Foundation",
    brand: "Revlon",
    categoryId: CATEGORY_IDS.foundation,
    price: 67.5,
    stock: 78,
    featured: false,
    shades: rotateShades(18, 8),
    finish: "semi-matte",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://c.cdnmp.net/239505480/p/l/8/fond-de-ten-revlon-colorstay-combination-oily-skin-pentru-ten-gras~79218.jpg",

    ],
    benefits: "reliable wear, balanced coverage, a smoother complexion, and a polished finish",
    ingredients: "color pigments, water, silica, emollients, and binding agents",
    usage: "apply gradually and blend well around the jawline and hairline for a seamless match",
  }),
  product({
    name: "Clinique Even Better Makeup SPF 15",
    brand: "Clinique",
    categoryId: CATEGORY_IDS.foundation,
    price: 189.99,
    stock: 58,
    featured: false,
    shades: rotateShades(20, 8),
    finish: "natural",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://sdcdn.io/cl/cl_sku_6MNY25_2400x2400_0.jpg",
    ],
    benefits: "comfortable natural coverage, a cleaner-looking complexion, and an easy daily-wear finish",
    ingredients: "glycerin, filters, water, pigments, and conditioning ingredients",
    usage: "apply to prepared skin and blend evenly until the product melts into the complexion",
  }),

  product({
    name: "Huda Beauty #FauxFilter Foundation",
    brand: "Huda Beauty",
    categoryId: CATEGORY_IDS.foundation,
    price: 215.99,
    stock: 48,
    featured: false,
    shades: rotateShades(3, 8),
    finish: "full coverage",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://cdn.notinoimg.com/social/huda_beauty/6291106035285_01-o/faux-filter-foundation___230331.jpg",
  
    ],
    benefits: "fuller coverage, a perfected complexion effect, stronger evening of tone, and a more glamorous finish",
    ingredients: "high-performance pigments, emollients, water, and long-wear texture components",
    usage: "use a small controlled amount and blend carefully to control the level of coverage",
  }),
  product({
    name: "Sephora Best Skin Ever Foundation",
    brand: "Sephora Collection",
    categoryId: CATEGORY_IDS.foundation,
    price: 99.99,
    stock: 77,
    featured: false,
    shades: rotateShades(5, 8),
    finish: "natural",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://media.sephora.eu/content/dam/digital/pim/published/S/SEPHORA_COLLECTION/502331/161795-media_swatch.jpg?scaleWidth=265&scaleHeight=265&scaleMode=fit",

    ],
    benefits: "smooth-looking skin, a healthy finish, easy blendability, and buildable coverage",
    ingredients: "pigments, glycerin, water, and skin-conditioning agents",
    usage: "apply after moisturizer and blend in soft motions until fully even",
  }),
  product({
    name: "Rimmel Lasting Finish Foundation",
    brand: "Rimmel London",
    categoryId: CATEGORY_IDS.foundation,
    price: 45.99,
    stock: 88,
    featured: false,
    shades: rotateShades(7, 8),
    finish: "natural",
    skinType: ALL_SKIN_TYPES,
    images: [
      "https://s13emagst.akamaized.net/products/34147/34146104/images/res_bd6b1b1f13e247f8e6afde9ade92d800.jpeg",

    ],
    benefits: "comfortable medium coverage, a balanced natural finish, and easy daily application",
    ingredients: "water, pigments, silica, emollients, and stabilizing texture ingredients",
    usage: "apply in small dots and blend outward from the center of the face",
  }),

  // LIPSTICK (5)
  product({
    name: "MAC Matte Lipstick Ruby Woo",
    brand: "MAC",
    categoryId: CATEGORY_IDS.lipstick,
    price: 119.99,
    stock: 40,
    featured: true,
    shades: ["lt-01"],
    finish: "matte",
    skinType: NO_SKIN_TYPE,
    images: [
      "https://s13emagst.akamaized.net/products/28054/28053858/images/res_6eec5bb2e36a96fceda458cff0ca4aec.jpg",
      "https://static.beautytocare.com/cdn-cgi/image/f=auto/media/catalog/product//m/-/m-a-c-cosmetics-m-a-cximal-matte-lipstick-691-ruby-woo-3-5g-2.jpg",
  
    ],
    benefits: "strong color payoff, a classic matte finish, good lip definition, and a bold polished look",
    ingredients: "cosmetic waxes, emollients, pigments, and comfort-supporting agents",
    usage: "apply directly to the lips or with a lip brush for more precision and control",
  }),
  product({
    name: "Maybelline SuperStay Matte Ink Lipstick",
    brand: "Maybelline",
    categoryId: CATEGORY_IDS.lipstick,
    price: 43.99,
    stock: 95,
    featured: true,
    shades: ["lm-03"],
    finish: "matte",
    skinType: NO_SKIN_TYPE,
    images: [
      "https://i.makeup.ro/z/zl/zlbtlqqx1rfj.jpg",

    ],
    benefits: "intense color, long wear, more defined lips, and a strong matte statement look",
    ingredients: "film-forming polymers, pigments, emollients, and texture-supporting agents",
    usage: "apply on clean dry lips in a thin even layer and allow a few seconds to set",
  }),
  product({
    name: "L'Oréal Paris Color Riche Satin Lipstick",
    brand: "L'Oréal Paris",
    categoryId: CATEGORY_IDS.lipstick,
    price: 49.5,
    stock: 82,
    featured: false,
    shades: [ "mt03"],
    finish: "satin",
    skinType: NO_SKIN_TYPE,
    images: [
      "https://static.beautytocare.com/cdn-cgi/image/f=auto/media/catalog/product/l/-/l-oreal-paris-color-riche-satin-lipstick-112-paris-paris.jpg",
    ],
    benefits: "comfortable wear, elegant color payoff, a satin sheen, and a smoother lip appearance",
    ingredients: "oils, cosmetic waxes, pigments, and conditioning ingredients",
    usage: "apply directly from the bullet or use a lip brush for a more precise shape",
  }),
  product({
    name: "NYX Soft Matte Lip Cream",
    brand: "NYX",
    categoryId: CATEGORY_IDS.lipstick,
    price: 39.99,
    stock: 90,
    featured: false,
    shades: [ "md-4"],
    finish: "soft matte",
    skinType: NO_SKIN_TYPE,
    images: [
      "https://s13emagst.akamaized.net/products/44945/44944329/images/res_d456a13508e955c2edc386d387ff51fe.jpg",

    ],
    benefits: "lightweight feel, smooth application, even color, and a soft modern matte finish",
    ingredients: "pigments, emollients, texture agents, and creamy binding ingredients",
    usage: "apply from the center of the lips outward using the applicator for either a natural or defined look",
  }),
  product({
    name: "Charlotte Tilbury Matte Revolution Lipstick",
    brand: "Charlotte Tilbury",
    categoryId: CATEGORY_IDS.lipstick,
    price: 169.99,
    stock: 35,
    featured: true,
    shades: ["lm-02"],
    finish: "matte",
    skinType: NO_SKIN_TYPE,
    images: [
      "https://media.sephora.eu/content/dam/digital/pim/published/C/CHARLOTTE_TILBURY/747852/363936-media_swatch.jpg?scaleWidth=585&scaleHeight=585&scaleMode=fit",

    ],
    benefits: "rich color, a sophisticated matte effect, comfortable feel, and elegant lip definition",
    ingredients: "waxes, emollient oils, pigments, and smoothing components",
    usage: "apply on moisturized lips and build as needed for the desired intensity",
  }),

  // MASCARA (5)
  product({
    name: "Maybelline Lash Sensational Mascara",
    brand: "Maybelline",
    categoryId: CATEGORY_IDS.mascara,
    price: 44.99,
    stock: 110,
    featured: true,
    shades: [],
    finish: "volumizing",
    skinType: NO_SKIN_TYPE,
    images: [
      "https://s13emagst.akamaized.net/products/112434/112433901/images/res_6962c9cfd787bac85217f7c122d47dc3.png",
  
    ],
    benefits: "definition, separation, volume, and a more open eye look",
    ingredients: "cosmetic waxes, pigments, film-formers, and texture agents",
    usage: "start at the base of the lashes and sweep upward in gentle zig-zag motions",
  }),
  product({
    name: "L'Oréal Paris Telescopic Mascara",
    brand: "L'Oréal Paris",
    categoryId: CATEGORY_IDS.mascara,
    price: 52.99,
    stock: 95,
    featured: false,
    shades: [],
    finish: "lengthening",
    skinType: NO_SKIN_TYPE,
    images: [
      "https://s13emagst.akamaized.net/products/408/407666/images/res_46282f15ca135f601c5bef94cde3a622.jpg",
      "https://cdn.notinoimg.com/detail_main_lq/loreal-paris/3600520881799_06_/telescopic___241115.jpg",
    ],
    benefits: "lash length, cleaner separation, and a more defined eye effect",
    ingredients: "black pigments, waxes, polymers, and adhesion-supporting ingredients",
    usage: "comb through the lashes from root to tip, focusing on the outer lashes for extra definition",
  }),
  product({
    name: "Essence Lash Princess False Lash Effect Mascara",
    brand: "Essence",
    categoryId: CATEGORY_IDS.mascara,
    price: 24.99,
    stock: 140,
    featured: true,
    shades: [],
    finish: "dramatic",
    skinType: NO_SKIN_TYPE,
    images: [
      "https://s13emagst.akamaized.net/products/13522/13521208/images/res_2c13bcc66d57b132e1c5797dc19ff235.jpg",
      "https://i.makeup.ro/q/qr/qrkcmxk29vzg.jpg",
      "https://i8.amplience.net/i/Cosnova/5716462?w=1068&h=1068&sm=c&scaleFit=poi&poi={$this.metadata.pointOfInterest.x},{$this.metadata.pointOfInterest.y},{$this.metadata.pointOfInterest.w},{$this.metadata.pointOfInterest.h}&fmt=auto",
    ],
    benefits: "stronger volume, a dramatic lash effect, more visible definition, and a bolder eye look",
    ingredients: "waxes, pigments, film-forming agents, and softening components",
    usage: "apply one or two coats depending on the intensity you want, avoiding too much product at once",
  }),
  product({
    name: "Benefit They're Real! Mascara",
    brand: "Benefit",
    categoryId: CATEGORY_IDS.mascara,
    price: 149.99,
    stock: 55,
    featured: false,
    shades: [],
    finish: "lengthening",
    skinType: NO_SKIN_TYPE,
    images: [
      "https://media.sephora.eu/content/dam/digital/pim/published/B/BENEFIT_COSMETICS/223101/56601-media_swatch.jpg?scaleWidth=265&scaleHeight=265&scaleMode=fit",
    ],
    benefits: "length, separation, more visible lashes, and a striking eye definition effect",
    ingredients: "pigments, waxes, polymers, and setting components",
    usage: "coat upper and lower lashes carefully for an intensified but separated result",
  }),
  product({
    name: "Lancôme Hypnôse Mascara",
    brand: "Lancôme",
    categoryId: CATEGORY_IDS.mascara,
    price: 179.99,
    stock: 45,
    featured: false,
    shades: [],
    finish: "buildable volume",
    skinType: NO_SKIN_TYPE,
    images: [
      "https://i.makeup.ro/g/gy/gyjbreg0c4g4.jpg",
      "https://cdn.notinoimg.com/detail_main_lq/lancome/3614272161788_04/hypnose___230808.jpg",
    ],
    benefits: "buildable volume, elegant lash definition, and a more refined makeup look",
    ingredients: "waxes, pigments, emollients, and flexible texture components",
    usage: "apply one or more layers depending on how much volume you want to build",
  }),

  // SKINCARE (5)
  product({
    name: "CeraVe Foaming Cleanser for Normal to Oily Skin",
    brand: "CeraVe",
    categoryId: CATEGORY_IDS.skincare,
    price: 64.99,
    stock: 120,
    featured: true,
    shades: [],
    finish: "cleanser",
    skinType: ["normal", "oily"],
    images: [
      "https://i5.walmartimages.com/seo/CeraVe-Foaming-Facial-Cleanser-Daily-Face-Wash-for-Normal-to-Oily-Skin-12-fl-oz_a74a3654-07aa-47c6-9377-117b3a532e6e.fc02eb8e8fc31ee17f086caa896a8d87.jpeg",
    
    ],
    benefits: "daily cleansing, removal of excess oil, a fresher-looking complexion, and better comfort without a harsh stripped feel",
    ingredients: "ceramides, niacinamide, glycerin, water, and gentle cleansing agents",
    usage: "massage onto damp skin morning and evening, then rinse thoroughly with lukewarm water",
  }),
  product({
    name: "La Roche-Posay Effaclar Purifying Foaming Gel",
    brand: "La Roche-Posay",
    categoryId: CATEGORY_IDS.skincare,
    price: 79.99,
    stock: 95,
    featured: true,
    shades: [],
    finish: "cleanser",
    skinType: ["oily", "normal"],
    images: [
      "https://media.farmaciatei.ro/gallery/11034/gel-spumant-de-curatare-purifiant-pentru-ten-gras-cu-tendinta-acneica-effaclar-400-ml-la-roche-posay-2736.jpg",

    ],
    benefits: "gentle purification, a cleaner feel, reduced surface oil, and better freshness for oily-prone skin",
    ingredients: "thermal water, zinc PCA, gentle cleansing agents, glycerin, and water",
    usage: "lather in the hands, apply to damp skin, massage softly, and rinse well",
  }),
  product({
    name: "CeraVe Moisturizing Cream",
    brand: "CeraVe",
    categoryId: CATEGORY_IDS.skincare,
    price: 82.99,
    stock: 100,
    featured: false,
    shades: [],
    finish: "moisturizer",
    skinType: ["dry", "normal"],
    images: [
      "https://static.beautytocare.com/cdn-cgi/image/f=auto/media/catalog/product/c/e/cerave-moisturizing-cream-dry-to-very-dry-skin-454g_1.jpg",
    ],
    benefits: "intense hydration, a more comfortable skin feel, support for the skin barrier, and relief for dry-feeling skin",
    ingredients: "ceramides, hyaluronic acid, glycerin, water, and rich emollients",
    usage: "apply generously to clean skin on the face or body whenever needed and massage until absorbed",
  }),
  product({
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    categoryId: CATEGORY_IDS.skincare,
    price: 39.99,
    stock: 115,
    featured: true,
    shades: [],
    finish: "serum",
    skinType: ["normal", "oily", "dry"],
    images: [
      "https://media.bebetei.ro/gallery/12750/niacinamide-10-si-zinc-1-30-ml-the-ordinary-5519.jpg",

    ],
    benefits: "a more balanced-looking complexion, support for oily-prone skin, and a more even visual tone",
    ingredients: "niacinamide, zinc PCA, water, tamarind gum, and stabilizing ingredients",
    usage: "apply a few drops to clean skin before heavier creams, usually morning and or evening",
  }),
  product({
    name: "Bioderma Sensibio H2O Micellar Water",
    brand: "Bioderma",
    categoryId: CATEGORY_IDS.skincare,
    price: 58.99,
    stock: 130,
    featured: false,
    shades: [],
    finish: "micellar water",
    skinType: ["normal", "dry"],
    images: [
      "https://media.farmaciatei.ro/gallery/33999/solutie-micelara-sensibio-h2o-500-ml-bioderma-7260.png",
    ],
    benefits: "gentle cleansing, quick makeup removal, a comfortable skin feel, and convenient daily use",
    ingredients: "micellar cleansing agents, purified water, soothing components, and comfort-supporting ingredients",
    usage: "soak a cotton pad and sweep gently over the face, eyes, and lips until the skin is clean",
  }),
];

const reviewTemplates = [
  { rating: 5, comment: "I really love this product. The texture feels great, the application is easy, and the final result looks beautiful. I have used it several times already and it has quickly become one of my favorites." },
  { rating: 4, comment: "Very good product with a strong quality-to-price ratio. I like the finish, the comfort during wear, and the way it performs throughout the day. I would definitely buy it again." },
  { rating: 5, comment: "I am extremely happy with this purchase. The formula feels comfortable, looks flattering, and gives exactly the effect I was hoping for. I would absolutely recommend it." },
  { rating: 4, comment: "This product exceeded my expectations. It applies nicely, looks even, and feels reliable in daily use. The packaging is also practical and easy to use." },
  { rating: 5, comment: "Excellent product for my routine. It looks good, wears well, and gives a polished result without feeling too heavy. I am very satisfied with it." },
  { rating: 4, comment: "Easy to apply, comfortable to wear, and visually very pleasing. I like that I can control the intensity and adapt it well to the type of look I want." },
];

async function deleteCollection(collectionName, batchSize = 100) {
  const collectionRef = db.collection(collectionName);
  let snapshot = await collectionRef.limit(batchSize).get();

  while (!snapshot.empty) {
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    snapshot = await collectionRef.limit(batchSize).get();
  }

  console.log(`Deleted collection: ${collectionName}`);
}

async function clearFirestore() {
  for (const collectionName of COLLECTIONS_TO_DELETE) {
    await deleteCollection(collectionName);
  }
}

async function deleteAllAuthUsers() {
  let nextPageToken;

  do {
    const result = await admin.auth().listUsers(1000, nextPageToken);

    if (result.users.length > 0) {
      const uids = result.users.map((user) => user.uid);
      await admin.auth().deleteUsers(uids);
      console.log(`Deleted ${uids.length} Firebase Auth users`);
    }

    nextPageToken = result.pageToken;
  } while (nextPageToken);
}

async function createAuthUser(user) {
  const created = await admin.auth().createUser({
    email: user.email,
    password: user.password,
    displayName: user.fullName,
  });

  console.log(`Created auth user: ${user.email}`);
  return created;
}

async function seedUsers() {
  const createdUsers = [];

  for (const user of users) {
    const authUser = await createAuthUser(user);

    await db.collection("users").doc(authUser.uid).set({
      uid: authUser.uid,
      fullName: user.fullName,
      email: user.email.toLowerCase().trim(),
      phone: user.phone,
      role: user.role,
      addresses: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    createdUsers.push({
      uid: authUser.uid,
      fullName: user.fullName,
      email: user.email.toLowerCase().trim(),
      phone: user.phone,
      role: user.role,
    });

    console.log(`Created Firestore profile: ${user.email} (${user.role})`);
  }

  return createdUsers;
}

async function seedCategories() {
  for (const category of categories) {
    const { id, ...data } = category;

    await db.collection("categories").doc(id).set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Created category: ${category.name}`);
  }
}

async function seedProducts() {
  for (const item of products) {
    const { id, ...data } = item;

    await db.collection("products").doc(id).set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Created product: ${item.name}`);
  }
}

async function seedReviews(createdUsers) {
  const customers = createdUsers.filter((user) => user.role === "customer");

  for (const item of products) {
    const reviewers = pickMany(customers, 3);
    let totalRating = 0;

    for (let i = 0; i < reviewers.length; i += 1) {
      const reviewer = reviewers[i];
      const review = reviewTemplates[(i + randomInt(0, reviewTemplates.length - 1)) % reviewTemplates.length];

      totalRating += review.rating;

      await db.collection("reviews").add({
        productId: item.id,
        userId: reviewer.uid,
        userName: reviewer.fullName,
        rating: review.rating,
        comment: review.comment,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await db.collection("products").doc(item.id).update({
      averageRating: Number((totalRating / 3).toFixed(1)),
      reviewsCount: 3,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Created 3 reviews for: ${item.name}`);
  }
}

function makeShippingAddress(user) {
  const cities = ["Bucharest", "Cluj-Napoca", "Iași", "Timișoara", "Brașov", "Constanța"];
  const streets = [
    "12 Rose Street",
    "24 Union Boulevard",
    "18 Mărășești Street",
    "51 Victory Avenue",
    "9 Spring Street",
    "33 Flower Street",
  ];

  return {
    fullName: user.fullName,
    phone: user.phone,
    city: randomFrom(cities),
    street: randomFrom(streets),
    postalCode: String(randomInt(100000, 999999)),
  };
}

async function seedCarts(createdUsers) {
  const customers = createdUsers.filter((user) => user.role === "customer");

  for (const customer of customers) {
    await db.collection("carts").doc(customer.uid).set({
      userId: customer.uid,
      items: [],
      subtotal: 0,
      total: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log("Created empty carts for customers");
}

async function seedOrders(createdUsers) {
  const customers = createdUsers.filter((user) => user.role === "customer");

  for (let i = 0; i < customers.length; i += 1) {
    const customer = customers[i];
    const orderCount = randomInt(1, 3);

    for (let j = 0; j < orderCount; j += 1) {
      const orderStatus = ORDER_STATUSES[(i + j) % ORDER_STATUSES.length];
      const paymentStatus = PAYMENT_STATUSES[orderStatus];

      const chosenProducts = pickMany(products, randomInt(1, 4));
      const items = chosenProducts.map((item) => {
        const quantity = randomInt(1, 3);
        return {
          productId: item.id,
          name: item.name,
          slug: item.slug,
          price: Number(item.price),
          quantity,
          image: item.images?.[0] || "",
        };
      });

      const subtotal = Number(
        items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
      );
      const shippingCost = 20;
      const total = Number((subtotal + shippingCost).toFixed(2));

      await db.collection("orders").add({
        userId: customer.uid,
        orderNumber: `CMD-${Date.now()}-${i}-${j}`,
        items,
        subtotal,
        shippingCost,
        total,
        currency: "RON",
        paymentStatus,
        orderStatus,
        shippingAddress: makeShippingAddress(customer),
        invoice: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log(`Created orders for: ${customer.email}`);
  }
}

async function main() {
  try {
    console.log("--- START SEED ---");

    await clearFirestore();
    await deleteAllAuthUsers();

    const createdUsers = await seedUsers();
    await seedCategories();
    await seedProducts();
    await seedReviews(createdUsers);
    await seedCarts(createdUsers);
    await seedOrders(createdUsers);

    console.log("--- SEED COMPLETE ---");
    console.log("Admin: admin@gmail.com / 123456");
    console.log("Client: client@gmail.com / 123456");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

main();