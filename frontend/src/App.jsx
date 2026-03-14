import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";

function App() {

const [products, setProducts] = useState([])
const [name, setName] = useState("")
const [price, setPrice] = useState("")
const [file, setFile] = useState(null)
const [description, setDescription] = useState("")
const [brand, setBrand] = useState("")
const [countInStock, setCountInStock] = useState("")
const [editingId, setEditingId] = useState(null)
const [search, setSearch] = useState("")
const [brandFilter, setBrandFilter] = useState("")
const [category, setCategory] = useState("")
const [categoryFilter, setCategoryFilter] = useState("")
const [sortOption, setSortOption] = useState("")
const [cart, setCart] = useState([])
const [customerName, setCustomerName] = useState("")
const [phone, setPhone] = useState("")
const [address, setAddress] = useState("")
const [city, setCity] = useState("Erbil")
const [notes, setNotes] = useState("")
const [paymentMethod, setPaymentMethod] = useState("cash")
const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
const navigate = useNavigate();



const placeOrder = async () => {
  try {
    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    const savedAddress = JSON.parse(localStorage.getItem("savedAddress"))
    localStorage.removeItem("cart")

    const orderData = {
      customerName,
      phone: savedAddress?.phone || phone,
      address: savedAddress?.street || address,
      city,
      notes,
      paymentMethod,
      orderItems: cart,
      totalPrice,

      addressType: savedAddress?.addressType || "",
      buildingName: savedAddress?.buildingName || "",
      apartmentNumber: savedAddress?.apartmentNumber || "",
      floor: savedAddress?.floor || "",
      street: savedAddress?.street || "",
      additionalDirections: savedAddress?.additionalDirections || "",
      lat: savedAddress?.lat || null,
      lng: savedAddress?.lng || null,
      googleMapsLink: savedAddress?.googleMapsLink || "",
    }

    const res = await axios.post("http://localhost:5000/api/orders", orderData)

    console.log(res.data)
alert("Order placed successfully")
setCart([])
setCustomerName("")
setPhone("")
setAddress("")
setCity("Erbil")
setNotes("")
localStorage.removeItem("cart")
navigate("/market")
  } catch (error) {
    console.log(error)
    alert("Failed to place order")
  }
}

const addToCart = (product) => {
  const existingItem = cart.find((item) => item.productId === product._id)
  

  if (existingItem) {
    setCart(
      cart.map((item) =>
        item.productId === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    )
  } else {
    setCart([
      ...cart,
      {
        productId: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        qty: 1,
      },
    ])
  }
}

const startEdit = (product) => {
  setEditingId(product._id)
  setName(product.name)
  setPrice(product.price)
  setDescription(product.description || "")
  setBrand(product.brand || "")
  setCountInStock(product.countInStock || "")
  setCategory(product.category || "")
}

const updateProduct = async () => {
  try {
    let updatedImageUrl = ""

    // ئەگەر فایل هەڵبژێردرا
    if (file) {
      const formData = new FormData()
      formData.append("image", file)

      const uploadRes = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      updatedImageUrl = uploadRes.data.imageUrl
    }

    // ئەگەر فایل نوێ نەبوو، وێنەی کۆن بمێنێتەوە
    const currentProduct = products.find((p) => p._id === editingId)

    await axios.put(`http://localhost:5000/api/products/${editingId}`, {
      name: name,
      price: Number(price),
      imageUrl: updatedImageUrl || currentProduct.imageUrl,
      description: description,
      brand: brand,
      category: category,
      countInStock: Number(countInStock),
    })

    // دووبارە product ـەکان بێنەوە
    const res = await axios.get("http://localhost:5000/api/products")
    setProducts(res.data)

    // reset
    setEditingId(null)
    setName("")
    setPrice("")
    setDescription("")
    setBrand("")
    setCategory("")
    setCountInStock("")
    setFile(null)
  } catch (error) {
    console.log(error)
  }
}

// ✅ addProduct لە دەرەوەی useEffect
const deleteProduct = async (id) => {
  try {

    await axios.delete(`http://localhost:5000/api/products/${id}`)

    setProducts(products.filter((product) => product._id !== id))

  } catch (error) {
    console.log(error)
  }
}

const addProduct = async () => {
  try {
    let imageUrl = ""

    if (file) {
      const formData = new FormData()
      formData.append("image", file)

      const uploadRes = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      imageUrl = uploadRes.data.imageUrl
    }


     const res = await axios.post("http://localhost:5000/api/products", {
  name: name,
  price: Number(price),
  imageUrl: imageUrl,
  description: description,
  brand: brand,
  category: category,
  countInStock: Number(countInStock),
})

    setProducts([...products, res.data])

    setName("")
    setPrice("")
    setDescription("")
    setBrand("")
    setCountInStock("")
    setFile(null)
  } catch (error) {
    console.log(error)
  }
}

useEffect(() => {

  axios.get("http://localhost:5000/api/products")
  .then((res)=>{
    setProducts(res.data)
  })
  .catch((err)=>{
    console.log(err)
  })

}, [])

const filteredProducts = products.filter((product) => {
  const matchSearch = product.name
    .toLowerCase()
    .includes(search.toLowerCase())

  const matchBrand =
    brandFilter === "" || product.brand === brandFilter
    const matchCategory =
  categoryFilter === "" || product.category === categoryFilter

  return matchSearch && matchBrand && matchCategory
})

const sortedProducts = [...filteredProducts].sort((a, b) => {
  if (sortOption === "price-low-high") {
    return a.price - b.price
  }

  if (sortOption === "price-high-low") {
    return b.price - a.price
  }

  if (sortOption === "name-a-z") {
    return a.name.localeCompare(b.name)
  }

  if (sortOption === "name-z-a") {
    return b.name.localeCompare(a.name)
  }

  return 0
})

const brands = [...new Set(products.map((product) => product.brand).filter(Boolean))]
const categories = [...new Set(products.map((product) => product.category).filter(Boolean))]
return (

  <div className="app">
    <h1 className="title">Kozan Market</h1>

    <div className="form-box">
      <div className="form-grid">
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <input
          placeholder="Count In Stock"
          value={countInStock}
          onChange={(e) => setCountInStock(e.target.value)}
        />

        <input
  placeholder="Search product..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<select
  value={brandFilter}
  onChange={(e) => setBrandFilter(e.target.value)}
>
  <option value="">All Brands</option>

  {brands.map((b, i) => (
    <option key={i} value={b}>
      {b}
    </option>
  ))}
</select>

<input
  placeholder="Category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
/>

<select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
  <option value="">All Categories</option>
  {categories.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>

<select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
  <option value="">Sort By</option>
  <option value="price-low-high">Price: Low to High</option>
  <option value="price-high-low">Price: High to Low</option>
  <option value="name-a-z">Name: A to Z</option>
  <option value="name-z-a">Name: Z to A</option>
</select>

<div className="checkout-box">
  <h2>Checkout</h2>

  <input
    placeholder="Customer Name"
    value={customerName}
    onChange={(e) => setCustomerName(e.target.value)}
  />

  <input
    placeholder="Phone Number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
  />

  <input
    placeholder="Address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
  />

  <input
    placeholder="City"
    value={city}
    onChange={(e) => setCity(e.target.value)}
  />

  <input
    placeholder="Notes"
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
  />

  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
    <option value="cash">Cash on Delivery</option>
    <option value="fib">Pay with FIB</option>
  </select>

  <h3>Cart Items</h3>

  {cart.length === 0 ? (
    <p>Cart is empty</p>
  ) : (
    cart.map((item, index) => (
      <div key={index}>
        <span>{item.name}</span> - <span>{item.qty}</span> x <span>{item.price} IQD</span>
        <button onClick={placeOrder}>Place Order</button>
      </div>
    ))
  )}

  <h3>Total: {totalPrice} IQD</h3>
</div>

        <button onClick={editingId ? updateProduct : addProduct}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>
    </div>

    {filteredProducts.length === 0 ? (
  <p className="no-products">No matching products found.</p>
) : (
      <div className="products-grid">
        {sortedProducts.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={`http://localhost:5000${product.imageUrl}`}
              alt={product.name}
            />

            <h3>{product.name}</h3>
            <p className="price">{product.price} IQD</p>
            <p>Category: {product.category}</p>

            <p className="meta">{product.description}</p>
            <p className="meta">Brand: {product.brand}</p>
            <p className="stock">In Stock: {product.countInStock}</p>

            <div className="actions">
              <button
                className="delete-btn"
                onClick={() => deleteProduct(product._id)}
              >
                Delete
              </button>

              <button
                className="edit-btn"
                onClick={() => startEdit(product)}
              >
                Edit
              </button>
              <button onClick={() => addToCart(product)}>Add To Cart</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)
}
  
  export default App
