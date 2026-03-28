require('dotenv').config();

const { db, admin } = require('../src/config/firebase');

const CATEGORY_IDS = {
  foundation: 'foundation',
  concealer: 'concealer',
  lipstick: 'lipstick',
  mascara: 'mascara',
  skincare: 'skincare'
};

const PRODUCT_IDS = {
  f1: 'maybelline-fit-me-foundation',
  f2: 'loreal-true-match-foundation',
  c1: 'nyx-bare-with-me-concealer',
  l1: 'maybelline-superstay-matte-ink',
  l2: 'mac-ruby-woo-lipstick',
  m1: 'essence-lash-princess-mascara',
  s1: 'cerave-hydrating-cleanser',
  s2: 'the-ordinary-niacinamide'
};

const categories = [
  {
    id: CATEGORY_IDS.foundation,
    name: 'Fond de ten',
    slug: 'fond-de-ten',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'
  },
  {
    id: CATEGORY_IDS.concealer,
    name: 'Concealer',
    slug: 'concealer',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348'
  },
  {
    id: CATEGORY_IDS.lipstick,
    name: 'Ruj',
    slug: 'ruj',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa'
  },
  {
    id: CATEGORY_IDS.mascara,
    name: 'Mascara',
    slug: 'mascara',
    image: 'https://images.unsplash.com/photo-1631214540242-6f5c8f0db3d8'
  },
  {
    id: CATEGORY_IDS.skincare,
    name: 'Skincare',
    slug: 'skincare',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883'
  }
];

const products = [
  {
    id: PRODUCT_IDS.f1,
    name: 'Maybelline Fit Me Matte + Poreless',
    slug: 'maybelline-fit-me-matte-poreless',
    brand: 'Maybelline',
    categoryId: CATEGORY_IDS.foundation,
    description:
      'Fond de ten cu acoperire medie, finish mat, potrivit pentru ten mixt și gras.',
    price: 49.99,
    currency: 'RON',
    stock: 25,
    images: [
      'https://www.ubuy.com.ro/en/product/RQWS1M-maybelline-fit-me-matte-poreless-liquid-foundation-makeup-creamy-beige-1-oza?srsltid=AfmBOorFola5euVzLdrz4j21wCD1rUS6GUlcsS5Uc49AuYG37J0hnha7'
    ],
    featured: true,
    discountPercent: 10,
    shades: ['110 Porcelain', '115 Ivory', '128 Warm Nude'],
    finish: 'matte',
    skinType: ['mixt', 'gras'],
    isActive: true
  },
  {
    id: PRODUCT_IDS.f2,
    name: 'L’Oréal True Match Foundation',
    slug: 'loreal-true-match-foundation',
    brand: 'L’Oréal',
    categoryId: CATEGORY_IDS.foundation,
    description:
      'Fond de ten cu finish natural și textură lejeră, ideal pentru utilizare zilnică.',
    price: 67.5,
    currency: 'RON',
    stock: 18,
    images: [
      'https://comenzi.farmaciatei.ro/ingrijire-personala/make-up/fond-de-ten/fond-de-ten-infuzat-cu-acid-hialuronic-true-match-1-5n-linen-30-ml-loreal-p366555',
      'https://media.farmaciatei.ro/gallery/65328/medium/fond-de-ten-infuzat-cu-acid-hialuronic-true-match-4n-beige-30-ml-loreal-4219.webp'
    ],
    featured: true,
    discountPercent: 0,
    shades: ['1N Ivory', '2N Vanilla', '3D Beige Doré'],
    finish: 'natural',
    skinType: ['normal', 'uscat', 'mixt'],
    isActive: true
  },
  {
    id: PRODUCT_IDS.c1,
    name: 'NYX Bare With Me Concealer Serum',
    slug: 'nyx-bare-with-me-concealer-serum',
    brand: 'NYX',
    categoryId: CATEGORY_IDS.concealer,
    description:
      'Concealer hidratant cu acoperire medie, perfect pentru zona ochilor.',
    price: 55,
    currency: 'RON',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1631730486787-33f4fd1c8d68'
    ],
    featured: false,
    discountPercent: 5,
    shades: ['Light', 'Vanilla', 'Beige'],
    finish: 'natural',
    skinType: ['uscat', 'normal', 'mixt'],
    isActive: true
  },
  {
    id: PRODUCT_IDS.l1,
    name: 'Maybelline SuperStay Matte Ink',
    slug: 'maybelline-superstay-matte-ink',
    brand: 'Maybelline',
    categoryId: CATEGORY_IDS.lipstick,
    description:
      'Ruj lichid rezistent, intens pigmentat, cu finish mat.',
    price: 43.99,
    currency: 'RON',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa'
    ],
    featured: true,
    discountPercent: 15,
    shades: ['Pioneer', 'Lover', 'Seductress'],
    finish: 'matte',
    skinType: [],
    isActive: true
  },
  {
    id: PRODUCT_IDS.l2,
    name: 'MAC Ruby Woo Lipstick',
    slug: 'mac-ruby-woo-lipstick',
    brand: 'MAC',
    categoryId: CATEGORY_IDS.lipstick,
    description:
      'Ruj iconic roșu rece, foarte pigmentat, cu finish retro mat.',
    price: 119.99,
    currency: 'RON',
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a'
    ],
    featured: true,
    discountPercent: 0,
    shades: ['Ruby Woo'],
    finish: 'matte',
    skinType: [],
    isActive: true
  },
  {
    id: PRODUCT_IDS.m1,
    name: 'Essence Lash Princess False Lash Effect',
    slug: 'essence-lash-princess-false-lash-effect',
    brand: 'Essence',
    categoryId: CATEGORY_IDS.mascara,
    description:
      'Mascara pentru volum și alungire, ideală pentru efect dramatic.',
    price: 24.99,
    currency: 'RON',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'
    ],
    featured: false,
    discountPercent: 0,
    shades: ['Black'],
    finish: 'natural',
    skinType: [],
    isActive: true
  },
  {
    id: PRODUCT_IDS.s1,
    name: 'CeraVe Hydrating Cleanser',
    slug: 'cerave-hydrating-cleanser',
    brand: 'CeraVe',
    categoryId: CATEGORY_IDS.skincare,
    description:
      'Gel de curățare delicat pentru ten normal și uscat, cu ceramide și acid hialuronic.',
    price: 59.9,
    currency: 'RON',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883'
    ],
    featured: true,
    discountPercent: 0,
    shades: [],
    finish: '',
    skinType: ['uscat', 'normal'],
    isActive: true
  },
  {
    id: PRODUCT_IDS.s2,
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    slug: 'the-ordinary-niacinamide-zinc',
    brand: 'The Ordinary',
    categoryId: CATEGORY_IDS.skincare,
    description:
      'Ser pentru reglarea sebumului și uniformizarea aspectului pielii.',
    price: 39.99,
    currency: 'RON',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0f'
    ],
    featured: true,
    discountPercent: 0,
    shades: [],
    finish: '',
    skinType: ['gras', 'mixt'],
    isActive: true
  }
];

