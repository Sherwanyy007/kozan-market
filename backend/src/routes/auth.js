const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const router = express.Router()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret123", {
    expiresIn: "30d",
  })
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      city,
      area,
      houseNumber,
      addressDetails,
    } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      city,
      area,
      houseNumber,
      addressDetails,
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      area: user.area,
      houseNumber: user.houseNumber,
      addressDetails: user.addressDetails,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Register failed" })
  }
})

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        area: user.area,
        houseNumber: user.houseNumber,
        addressDetails: user.addressDetails,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(401).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Login failed" })
  }
})

// GET /api/auth/profile/:id
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to fetch profile" })
  }
})

module.exports = router