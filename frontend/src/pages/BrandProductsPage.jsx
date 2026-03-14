import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import MarketNavbar from "./MarketNavbar";
import BottomNav from "./BottomNav";

function BrandProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();
  const { brandName } = useParams();

  const decodedBrand = decodeURIComponent(brandName || "");

  useEffect(() => {
    document.title = `${decodedBrand} | Kozan Market`;

    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.log(err));

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, [decodedBrand]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const brandProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const sameBrand =
        (product.brand || "").toLowerCase().trim() ===
        decodedBrand.toLowerCase().trim();

      const matchSearch = (product.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      return sameBrand && matchSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortOption === "price-low-high") return (a.price || 0) - (b.price || 0);
      if (sortOption === "price-high-low") return (b.price || 0) - (a.price || 0);
      if (sortOption === "name-a-z") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortOption === "name-z-a") {
        return (b.name || "").localeCompare(a.name || "");
      }
      return 0;
    });
  }, [products, decodedBrand, search, sortOption]);

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
            background: "linear-gradient(135deg, #0f766e, #2563eb)",
            borderRadius: "30px",
            padding: "32px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            boxShadow: "0 18px 40px rgba(37, 99, 235, 0.18)",
            marginBottom: "24px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "180px",
              height: "180px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-70px",
              left: "-20px",
              width: "160px",
              height: "160px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "50%",
            }}
          />

          <div style={{ maxWidth: "650px", position: "relative", zIndex: 1 }}>
            <p
              style={{
                margin: "0 0 10px 0",
                opacity: 0.9,
                fontSize: "14px",
                fontWeight: "800",
                letterSpacing: "1px",
              }}
            >
              BRAND PRODUCTS
            </p>

            <h1
              style={{
                margin: "0 0 12px 0",
                fontSize: "42px",
                lineHeight: 1.12,
                fontWeight: "900",
              }}
            >
              {decodedBrand}
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: "16px",
                opacity: 0.95,
                lineHeight: 1.7,
                maxWidth: "560px",
              }}
            >
              Browse all available products from this brand and add your favorite
              items directly to cart.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: "24px",
              padding: "20px 24px",
              minWidth: "250px",
              backdropFilter: "blur(10px)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p style={{ margin: 0, opacity: 0.88, fontSize: "14px" }}>
              Cart Summary
            </p>

            <h2 style={{ margin: "8px 0 6px 0", fontSize: "34px" }}>
              {cartCount} items
            </h2>

            <p style={{ margin: 0, fontSize: "17px", opacity: 0.95 }}>
              Total: {totalPrice} IQD
            </p>

            <button
              onClick={() => navigate("/cart")}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "14px",
                border: "none",
                background: "white",
                color: "#0f172a",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              Open Cart
            </button>
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
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />

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

          <button
            onClick={() => navigate("/brands")}
            style={secondaryButtonStyle}
          >
            Back to Brands
          </button>

          <button
            onClick={() => navigate("/market")}
            style={primaryButtonStyle}
          >
            Back to Market
          </button>
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
              {decodedBrand} Products
            </h2>
            <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
              {brandProducts.length} product(s) found
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

        {brandProducts.length === 0 ? (
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
              No products found
            </h3>
            <p style={{ color: "#64748b", marginBottom: 0, lineHeight: 1.7 }}>
              This brand currently has no matching products.
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
              {brandProducts.map((product) => (
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
          </div>
        )}

        <BottomNav />
      </div>
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

const primaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg,#14b8a6,#2563eb)",
  color: "white",
  cursor: "pointer",
  fontWeight: "800",
};

const secondaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #dbe4ee",
  background: "white",
  color: "#0f172a",
  cursor: "pointer",
  fontWeight: "800",
};

export default BrandProductsPage;