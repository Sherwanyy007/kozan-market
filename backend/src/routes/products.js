const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Product = require("../models/product");

// GET /api/products
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// POST /api/products  (add product)
router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();

  res.json({ message: "Product deleted successfully" });
});

router.put("/test-put", (req, res) => {
  res.json({ message: "PUT route works" });
});

router.put("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }


product.name = req.body.name ?? product.name;
product.price = req.body.price ?? product.price;
product.description = req.body.description ?? product.description;
product.brand = req.body.brand ?? product.brand;
product.countInStock = req.body.countInStock ?? product.countInStock;

  const updatedProduct = await product.save();

  res.json(updatedProduct);
});


module.exports = router;
