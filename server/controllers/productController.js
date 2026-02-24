const Product = require("../models/Product");

// CREATE
// exports.createProduct = async (req, res) => {
//   const product = await Product.create(req.body);
//   res.json(product);
// };
exports.createProduct = async (req, res) => {
  try {
    // get id from URL (ex: /products/:id)
    const ownerId = req.params.id;

    // basic validation
    const {
      name,
      description,
      price,
      category,
      countInStock,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    // create product
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      countInStock: Number(countInStock) || 0,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      owner: ownerId,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// READ ALL
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// READ ONE
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

// UPDATE
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
};

// DELETE
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
