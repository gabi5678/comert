const { admin } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Acces neautorizat. Lipsește tokenul.'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token invalid sau expirat',
      error: error.message
    });
  }
};

module.exports = authMiddleware;