const users = [
  {
    email: 'admin@makeupshop.ro',
    password: 'Admin123!',
    fullName: 'Admin Demo',
    phone: '0711111111',
    role: 'admin'
  },
  {
    email: 'client@makeupshop.ro',
    password: 'Client123!',
    fullName: 'Client Demo',
    phone: '0722222222',
    role: 'customer'
  }
];

async function ensureAuthUser(user) {
  try {
    const existing = await admin.auth().getUserByEmail(user.email);
    console.log(`Auth user existent: ${user.email}`);
    return existing;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      const created = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.fullName,
        phoneNumber: user.phone.startsWith('+40') ? user.phone : undefined
      });

      console.log(`Auth user creat: ${user.email}`);
      return created;
    }

    throw error;
  }
}

async function seedUsers() {
  console.log('Seeding users...');

  for (const user of users) {
    const authUser = await ensureAuthUser(user);

    const userRef = db.collection('users').doc(authUser.uid);

    await userRef.set(
      {
        uid: authUser.uid,
        fullName: user.fullName,
        email: user.email.toLowerCase().trim(),
        phone: user.phone,
        role: user.role,
        addresses: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    console.log(`Profil Firestore upsert: ${user.email} (${user.role})`);
  }
}

async function seedCategories() {
  console.log('Seeding categories...');

  for (const category of categories) {
    const { id, ...data } = category;

    await db.collection('categories').doc(id).set(
      {
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    console.log(`Categorie upsert: ${category.name}`);
  }
}

async function seedProducts() {
  console.log('Seeding products...');

  for (const product of products) {
    const { id, ...data } = product;

    await db.collection('products').doc(id).set(
      {
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    console.log(`Produs upsert: ${product.name}`);
  }
}

async function main() {
  try {
    console.log('--- START SEED ---');

    await seedUsers();
    await seedCategories();
    await seedProducts();

    console.log('--- SEED COMPLET ---');
    process.exit(0);
  } catch (error) {
    console.error('Eroare la seed:', error);
    process.exit(1);
  }
}

main();