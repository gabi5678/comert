const { db, admin } = require('../config/firebase');

const recalculateProductRating = async (productId) => {
  const snapshot = await db
    .collection('reviews')
    .where('productId', '==', productId)
    .get();

  const reviews = snapshot.docs.map((doc) => doc.data());

  const reviewsCount = reviews.length;

  const averageRating =
    reviewsCount === 0
      ? 0
      : Number(
          (
            reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
            reviewsCount
          ).toFixed(1)
        );

  await db.collection('products').doc(productId).update({
    averageRating,
    reviewsCount,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const productDoc = await db.collection('products').doc(productId).get();

    if (!productDoc.exists) {
      return res.status(404).json({
        message: 'Produsul nu a fost găsit',
      });
    }

    const snapshot = await db
      .collection('reviews')
      .where('productId', '==', productId)
      .get();

    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    reviews.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });

    const averageRating =
      reviews.length === 0
        ? 0
        : Number(
            (
              reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
              reviews.length
            ).toFixed(1)
          );

    res.status(200).json({
      productId,
      reviewsCount: reviews.length,
      averageRating,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea review-urilor',
      error: error.message,
    });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.uid;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        message: 'rating și comment sunt obligatorii',
      });
    }

    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        message: 'Rating-ul trebuie să fie între 1 și 5',
      });
    }

    if (String(comment).trim().length < 3) {
      return res.status(400).json({
        message: 'Comentariul este prea scurt',
      });
    }

    const productDoc = await db.collection('products').doc(productId).get();

    if (!productDoc.exists) {
      return res.status(404).json({
        message: 'Produsul nu a fost găsit',
      });
    }

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: 'Profilul utilizatorului nu a fost găsit',
      });
    }

    const userData = userDoc.data();

    const existingSnapshot = await db
      .collection('reviews')
      .where('productId', '==', productId)
      .where('userId', '==', userId)
      .get();

    if (!existingSnapshot.empty) {
      const existingReviewDoc = existingSnapshot.docs[0];

      await db.collection('reviews').doc(existingReviewDoc.id).update({
        rating: numericRating,
        comment: String(comment).trim(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await recalculateProductRating(productId);

      return res.status(200).json({
        message: 'Review actualizat cu succes',
        reviewId: existingReviewDoc.id,
      });
    }

    const reviewData = {
      productId,
      userId,
      userName: userData.fullName || userData.email || 'Anonymous',
      rating: numericRating,
      comment: String(comment).trim(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const reviewRef = await db.collection('reviews').add(reviewData);

    await recalculateProductRating(productId);

    res.status(201).json({
      message: 'Review adăugat cu succes',
      reviewId: reviewRef.id,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la adăugarea review-ului',
      error: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const reviewRef = db.collection('reviews').doc(id);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return res.status(404).json({
        message: 'Review-ul nu a fost găsit',
      });
    }

    const review = reviewDoc.data();

    const userDoc = await db.collection('users').doc(userId).get();
    const role = userDoc.exists ? userDoc.data().role : 'customer';

    if (review.userId !== userId && role !== 'admin') {
      return res.status(403).json({
        message: 'Nu ai acces să ștergi acest review',
      });
    }

    await reviewRef.delete();
    await recalculateProductRating(review.productId);

    res.status(200).json({
      message: 'Review șters cu succes',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la ștergerea review-ului',
      error: error.message,
    });
  }
};

module.exports = {
  getReviewsByProduct,
  createReview,
  deleteReview,
};