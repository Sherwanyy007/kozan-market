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

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.json({ message: "Password reset successful" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

const crypto = require("crypto")

router.post("/forgot-password", async (req, res) => {

  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const resetToken = crypto.randomBytes(32).toString("hex")

  user.resetPasswordToken = resetToken
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  await user.save()

  const resetUrl =
    `http://localhost:5173/reset-password/${resetToken}`

  console.log("RESET LINK:", resetUrl)

  res.json({
    message: "Reset link generated",
  })
})

router.put("/save-address/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const {
      area,
      addressType,
      buildingName,
      apartmentNumber,
      floor,
      street,
      phone,
      additionalDirections,
      lat,
      lng,
      googleMapsLink,
    } = req.body

    user.area = area || user.area
    user.addressType = addressType || user.addressType
    user.buildingName = buildingName || user.buildingName
    user.apartmentNumber = apartmentNumber || user.apartmentNumber
    user.floor = floor || user.floor
    user.street = street || user.street
    user.phone = phone || user.phone
    user.additionalDirections = additionalDirections || user.additionalDirections
    user.lat = lat ?? user.lat
    user.lng = lng ?? user.lng
    user.googleMapsLink = googleMapsLink || user.googleMapsLink

    const updatedUser = await user.save()

    res.json({
      message: "Address saved successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to save address" })
  }
})

module.exports = router