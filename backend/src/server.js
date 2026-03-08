import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import path from "path"

import authRoutes from "./routes/auth.js"
import productsRoute from "./routes/products.js"
import uploadRoute from "./routes/upload.js"
import orderRoutes from "./routes/orders.js"

import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected"))
.catch(err => console.log(err))

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/upload", uploadRoute)
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")))
app.use("/api/auth", authRoutes)
app.use("/api/orders", orderRoutes)

app.get("/", (req,res)=>{
res.send("Kozan Market API Running")
})

app.listen(process.env.PORT, ()=>{
console.log("Server running on port " + process.env.PORT)
})
// products API
app.use("/api/products", productsRoute);

// images
app.use("/products", express.static(path.join(__dirname, "../public/products")));

