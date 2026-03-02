const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const product = require("../controllers/productController");
const user = require("../controllers/userController");
const auth = require("../controllers/authController");
const cart = require("../controllers/cartController");
const order = require("../controllers/orderController");
const category = require("../controllers/categoryController");
const invoice = require("../controllers/invoiceController");

/* USER ROUTES */
router.post("/users", user.createUser);
router.get("/users", user.getUsers);
router.get("/users/:id", user.getUserById);
router.put("/users/:id", user.updateUser);
router.delete("/users/:id", user.deleteUser);

/* PRODUCT ROUTES */
router.post("/products", upload.single("image"), product.createProduct);
router.get("/products", product.getProducts);
router.get("/products/:id", product.getProductById);
router.post("/products/:id", upload.single("image"), product.updateProduct);
router.delete("/products/:id", product.deleteProduct);

/* CART */
router.get("/cart", cart.getCart);
router.post("/cart", cart.addToCart);

/* AUTH */
router.post("/login", auth.login);

/* ORDERS */
router.post("/orders", order.createOrder);
router.get("/orders", order.getOrders);

/* INVOICES */
router.post("/invoices", invoice.createInvoice);
router.get("/invoices", invoice.getInvoices);
router.get("/invoices/:id", invoice.getInvoiceById);

/* CATEGORY ROUTES */
router.post("/categories", category.createCategory);
router.get("/categories", category.getCategories);
router.get("/categories/:id", category.getCategoryById);
router.post("/categories/:id", category.updateCategory);
router.delete("/categories/:id", category.deleteCategory);

module.exports = router;
