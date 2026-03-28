const { db } = require('../config/firebase');

const adminMiddleware = async (req, res, next) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: 'Utilizatorul nu există în baza de date'
      });
    }

    const userData = userDoc.data();

    if (userData.role !== 'admin') {
      return res.status(403).json({
        message: 'Acces interzis. Doar administratorii au voie.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la verificarea rolului de administrator',
      error: error.message
    });
  }
};

module.exports = adminMiddleware;