const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/boonsblend', { useNewUrlParser: true, useUnifiedTopology: true });

// Models
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  price: Number,
  stock: Number
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  createdAt: { type: Date, default: Date.now }
}));

const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false }
}));

// Middleware to protect routes
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
}

// API routes
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', auth, async (req, res) => {
  const p = await Product.create(req.body);
  res.json(p);
});

app.put('/api/products/:id', auth, async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
});

app.delete('/api/products/:id', auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.post('/api/orders', async (req, res) => {
  const order = await Order.create(req.body);
  res.json({ success: true, order });
});

app.get('/api/orders', auth, async (req, res) => {
  const orders = await Order.find().populate('productId');
  res.json(orders);
});

app.post('/api/register', async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ email: req.body.email, password: hashed });
  res.json(user);
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send('Invalid');
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(401).send('Invalid');
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'secret');
  res.json({ token });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
