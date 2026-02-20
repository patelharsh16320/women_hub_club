const express = require("express");
const router = express.Router();

const product = require("../controllers/productController");
const user = require("../controllers/userController");
const auth = require("../controllers/authController");
const cart = require("../controllers/cartController");
const order = require("../controllers/orderController");
const category = require("../controllers/categoryController");

/* USER ROUTES */
router.post("/users", user.createUser);       // Create user
router.get("/users", user.getUsers);          // Get all users
router.get("/users/:id", user.getUserById);  // Get single user
router.put("/users/:id", user.updateUser);   // Update user
router.delete("/users/:id", user.deleteUser); // Delete user

/* PRODUCT ROUTES */
router.post("/products", product.createProduct);
router.get("/products", product.getProducts);
router.get("/products/:id", product.getProductById);
router.post("/products/:id", product.updateProduct);
router.delete("/products/:id", product.deleteProduct);

/* CART */
router.get("/cart", cart.getCart);
router.post("/cart", cart.addToCart);

/* AUTH */
router.post("/login", auth.login);

/* ORDERS */
router.post("/orders", order.createOrder);
router.get("/orders", order.getOrders);

/* CATEGORY ROUTES */
router.post("/categories", category.createCategory);
router.get("/categories", category.getCategories);
router.get("/categories/:id", category.getCategoryById);
router.post("/categories/:id", category.updateCategory);
router.delete("/categories/:id", category.deleteCategory);

module.exports = router;
