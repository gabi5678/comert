const { db, admin } = require('../config/firebase');

const getAllProducts = async (req, res) => {
  try {
    const { categoryId, featured, isActive, search } = req.query;

    let query = db.collection('products');

    if (categoryId) {
      query = query.where('categoryId', '==', categoryId);
    }

    if (featured === 'true') {
      query = query.where('featured', '==', true);
    }

    if (featured === 'false') {
      query = query.where('featured', '==', false);
    }

    if (isActive === 'true') {
      query = query.where('isActive', '==', true);
    }

    if (isActive === 'false') {
      query = query.where('isActive', '==', false);
    }

    const snapshot = await query.get();

    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (search) {
      const searchLower = search.toLowerCase();

      products = products.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea produselor',
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productDoc = await db.collection('products').doc(req.params.id).get();

    if (!productDoc.exists) {
      return res.status(404).json({
        message: 'Produsul nu a fost găsit'
      });
    }

    res.status(200).json({
      id: productDoc.id,
      ...productDoc.data()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea produsului',
      error: error.message
    });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const snapshot = await db
      .collection('products')
      .where('featured', '==', true)
      .where('isActive', '==', true)
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea produselor featured',
      error: error.message
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const snapshot = await db
      .collection('products')
      .where('categoryId', '==', categoryId)
      .where('isActive', '==', true)
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea produselor pe categorie',
      error: error.message
    });
  }
};

const getProductStock = async (req, res) => {
  try {
    const productDoc = await db.collection('products').doc(req.params.id).get();

    if (!productDoc.exists) {
      return res.status(404).json({
        message: 'Produsul nu a fost găsit'
      });
    }

    const product = productDoc.data();

    res.status(200).json({
      productId: productDoc.id,
      name: product.name,
      stock: product.stock || 0,
      isInStock: (product.stock || 0) > 0
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la verificarea stocului',
      error: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      brand,
      categoryId,
      description,
      price,
      currency,
      stock,
      images,
      featured,
      discountPercent,
      shades,
      finish,
      skinType,
      isActive
    } = req.body;

    if (!name || !slug || !categoryId || price === undefined) {
      return res.status(400).json({
        message: 'name, slug, categoryId și price sunt obligatorii'
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        message: 'Prețul nu poate fi negativ'
      });
    }

    if (Number(stock || 0) < 0) {
      return res.status(400).json({
        message: 'Stocul nu poate fi negativ'
      });
    }

    const categoryDoc = await db.collection('categories').doc(categoryId).get();

    if (!categoryDoc.exists) {
      return res.status(400).json({
        message: 'Categoria nu există'
      });
    }

    const slugSnapshot = await db
      .collection('products')
      .where('slug', '==', slug)
      .get();

    if (!slugSnapshot.empty) {
      return res.status(400).json({
        message: 'Există deja un produs cu acest slug'
      });
    }

    const newProduct = {
      name: name.trim(),
      slug: slug.trim(),
      brand: brand ? brand.trim() : '',
      categoryId,
      description: description ? description.trim() : '',
      price: Number(price),
      currency: currency || 'RON',
      stock: Number(stock || 0),
      images: Array.isArray(images) ? images : [],
      featured: featured === true,
      discountPercent: Number(discountPercent || 0),
      shades: Array.isArray(shades) ? shades : [],
      finish: finish || '',
      skinType: Array.isArray(skinType) ? skinType : [],
      isActive: typeof isActive === 'boolean' ? isActive : true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('products').add(newProduct);

    res.status(201).json({
      message: 'Produsul a fost creat cu succes',
      id: docRef.id
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la crearea produsului',
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({
        message: 'Produsul nu a fost găsit'
      });
    }

    const {
      name,
      slug,
      brand,
      categoryId,
      description,
      price,
      currency,
      stock,
      images,
      featured,
      discountPercent,
      shades,
      finish,
      skinType,
      isActive
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (brand !== undefined) updateData.brand = brand.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (currency !== undefined) updateData.currency = currency;
    if (finish !== undefined) updateData.finish = finish;
    if (featured !== undefined) updateData.featured = featured;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (price !== undefined) {
      if (Number(price) < 0) {
        return res.status(400).json({
          message: 'Prețul nu poate fi negativ'
        });
      }
      updateData.price = Number(price);
    }

    if (stock !== undefined) {
      if (Number(stock) < 0) {
        return res.status(400).json({
          message: 'Stocul nu poate fi negativ'
        });
      }
      updateData.stock = Number(stock);
    }

    if (discountPercent !== undefined) {
      updateData.discountPercent = Number(discountPercent);
    }

    if (images !== undefined) {
      updateData.images = Array.isArray(images) ? images : [];
    }

    if (shades !== undefined) {
      updateData.shades = Array.isArray(shades) ? shades : [];
    }

    if (skinType !== undefined) {
      updateData.skinType = Array.isArray(skinType) ? skinType : [];
    }

    if (categoryId !== undefined) {
      const categoryDoc = await db.collection('categories').doc(categoryId).get();

      if (!categoryDoc.exists) {
        return res.status(400).json({
          message: 'Categoria nu există'
        });
      }

      updateData.categoryId = categoryId;
    }

    if (slug !== undefined) {
      const slugSnapshot = await db
        .collection('products')
        .where('slug', '==', slug.trim())
        .get();

      const duplicateSlug = slugSnapshot.docs.find(doc => doc.id !== req.params.id);

      if (duplicateSlug) {
        return res.status(400).json({
          message: 'Există deja un alt produs cu acest slug'
        });
      }
    }

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await productRef.update(updateData);

    res.status(200).json({
      message: 'Produsul a fost actualizat'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la actualizarea produsului',
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete();

    res.status(200).json({
      message: 'Produsul a fost șters'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la ștergerea produsului',
      error: error.message
    });
  }
};


module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductStock,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};