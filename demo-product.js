// demo-product.js
// Script to import dummy products, categories (parent/child), users, and orders into the database

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./server/models/User');
const Product = require('./server/models/Product');
const Category = require('./server/models/Category');
const Order = require('./server/models/Order');
const bcrypt = require('bcryptjs');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/women_hub';

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
}

async function clearDB() {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Order.deleteMany({});
}

async function seed() {
  // 1. Create Parent Categories
  const parentCategories = await Category.insertMany([
    { name: 'General', parent: [] },
    { name: 'Shoes', parent: [] },
    { name: 'Bags', parent: [] },
    { name: 'Electronics', parent: [] },
    { name: 'Clothing', parent: [] },
  ]);

  // 2. Create Child Categories (with multi-parent support)
  const childCategories = await Category.insertMany([
    { name: 'Running Shoes', parent: [parentCategories[1]._id] },
    { name: 'Handbags', parent: [parentCategories[2]._id] },
    { name: 'Smartphones', parent: [parentCategories[3]._id] },
    { name: 'T-Shirts', parent: [parentCategories[4]._id] },
    { name: 'Sports Shoes', parent: [parentCategories[1]._id, parentCategories[4]._id] }, // multi-parent
  ]);

  // 3. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = await User.insertMany([
    { name: 'Admin User', email: 'admin@demo.com', password: passwordHash, isAdmin: true },
    { name: 'Jane Doe', email: 'jane@demo.com', password: passwordHash },
    { name: 'John Smith', email: 'john@demo.com', password: passwordHash },
  ]);

  // 4. Create Products
  const products = await Product.insertMany([
    {
      name: 'Nike Running Shoes',
      description: 'Comfortable running shoes for women',
      price: 2999,
      image: '/uploads/1772443534594-556844802.avif',
      countInStock: 30,
      category: childCategories[0]._id,
      rating: 4.8,
      numReviews: 25,
    },
    {
      name: 'Leather Handbag',
      description: 'Stylish leather handbag',
      price: 1999,
      image: '/uploads/1776922106327-650127630.jpg',
      countInStock: 15,
      category: childCategories[1]._id,
      rating: 4.5,
      numReviews: 12,
    },
    {
      name: 'iPhone 15',
      description: 'Latest Apple smartphone',
      price: 79999,
      image: '/uploads/iphone15.jpg',
      countInStock: 10,
      category: childCategories[2]._id,
      rating: 4.9,
      numReviews: 40,
    },
    {
      name: 'Basic T-Shirt',
      description: 'Cotton t-shirt for everyday wear',
      price: 499,
      image: '/uploads/tshirt.jpg',
      countInStock: 100,
      category: childCategories[3]._id,
      rating: 4.2,
      numReviews: 8,
    },
    {
      name: 'Adidas Sports Shoes',
      description: 'Great for sports and casual wear',
      price: 3499,
      image: '/uploads/sportsshoes.jpg',
      countInStock: 20,
      category: childCategories[4]._id,
      rating: 4.7,
      numReviews: 18,
    },
  ]);

  // 5. Create Orders (each user gets one order)
  await Order.insertMany([
    {
      user: users[1]._id,
      orderItems: [
        { product: products[0]._id, name: products[0].name, qty: 1, price: products[0].price, image: products[0].image },
      ],
      shippingAddress: { address: '123 Main St', city: 'Delhi', postalCode: '110001', country: 'India' },
      paymentMethod: 'COD',
      totalPrice: products[0].price,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: false,
    },
    {
      user: users[2]._id,
      orderItems: [
        { product: products[1]._id, name: products[1].name, qty: 2, price: products[1].price, image: products[1].image },
      ],
      shippingAddress: { address: '456 Park Ave', city: 'Mumbai', postalCode: '400001', country: 'India' },
      paymentMethod: 'Online',
      totalPrice: products[1].price * 2,
      isPaid: false,
      isDelivered: false,
    },
  ]);

  console.log('Demo data imported successfully!');
}

async function main() {
  await connectDB();
  await clearDB();
  await seed();
  mongoose.disconnect();
}

main().catch(err => {
  console.error('Error importing demo data:', err);
  process.exit(1);
});
