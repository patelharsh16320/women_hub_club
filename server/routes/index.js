const express = require("express");
const router = express.Router();

const product = require("../controllers/productController");
const user = require("../controllers/userController");
const cart = require("../controllers/cartController");
const order = require("../controllers/orderController");
const category = require("../controllers/categoryController");

/* PRODUCT ROUTES */
router.post("/products", product.createProduct);
router.get("/products", product.getProducts);
router.get("/products/:id", product.getProductById);
router.post("/products/:id", product.updateProduct);
router.delete("/products/:id", product.deleteProduct);

/* USER ROUTES */
router.post("/users/register", user.registerUser);
router.get("/users", user.getUsers);

/* CART */
router.get("/cart", cart.getCart);
router.post("/cart", cart.addToCart);

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