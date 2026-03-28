const { db } = require('../config/firebase');

const normalizeText = (value) => {
  return String(value || '')
    .trim()
    .toLowerCase();
};

const getMakeupRecommendations = async (req, res) => {
  try {
    const { productType, skinType, finish, maxPrice } = req.body;

    let query = db.collection('products').where('isActive', '==', true);
    const snapshot = await query.get();

    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // filtrare după buget
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      products = products.filter(product => Number(product.price) <= Number(maxPrice));
    }

    // dacă avem productType, încercăm să potrivim cu numele categoriei sau numele produsului
    if (productType) {
      const normalizedProductType = normalizeText(productType);

      const categoriesSnapshot = await db.collection('categories').get();
      const categories = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const matchedCategory = categories.find(category =>
        normalizeText(category.name).includes(normalizedProductType) ||
        normalizeText(category.slug).includes(normalizedProductType)
      );

      if (matchedCategory) {
        products = products.filter(product => product.categoryId === matchedCategory.id);
      } else {
        products = products.filter(product =>
          normalizeText(product.name).includes(normalizedProductType) ||
          normalizeText(product.description).includes(normalizedProductType) ||
          normalizeText(product.brand).includes(normalizedProductType)
        );
      }
    }

    // filtrare după finish
    if (finish) {
      const normalizedFinish = normalizeText(finish);

      products = products.filter(product =>
        normalizeText(product.finish) === normalizedFinish
      );
    }

    // filtrare după skinType
    if (skinType) {
      const normalizedSkinType = normalizeText(skinType);

      products = products.filter(product => {
        const productSkinTypes = Array.isArray(product.skinType) ? product.skinType : [];

        return productSkinTypes.some(type => normalizeText(type) === normalizedSkinType);
      });
    }

    // scor simplu de relevanță
    const scoredProducts = products.map(product => {
      let score = 0;

      if (productType) {
        const normalizedProductType = normalizeText(productType);
        if (
          normalizeText(product.name).includes(normalizedProductType) ||
          normalizeText(product.description).includes(normalizedProductType)
        ) {
          score += 2;
        }
      }

      if (finish && normalizeText(product.finish) === normalizeText(finish)) {
        score += 2;
      }

      if (skinType) {
        const productSkinTypes = Array.isArray(product.skinType) ? product.skinType : [];
        if (productSkinTypes.some(type => normalizeText(type) === normalizeText(skinType))) {
          score += 3;
        }
      }

      if (product.featured) {
        score += 1;
      }

      return {
        ...product,
        recommendationScore: score
      };
    });

    scoredProducts.sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }

      return Number(a.price) - Number(b.price);
    });

    res.status(200).json({
      filters: {
        productType: productType || null,
        skinType: skinType || null,
        finish: finish || null,
        maxPrice: maxPrice !== undefined ? Number(maxPrice) : null
      },
      totalResults: scoredProducts.length,
      recommendations: scoredProducts
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la generarea recomandărilor',
      error: error.message
    });
  }
};

module.exports = {
  getMakeupRecommendations
};