const { db } = require('../config/firebase');

const normalizeText = (value) => {
  return String(value || '').trim().toLowerCase();
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

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      products = products.filter(product => Number(product.price) <= Number(maxPrice));
    }

    if (productType) {
      const normalizedProductType = normalizeText(productType);

      const categoriesSnapshot = await db.collection('categories').get();
      const categories = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const matchedCategory = categories.find(category =>
        normalizeText(category.name) === normalizedProductType ||
        normalizeText(category.slug) === normalizedProductType
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

    if (finish) {
      const normalizedFinish = normalizeText(finish);

      products = products.filter(product =>
        normalizeText(product.finish) === normalizedFinish
      );
    }

    if (skinType) {
      const normalizedSkinType = normalizeText(skinType);

      products = products.filter(product => {
        const productSkinTypes = Array.isArray(product.skinType) ? product.skinType : [];

        return productSkinTypes.some(type => normalizeText(type) === normalizedSkinType);
      });
    }

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

const getRecommenderFilters = async (req, res) => {
  try {
    const productsSnapshot = await db
      .collection('products')
      .where('isActive', '==', true)
      .get();

    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const categoryIdsInUse = [...new Set(
      products
        .map(product => product.categoryId)
        .filter(Boolean)
    )];

    let categories = [];

    if (categoryIdsInUse.length > 0) {
      const categoryDocs = await Promise.all(
        categoryIdsInUse.map(categoryId =>
          db.collection('categories').doc(categoryId).get()
        )
      );

      categories = categoryDocs
        .filter(doc => doc.exists)
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    }

    const skinTypes = [...new Set(
      products.flatMap(product =>
        Array.isArray(product.skinType)
          ? product.skinType.map(type => String(type).trim()).filter(Boolean)
          : []
      )
    )].sort((a, b) => a.localeCompare(b));

    const finishes = [...new Set(
      products
        .map(product => String(product.finish || '').trim())
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      productTypes: categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug || ''
      })),
      skinTypes,
      finishes
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea filtrelor pentru recommender',
      error: error.message
    });
  }
};

module.exports = {
  getMakeupRecommendations,
  getRecommenderFilters
};