const express = require('express');
const cors = require('cors');

const { db } = require('./config/firebase');
const stripe = require('./config/stripe');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const recommenderRoutes = require('./routes/recommenderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(cors());

// app.use(cors({
//   origin: [
//     'http://localhost:3000',
//     'https://domeniul-tau.ro'
//   ],
//   credentials: true
// }));


app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API-ul Makeup Ecommerce funcționează' });
});

app.get('/test-firebase', async (req, res) => {
  try {
    const testRef = await db.collection('test').add({
      message: 'Firebase merge',
      createdAt: new Date()
    });

    res.json({
      ok: true,
      docId: testRef.id
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.get('/test-stripe', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: 'ron'
    });

    res.json({
      ok: true,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/recommender', recommenderRoutes);
app.use('/api/reviews', reviewRoutes);


const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);

module.exports = app;