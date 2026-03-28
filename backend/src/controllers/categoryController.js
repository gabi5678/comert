const { db, admin } = require('../config/firebase');

const getAllCategories = async (req, res) => {
  try {
    const snapshot = await db.collection('categories').get();

    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea categoriilor',
      error: error.message
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryDoc = await db.collection('categories').doc(req.params.id).get();

    if (!categoryDoc.exists) {
      return res.status(404).json({
        message: 'Categoria nu a fost găsită'
      });
    }

    res.status(200).json({
      id: categoryDoc.id,
      ...categoryDoc.data()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea categoriei',
      error: error.message
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: 'name și slug sunt obligatorii'
      });
    }

    const newCategory = {
      name,
      slug,
      image: image || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('categories').add(newCategory);

    res.status(201).json({
      message: 'Categoria a fost creată cu succes',
      id: docRef.id
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la crearea categoriei',
      error: error.message
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;

    await db.collection('categories').doc(req.params.id).update({
      name,
      slug,
      image
    });

    res.status(200).json({
      message: 'Categoria a fost actualizată'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la actualizarea categoriei',
      error: error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await db.collection('categories').doc(req.params.id).delete();

    res.status(200).json({
      message: 'Categoria a fost ștearsă'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la ștergerea categoriei',
      error: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};