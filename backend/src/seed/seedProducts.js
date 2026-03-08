// backend/src/seed/seedProducts.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/product");

const products = [

  {
  name: "Monster Drink",
  price: 3500,
  imageUrl: "/products/monster.jpg",
  category: "Drink",
  inStock: true,
},
  {
    name: "RedBull",
    price: 2500,
    imageUrl: "/products/redbull.jpg",
    category: "Drink",
    inStock: true,
  },
  {
    name: "Pepsi Qazm",
    price: 250,
    imageUrl: "/products/pepsi.jpg",
    category: "Drink",
    inStock: true,
  },
  {
    name: "AquaFina Water",
    price: 6750,
    imageUrl: "/products/aquafina.jpg",
    category: "Drink",
    inStock: true,
  },
  {
    name: "popcake Banana",
    price: 250,
    imageUrl: "/products/popcake.jpg",
    category: "Snack",
    inStock: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany({}); // پاککردنەوەی کۆنەکان (ئەگەر ناتەوێت، ئەمە بسڕەوە)
    await Product.insertMany(products);

    console.log("Products seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
