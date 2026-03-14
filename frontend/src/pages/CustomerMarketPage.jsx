import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import MarketNavbar from "./MarketNavbar";
import BottomNav from "./BottomNav";

import dairyImg from "../assets/categories/dairy.jpg";
import groceriesImg from "../assets/categories/groceries.jpg";
import drinksImg from "../assets/categories/drinks.jpg";
import waterImg from "../assets/categories/water.jpg";
import bakeryImg from "../assets/categories/bakery.jpg";
import fruitsImg from "../assets/categories/fruit.jpg";
import meatImg from "../assets/categories/meat.jpg";
import cheeseYogurtImg from "../assets/categories/cheese-yogurt.jpg";
import frozenFoodImg from "../assets/categories/frozen-food.jpg";
import condimentsImg from "../assets/categories/condiments.jpg";
import disposableItemsImg from "../assets/categories/disposable-items.jpg";
import chipsCrispsImg from "../assets/categories/chips-crisps.jpg";
import icecreamImg from "../assets/categories/icecream.jpg";
import cannedFoodImg from "../assets/categories/canned-food.jpg";
import cleaningSuppliesImg from "../assets/categories/cleaning-supplies.jpg";

import ulkerLogo from "../assets/brands/ulker.jpg";
import pepsiLogo from "../assets/brands/pepsi.jpg";
import cocacolaLogo from "../assets/brands/cocacola.jpg";
import etiLogo from "../assets/brands/eti.jpg";
import laysLogo from "../assets/brands/lays.jpg";
import kalasherLogo from "../assets/brands/kalasher.jpg";
import alenLogo from "../assets/brands/alen.jpg";
import sadiaLogo from "../assets/brands/sadia.jpg";
import mLogo from "../assets/brands/m.jpg";
import altunsaLogo from "../assets/brands/altunsa.jpg";
import tekSutLogo from "../assets/brands/tek-sut.jpg";
import henanLogo from "../assets/brands/henan.jpg";
import almaraiLogo from "../assets/brands/almarai.jpg";
import nawrasLogo from "../assets/brands/nawras.jpg";
import kiriLogo from "../assets/brands/kiri.jpg";
import duruLogo from "../assets/brands/duru.jpg";
import oreoLogo from "../assets/brands/oreo.jpg";
import freezMixLogo from "../assets/brands/freez-mix.jpg";
import headShouldersLogo from "../assets/brands/head-shoulders.jpg";
import nutellaLogo from "../assets/brands/nutella.jpg";

import meatBanner from "../assets/slides/meat-banner.jpg";
import ramadanBanner from "../assets/slides/ramadan-banner.jpg";
import groceryBanner from "../assets/slides/grocery-banner.jpg";

function CustomerMarketPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Erbil");
  const [notes, setNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [fibSenderPhone, setFibSenderPhone] = useState("");
  const [fibTransactionId, setFibTransactionId] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    document.title = "Market | Kozan Market";

    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      });

    const savedAddress = JSON.parse(localStorage.getItem("savedAddress"));
    if (savedAddress) {
      setCustomerName(savedAddress.name || "");
      setPhone(savedAddress.phone || "");
      setAddress(
        savedAddress.street ||
          savedAddress.address ||
          savedAddress.addressDetails ||
          ""
      );
      setCity(savedAddress.city || "Erbil");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const heroSlides = [
    {
      title: "Fresh Meat",
      image: meatBanner,
    },
    {
      title: "Ramadan Mubarak",
      image: ramadanBanner,
    },
    {
      title: "Fresh Grocery",
      image: groceryBanner,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const brands = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ];

  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const categoryCards = [
    { title: "Drinks", image: drinksImg },
    { title: "Water", image: waterImg },
    { title: "Groceries", image: groceriesImg },
    { title: "Dairy", image: dairyImg },
    { title: "Fruits", image: fruitsImg },
    { title: "Bakery", image: bakeryImg },
    { title: "Fresh Meat", image: meatImg },
    { title: "Cheese & Yogurt", image: cheeseYogurtImg },
    { title: "Frozen Food", image: frozenFoodImg },
    { title: "Condiments", image: condimentsImg },
    { title: "Disposable Items", image: disposableItemsImg },
    { title: "Chips & Crisps", image: chipsCrispsImg },
    { title: "Ice Cream", image: icecreamImg },
    { title: "Canned Food", image: cannedFoodImg },
    { title: "Cleaning Supplies", image: cleaningSuppliesImg },
  ];

  const featuredBrands = [
    { name: "Ulker", logo: ulkerLogo },
    { name: "Pepsi", logo: pepsiLogo },
    { name: "Coca Cola", logo: cocacolaLogo },
    { name: "ETi", logo: etiLogo },
    { name: "Lays", logo: laysLogo },
    { name: "Kalasher", logo: kalasherLogo },
    { name: "Alen", logo: alenLogo },
    { name: "Sadia", logo: sadiaLogo },
    { name: "M", logo: mLogo },
    { name: "Altunsa", logo: altunsaLogo },
    { name: "Tek Sut", logo: tekSutLogo },
    { name: "Henan", logo: henanLogo },
    { name: "Almarai", logo: almaraiLogo },
    { name: "Nawras", logo: nawrasLogo },
    { name: "Kiri", logo: kiriLogo },
    { name: "Duru", logo: duruLogo },
    { name: "Oreo", logo: oreoLogo },
    { name: "Freez Mix", logo: freezMixLogo },
    { name: "Head & Shoulders", logo: headShouldersLogo },
    { name: "Nutella", logo: nutellaLogo },
  ];

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchSearch = (product.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchBrand =
        brandFilter === "" ||
        (product.brand || "").toLowerCase() === brandFilter.toLowerCase();

      const matchCategory =
        categoryFilter === "" ||
        (product.category || "").toLowerCase() === categoryFilter.toLowerCase();

      return matchSearch && matchBrand && matchCategory;
    });

    return [...result].sort((a, b) => {
      if (sortOption === "price-low-high") {
        return (a.price || 0) - (b.price || 0);
      }

      if (sortOption === "price-high-low") {
        return (b.price || 0) - (a.price || 0);
      }

      if (sortOption === "name-a-z") {
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortOption === "name-z-a") {
        return (b.name || "").localeCompare(a.name || "");
      }

      return 0;
    });
  }, [products, search, brandFilter, categoryFilter, sortOption]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  const fibReference = useMemo(() => {
    const cleanPhone = (phone || "").replace(/\D/g, "") || "NO-PHONE";
    return `KOZAN-${cleanPhone}`;
  }, [phone]);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.productId === product._id);

    if (existingItem) {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          qty: 1,
          weight: product.weight || "",
        },
      ]);
    }
  };

  const placeOrder = async () => {
    try {
      if (placingOrder) return;

      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      if (!customerName.trim()) {
        alert("Please enter customer name");
        return;
      }

      if (!phone.trim()) {
        alert("Please enter phone number");
        return;
      }

      if (!address.trim()) {
        alert("Please enter address");
        return;
      }

      if (paymentMethod === "fib" && !fibSenderPhone.trim()) {
        alert("Please enter your FIB sender phone");
        return;
      }

      if (paymentMethod === "fib" && !fibTransactionId.trim()) {
        alert("Please enter FIB transaction reference");
        return;
      }

      setPlacingOrder(true);

      const savedAddress = JSON.parse(localStorage.getItem("savedAddress"));

      const orderData = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim() || "Erbil",
        notes: notes.trim(),
        paymentMethod,
        paymentStatus: "pending",
        orderItems: cart,
        totalPrice,

        addressType: savedAddress?.addressType || "",
        buildingName: savedAddress?.buildingName || "",
        apartmentNumber: savedAddress?.apartmentNumber || "",
        floor: savedAddress?.floor || "",
        street: savedAddress?.street || address.trim(),
        additionalDirections: savedAddress?.additionalDirections || "",
        lat: savedAddress?.lat ?? null,
        lng: savedAddress?.lng ?? null,
        googleMapsLink: savedAddress?.googleMapsLink || "",

        fibSenderPhone: paymentMethod === "fib" ? fibSenderPhone.trim() : "",
        fibTransactionId:
          paymentMethod === "fib" ? fibTransactionId.trim() : "",
        fibReference: paymentMethod === "fib" ? fibReference : "",
        fibPaymentId: "",
        fibPaymentUrl: "",
        fibQrCode: "",
      };

      const res = await axios.post("http://localhost:5000/api/orders", orderData);

      setCart([]);
      setCustomerName("");
      setPhone("");
      setAddress("");
      setCity("Erbil");
      setNotes("");
      setPaymentMethod("cash");
      setFibSenderPhone("");
      setFibTransactionId("");

      localStorage.removeItem("cart");

      navigate(`/order/${res.data._id}`);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #eef7ff 0%, #f8fafc 45%, #f8fafc 100%)",
        paddingBottom: "110px",
      }}
    >
      <MarketNavbar />

      <div style={{ maxWidth: "1220px", margin: "0 auto", padding: "20px" }}>
        <div
          style={{
            position: "relative",
            borderRadius: "32px",
            overflow: "hidden",
            height: "300px",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
            marginBottom: "24px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              background: "#ffffff",
            }}
          />

          <button onClick={goToPrevSlide} style={heroArrowLeftStyle}>
            ‹
          </button>

          <button onClick={goToNextSlide} style={heroArrowRightStyle}>
            ›
          </button>

          <div
            style={{
              position: "absolute",
              bottom: "18px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "10px",
              background: "rgba(255,255,255,0.78)",
              padding: "8px 12px",
              borderRadius: "999px",
              backdropFilter: "blur(8px)",
            }}
          >
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: currentSlide === index ? "26px" : "10px",
                  height: "10px",
                  borderRadius: "999px",
                  border: "none",
                  background: currentSlide === index ? "#0f172a" : "#cbd5e1",
                  cursor: "pointer",
                  transition: "0.25s",
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            borderRadius: "24px",
            padding: "22px",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
            marginBottom: "22px",
            border: "1px solid #edf2f7",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            <input
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />

            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Brands</option>
              {brands.map((brand, i) => (
                <option key={i} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Categories</option>
              {categories.map((category, i) => (
                <option key={i} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={inputStyle}
            >
              <option value="">Sort By</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-a-z">Name: A-Z</option>
              <option value="name-z-a">Name: Z-A</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "14px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "30px", color: "#0f172a" }}>
              Categories
            </h2>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/brands")}
                style={{
                  padding: "12px 18px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(135deg,#14b8a6,#2563eb)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "800",
                }}
              >
                Browse Brands
              </button>

              <button
                onClick={() => setCategoryFilter("")}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid #dbe4ee",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: "700",
                  color: "#334155",
                }}
              >
                Clear Category
              </button>

              <button
                onClick={() => setShowAllCategories((prev) => !prev)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#14b8a6",
                  cursor: "pointer",
                  fontWeight: "800",
                  fontSize: "18px",
                }}
              >
                {showAllCategories ? "Show less" : "Show all"}
              </button>
            </div>
          </div>

          {showAllCategories ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: "16px",
              }}
            >
              {categoryCards.map((item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCategoryFilter(
                      categoryFilter === item.title ? "" : item.title
                    )
                  }
                  style={{
                    background:
                      categoryFilter === item.title
                        ? "linear-gradient(135deg, #14b8a6, #2563eb)"
                        : "white",
                    color: categoryFilter === item.title ? "white" : "#0f172a",
                    border: "1px solid #e2e8f0",
                    borderRadius: "24px",
                    padding: "14px",
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "120px",
                      borderRadius: "18px",
                      overflow: "hidden",
                      marginBottom: "12px",
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontWeight: "800",
                      fontSize: "17px",
                      textAlign: "center",
                    }}
                  >
                    {item.title}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                paddingBottom: "8px",
                scrollbarWidth: "thin",
              }}
            >
              {categoryCards.map((item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCategoryFilter(
                      categoryFilter === item.title ? "" : item.title
                    )
                  }
                  style={{
                    minWidth: "220px",
                    background:
                      categoryFilter === item.title
                        ? "linear-gradient(135deg, #14b8a6, #2563eb)"
                        : "white",
                    color: categoryFilter === item.title ? "white" : "#0f172a",
                    border: "1px solid #e2e8f0",
                    borderRadius: "24px",
                    padding: "14px",
                    cursor: "pointer",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "120px",
                      borderRadius: "18px",
                      overflow: "hidden",
                      marginBottom: "12px",
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontWeight: "800",
                      fontSize: "17px",
                      textAlign: "center",
                    }}
                  >
                    {item.title}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "14px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "30px", color: "#0f172a" }}>
              Brands
            </h2>

            <button
              onClick={() => navigate("/brands")}
              style={{
                background: "transparent",
                border: "none",
                color: "#14b8a6",
                cursor: "pointer",
                fontWeight: "800",
                fontSize: "18px",
              }}
            >
              Show all
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "8px",
              scrollbarWidth: "thin",
            }}
          >
            {featuredBrands.map((brand, index) => (
              <button
                key={index}
                onClick={() =>
                  navigate(`/brands/${encodeURIComponent(brand.name)}`)
                }
                style={{
                  minWidth: "220px",
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "24px",
                  padding: "14px",
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    borderRadius: "18px",
                    overflow: "hidden",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #eef2f7",
                    marginBottom: "12px",
                  }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div
                  style={{
                    fontWeight: "800",
                    fontSize: "18px",
                    color: "#0f172a",
                    textAlign: "center",
                  }}
                >
                  {brand.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "32px", color: "#0f172a" }}>
              Products
            </h2>
            <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
              {filteredProducts.length} product(s) found
            </p>
          </div>

          <button
            onClick={() => navigate("/cart")}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              border: "none",
              background: "#14b8a6",
              color: "white",
              cursor: "pointer",
              fontWeight: "800",
              boxShadow: "0 10px 20px rgba(20,184,166,0.18)",
            }}
          >
            Go To Cart ({cartCount})
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
              border: "1px solid #eef2f7",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0f172a", fontSize: "24px" }}>
              No matching products found
            </h3>
            <p style={{ color: "#64748b", marginBottom: 0, lineHeight: 1.7 }}>
              Try changing search words, filters, or sorting options.
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "18px",
              }}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  style={{
                    background: "white",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.07)",
                    border: "1px solid #eef2f7",
                  }}
                >
                  <Link
                    to={`/product/${product._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        height: "230px",
                        background:
                          "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "18px",
                      }}
                    >
                      <img
                        src={`http://localhost:5000${product.imageUrl}`}
                        alt={product.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <div style={{ padding: "18px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          flexWrap: "wrap",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            background: "#eff6ff",
                            color: "#2563eb",
                            padding: "7px 11px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: "800",
                          }}
                        >
                          {product.category || "General"}
                        </span>

                        <span
                          style={{
                            background: "#f8fafc",
                            color: "#475569",
                            padding: "7px 11px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {product.brand || "N/A"}
                        </span>
                      </div>

                      <h3
                        style={{
                          margin: "0 0 10px 0",
                          fontSize: "22px",
                          color: "#0f172a",
                          minHeight: "54px",
                        }}
                      >
                        {product.name}
                      </h3>

                      <p
                        style={{
                          margin: "0 0 8px 0",
                          color: "#14b8a6",
                          fontWeight: "800",
                          fontSize: "22px",
                        }}
                      >
                        {product.price} IQD
                      </p>

                      <p
                        style={{
                          margin: "0 0 10px 0",
                          color: "#475569",
                          minHeight: "42px",
                          lineHeight: "1.6",
                          fontSize: "14px",
                        }}
                      >
                        {product.description || "No description available"}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          flexWrap: "wrap",
                          fontSize: "13px",
                          color: "#64748b",
                        }}
                      >
                        <span>Stock: {product.countInStock ?? 0}</span>
                        <span>{product.weight || "Standard"}</span>
                      </div>
                    </div>
                  </Link>

                  <div style={{ padding: "0 18px 18px 18px" }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        border: "none",
                        background: "linear-gradient(135deg,#14b8a6,#2563eb)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "800",
                        boxShadow: "0 10px 20px rgba(37,99,235,0.14)",
                      }}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#0f172a",
                color: "white",
                padding: "14px 22px",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                zIndex: 9999,
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontWeight: "bold" }}>🛒 {cartCount} items</div>
              <div>{totalPrice} IQD</div>

              <button
                onClick={() => navigate("/cart")}
                style={{
                  background: "#22c55e",
                  border: "none",
                  color: "white",
                  padding: "9px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "800",
                }}
              >
                View Cart
              </button>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "26px",
                marginTop: "28px",
                padding: "24px",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
                border: "1px solid #eef2f7",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, color: "#0f172a", fontSize: "30px" }}>
                    Quick Checkout
                  </h2>
                  <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
                    Complete your order quickly from here
                  </p>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "999px",
                    padding: "8px 14px",
                    fontSize: "13px",
                    color: "#475569",
                    fontWeight: "700",
                  }}
                >
                  {cartCount} item(s) • {totalPrice} IQD
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: "12px",
                  marginBottom: "14px",
                }}
              >
                <input
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={checkoutInputStyle}
                />

                <input
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={checkoutInputStyle}
                />

                <input
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={checkoutInputStyle}
                />

                <input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={checkoutInputStyle}
                />

                <input
                  placeholder="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={checkoutInputStyle}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    color: "#0f172a",
                    fontWeight: "800",
                    fontSize: "18px",
                  }}
                >
                  Payment Methods
                </p>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    style={{
                      minWidth: "170px",
                      padding: "16px 18px",
                      borderRadius: "18px",
                      border:
                        paymentMethod === "cash"
                          ? "2px solid #0f172a"
                          : "1px solid #dbe4ee",
                      background:
                        paymentMethod === "cash" ? "#f8fafc" : "white",
                      cursor: "pointer",
                      fontWeight: "800",
                      fontSize: "18px",
                      color: "#0f172a",
                    }}
                  >
                    💵 Cash
                  </button>

                  <button
                    onClick={() => setPaymentMethod("fib")}
                    style={{
                      minWidth: "170px",
                      padding: "16px 18px",
                      borderRadius: "18px",
                      border:
                        paymentMethod === "fib"
                          ? "2px solid #0f766e"
                          : "1px solid #dbe4ee",
                      background:
                        paymentMethod === "fib" ? "#ecfdf5" : "white",
                      cursor: "pointer",
                      fontWeight: "800",
                      fontSize: "18px",
                      color: "#0f172a",
                    }}
                  >
                    🏦 FIB
                  </button>
                </div>
              </div>

              {paymentMethod === "fib" && (
                <div
                  style={{
                    border: "1px solid #b7e4d8",
                    background: "#f7fffb",
                    borderRadius: "22px",
                    padding: "18px",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 14px 0",
                      color: "#0f172a",
                      fontSize: "18px",
                    }}
                  >
                    FIB Payment Details
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={fibInfoCardStyle}>
                      <p style={fibLabelStyle}>Account Name</p>
                      <strong style={fibValueStyle}>Kozan Market</strong>
                    </div>

                    <div style={fibInfoCardStyle}>
                      <p style={fibLabelStyle}>FIB Phone</p>
                      <strong style={fibValueStyle}>+9647509099712</strong>
                    </div>

                    <div style={fibInfoCardStyle}>
                      <p style={fibLabelStyle}>Amount</p>
                      <strong style={fibValueStyle}>{totalPrice} IQD</strong>
                    </div>

                    <div style={fibInfoCardStyle}>
                      <p style={fibLabelStyle}>Reference</p>
                      <strong style={{ ...fibValueStyle, fontSize: "19px" }}>
                        {fibReference}
                      </strong>
                    </div>
                  </div>

                  <div
                    style={{
                      border: "1px dashed #9ccfbe",
                      background: "#f1fbf6",
                      color: "#0f172a",
                      borderRadius: "16px",
                      padding: "14px 16px",
                      marginBottom: "12px",
                      lineHeight: "1.8",
                      fontSize: "14px",
                    }}
                  >
                    Send the payment to the FIB number above, then enter your
                    sender phone number and the transaction reference below.
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    <input
                      placeholder="FIB sender phone"
                      value={fibSenderPhone}
                      onChange={(e) => setFibSenderPhone(e.target.value)}
                      style={checkoutInputStyle}
                    />

                    <input
                      placeholder="FIB transaction ID / reference"
                      value={fibTransactionId}
                      onChange={(e) => setFibTransactionId(e.target.value)}
                      style={checkoutInputStyle}
                    />
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginTop: "14px",
                }}
              >
                <div>
                  <p style={{ margin: 0, color: "#64748b" }}>Cart Total</p>
                  <h3 style={{ margin: "6px 0 0 0", color: "#0f172a" }}>
                    {totalPrice} IQD
                  </h3>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => navigate("/cart")}
                    style={{
                      padding: "13px 16px",
                      borderRadius: "14px",
                      border: "1px solid #dbe4ee",
                      background: "white",
                      cursor: "pointer",
                      fontWeight: "700",
                    }}
                  >
                    Review Cart
                  </button>

                  <button
                    onClick={placeOrder}
                    disabled={placingOrder}
                    style={{
                      padding: "13px 18px",
                      borderRadius: "14px",
                      border: "none",
                      background:
                        paymentMethod === "fib"
                          ? "linear-gradient(135deg,#14b8a6,#2563eb)"
                          : "#0f172a",
                      color: "white",
                      cursor: placingOrder ? "not-allowed" : "pointer",
                      fontWeight: "800",
                      opacity: placingOrder ? 0.7 : 1,
                    }}
                  >
                    {placingOrder
                      ? "Processing..."
                      : paymentMethod === "fib"
                      ? "Place FIB Order"
                      : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

const inputStyle = {
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #dbe4ee",
  outline: "none",
  fontSize: "15px",
  background: "white",
};

const checkoutInputStyle = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #dbe4ee",
  outline: "none",
  fontSize: "15px",
  background: "white",
};

const fibInfoCardStyle = {
  background: "white",
  border: "1px solid #dcf2e8",
  borderRadius: "16px",
  padding: "14px 16px",
};

const fibLabelStyle = {
  margin: "0 0 6px 0",
  color: "#64748b",
  fontSize: "13px",
};

const fibValueStyle = {
  color: "#0f172a",
  fontSize: "22px",
  fontWeight: "800",
};

const heroArrowLeftStyle = {
  position: "absolute",
  left: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,0.85)",
  color: "#0f172a",
  fontSize: "20px",
  fontWeight: "900",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(0,0,0,0.16)",
};

const heroArrowRightStyle = {
  position: "absolute",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,0.85)",
  color: "#0f172a",
  fontSize: "20px",
  fontWeight: "900",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(0,0,0,0.16)",
};

export default CustomerMarketPage;