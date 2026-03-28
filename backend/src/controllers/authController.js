const { db, admin } = require('../config/firebase');

const createUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email;
    const { fullName, phone } = req.body;

    if (!fullName) {
      return res.status(400).json({
        message: 'fullName este obligatoriu'
      });
    }

    const userRef = db.collection('users').doc(uid);
    const existingUser = await userRef.get();

    if (existingUser.exists) {
      return res.status(200).json({
        message: 'Profilul utilizatorului există deja'
      });
    }

    const userData = {
      uid,
      fullName: fullName.trim(),
      email: String(email || '').trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      role: 'customer',
      addresses: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await userRef.set(userData);

    res.status(201).json({
      message: 'Profil utilizator creat cu succes'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la crearea profilului utilizatorului',
      error: error.message
    });
  }
};
const getMyProfile = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: 'Profilul utilizatorului nu a fost găsit'
      });
    }

    res.status(200).json({
      id: userDoc.id,
      ...userDoc.data()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea profilului',
      error: error.message
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { fullName, phone, addresses } = req.body;

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (addresses !== undefined) updateData.addresses = Array.isArray(addresses) ? addresses : [];

    await db.collection('users').doc(req.user.uid).update(updateData);

    res.status(200).json({
      message: 'Profil actualizat cu succes'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la actualizarea profilului',
      error: error.message
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea utilizatorilor',
      error: error.message
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { uid } = req.params;

    if (!role || !['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        message: 'Rol invalid'
      });
    }

    await db.collection('users').doc(uid).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({
      message: `Rolul utilizatorului a fost schimbat în ${role}`
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la actualizarea rolului',
      error: error.message
    });
  }
};

module.exports = {
  createUserProfile,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserRole
};