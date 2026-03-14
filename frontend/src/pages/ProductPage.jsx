import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState("1");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    document.title = "Product | Kozan Market";
  }, [id]);

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;

    let finalPrice = Number(product.price);
    let weightLabel = "";

    if (product.unit === "kg") {
      finalPrice = Number(product.price) * Number(selectedWeight);
      weightLabel = `${selectedWeight} KG`;
    }

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = savedCart.find(
      (item) =>
        item.productId === product._id &&
        (item.weight || "") === weightLabel
    );

    let updatedCart = [];

    if (existingItem) {
      updatedCart = savedCart.map((item) =>
        item.productId === product._id &&
        (item.weight || "") === weightLabel
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...savedCart,
        {
          productId: product._id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: finalPrice,
          qty: 1,
          weight: weightLabel,
          unit: product.unit || "piece",
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Added to cart successfully");
  };

  if (!product) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "white",
          borderRadius: "28px",
          padding: "28px",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
        }}
      >
        <button
          onClick={() => navigate("/market")}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            border: "none",
            background: "#0f172a",
            color: "white",
            cursor: "pointer",
            marginBottom: "22px",
            fontWeight: "700",
          }}
        >
          Back
        </button>

        <div
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              flex: "1 1 360px",
              background: "#f8fafc",
              borderRadius: "24px",
              minHeight: "420px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e2e8f0",
            }}
          >
            <img
              src={`http://localhost:5000${product.imageUrl}`}
              alt={product.name}
              style={{
                maxWidth: "100%",
                maxHeight: "380px",
                objectFit: "contain",
              }}
            />
          </div>

          <div style={{ flex: "1 1 420px" }}>
            <p
              style={{
                margin: 0,
                color: "#14b8a6",
                fontWeight: "800",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "13px",
              }}
            >
              Kozan Market
            </p>

            <h1
              style={{
                margin: "12px 0 10px",
                fontSize: "42px",
                color: "#0f172a",
              }}
            >
              {product.name}
            </h1>

            <h2
              style={{
                margin: "0 0 16px",
                fontSize: "34px",
                color: "#14b8a6",
              }}
            >
              {product.unit === "kg"
                ? `${Number(product.price).toLocaleString()} IQD / 1 KG`
                : `${Number(product.price).toLocaleString()} IQD`}
            </h2>

            <p
              style={{
                margin: "0 0 14px",
                color: "#475569",
                fontSize: "16px",
                lineHeight: "1.8",
              }}
            >
              {product.description || "No description available"}
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  background: "#ecfeff",
                  color: "#0f766e",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                Brand: {product.brand || "General"}
              </span>

              <span
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                Category: {product.category || "General"}
              </span>

              <span
                style={{
                  background: "#f8fafc",
                  color: "#334155",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontWeight: "700",
                  fontSize: "14px",
                  border: "1px solid #e2e8f0",
                }}
              >
                Stock: {product.countInStock}
              </span>
            </div>

            {product.unit === "kg" && (
              <div style={{ marginTop: "26px", marginBottom: "26px" }}>
                <h3
                  style={{
                    margin: "0 0 14px",
                    color: "#0f172a",
                    fontSize: "22px",
                  }}
                >
                  Choose Weight
                </h3>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedWeight("0.25")}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border:
                        selectedWeight === "0.25"
                          ? "2px solid #14b8a6"
                          : "1px solid #dbe4ee",
                      background:
                        selectedWeight === "0.25" ? "#ecfeff" : "white",
                      color: "#0f172a",
                      cursor: "pointer",
                      fontWeight: "800",
                    }}
                  >
                    0.25 KG
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWeight("0.5")}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border:
                        selectedWeight === "0.5"
                          ? "2px solid #14b8a6"
                          : "1px solid #dbe4ee",
                      background:
                        selectedWeight === "0.5" ? "#ecfeff" : "white",
                      color: "#0f172a",
                      cursor: "pointer",
                      fontWeight: "800",
                    }}
                  >
                    0.5 KG
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWeight("1")}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border:
                        selectedWeight === "1"
                          ? "2px solid #14b8a6"
                          : "1px solid #dbe4ee",
                      background: selectedWeight === "1" ? "#ecfeff" : "white",
                      color: "#0f172a",
                      cursor: "pointer",
                      fontWeight: "800",
                    }}
                  >
                    1 KG
                  </button>
                </div>

                <p
                  style={{
                    marginTop: "14px",
                    color: "#475569",
                    fontSize: "15px",
                  }}
                >
                  Selected price:{" "}
                  <strong style={{ color: "#0f172a" }}>
                    {(Number(product.price) * Number(selectedWeight)).toLocaleString()} IQD
                  </strong>
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={addToCart}
              style={{
                marginTop: "8px",
                padding: "14px 22px",
                borderRadius: "16px",
                border: "none",
                background: "linear-gradient(135deg, #14b8a6, #2563eb)",
                color: "white",
                cursor: "pointer",
                fontWeight: "800",
                fontSize: "16px",
                boxShadow: "0 16px 28px rgba(37, 99, 235, 0.22)",
              }}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;