import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MarketNavbar from "./MarketNavbar";
import BottomNav from "./BottomNav";

function CartPage() {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Cart | Kozan Market";
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQty = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, qty: Math.max(1, item.qty - 1) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    const ok = window.confirm("Are you sure you want to clear the cart?");
    if (!ok) return;
    setCart([]);
    localStorage.removeItem("cart");
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + (item.qty || 0), 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0),
    [cart]
  );

  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
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

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "28px",
              padding: "50px 24px",
              textAlign: "center",
              boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
              border: "1px solid #eef2f7",
              marginTop: "24px",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "14px" }}>🛒</div>
            <h1
              style={{
                margin: "0 0 10px 0",
                fontSize: "34px",
                color: "#0f172a",
                fontWeight: "900",
              }}
            >
              Your cart is empty
            </h1>
            <p
              style={{
                margin: "0 auto 22px auto",
                maxWidth: "560px",
                color: "#64748b",
                lineHeight: "1.8",
                fontSize: "15px",
              }}
            >
              Looks like you have not added any products yet. Explore the market
              and add your favorite items to start your order.
            </p>

            <button
              onClick={() => navigate("/market")}
              style={{
                padding: "14px 20px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg,#14b8a6,#2563eb)",
                color: "white",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(37,99,235,0.16)",
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

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
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "38px",
                fontWeight: "900",
              }}
            >
              Shopping Cart
            </h1>
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              {totalItems} item(s) in your cart
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/market")}
              style={secondaryButtonStyle}
            >
              Continue Shopping
            </button>

            <button onClick={clearCart} style={dangerButtonStyle}>
              Clear Cart
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 0.9fr",
            gap: "20px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "26px",
              padding: "18px",
              boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
              border: "1px solid #eef2f7",
            }}
          >
            <div style={{ display: "grid", gap: "14px" }}>
              {cart.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr auto",
                    gap: "16px",
                    background: "#fbfdff",
                    border: "1px solid #edf2f7",
                    borderRadius: "22px",
                    padding: "14px",
                    alignItems: "center",
                  }}
                >
                  <Link
                    to={`/product/${item.productId}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        background: "linear-gradient(180deg,#f8fafc,#f1f5f9)",
                        borderRadius: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={`http://localhost:5000${item.imageUrl}`}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <div style={{ color: "#94a3b8", fontWeight: "700" }}>
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>

                  <div>
                    <Link
                      to={`/product/${item.productId}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <h3
                        style={{
                          margin: "0 0 8px 0",
                          color: "#0f172a",
                          fontSize: "22px",
                          fontWeight: "800",
                        }}
                      >
                        {item.name}
                      </h3>
                    </Link>

                    <p
                      style={{
                        margin: "0 0 8px 0",
                        color: "#16a34a",
                        fontSize: "18px",
                        fontWeight: "800",
                      }}
                    >
                      {item.price} IQD
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          background: "#eff6ff",
                          color: "#2563eb",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "800",
                        }}
                      >
                        {item.weight || "Standard"}
                      </span>

                      <span
                        style={{
                          color: "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        Item Total: {(item.price || 0) * (item.qty || 0)} IQD
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          onClick={() => decreaseQty(item.productId)}
                          style={qtyButtonStyle}
                        >
                          −
                        </button>

                        <div
                          style={{
                            minWidth: "48px",
                            textAlign: "center",
                            fontWeight: "800",
                            color: "#0f172a",
                          }}
                        >
                          {item.qty}
                        </div>

                        <button
                          onClick={() => increaseQty(item.productId)}
                          style={qtyButtonStyle}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        style={removeButtonStyle}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      minWidth: "110px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#64748b",
                        fontSize: "13px",
                      }}
                    >
                      Qty
                    </p>
                    <h4
                      style={{
                        margin: "6px 0 12px 0",
                        color: "#0f172a",
                        fontSize: "24px",
                        fontWeight: "900",
                      }}
                    >
                      {item.qty}
                    </h4>

                    <p
                      style={{
                        margin: 0,
                        color: "#64748b",
                        fontSize: "13px",
                      }}
                    >
                      Total
                    </p>
                    <h4
                      style={{
                        margin: "6px 0 0 0",
                        color: "#2563eb",
                        fontSize: "20px",
                        fontWeight: "900",
                      }}
                    >
                      {(item.price || 0) * (item.qty || 0)} IQD
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "26px",
              padding: "22px",
              boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
              border: "1px solid #eef2f7",
              position: "sticky",
              top: "20px",
            }}
          >
            <h2
              style={{
                margin: "0 0 16px 0",
                color: "#0f172a",
                fontSize: "28px",
                fontWeight: "900",
              }}
            >
              Order Summary
            </h2>

            <div style={{ display: "grid", gap: "12px", marginBottom: "18px" }}>
              <div style={summaryRowStyle}>
                <span>Items</span>
                <strong>{totalItems}</strong>
              </div>

              <div style={summaryRowStyle}>
                <span>Subtotal</span>
                <strong>{subtotal} IQD</strong>
              </div>

              <div style={summaryRowStyle}>
                <span>Delivery</span>
                <strong>{deliveryFee} IQD</strong>
              </div>

              <div
                style={{
                  ...summaryRowStyle,
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "14px",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    color: "#0f172a",
                    fontWeight: "900",
                    fontSize: "18px",
                  }}
                >
                  Total
                </span>
                <strong
                  style={{
                    color: "#2563eb",
                    fontSize: "22px",
                    fontWeight: "900",
                  }}
                >
                  {total} IQD
                </strong>
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "14px",
                marginBottom: "18px",
              }}
            >
              <p
                style={{
                  margin: "0 0 6px 0",
                  color: "#0f172a",
                  fontWeight: "800",
                }}
              >
                Ready to place your order?
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  lineHeight: "1.7",
                  fontSize: "14px",
                }}
              >
                Review your items, then continue to the market page checkout to
                complete your order details.
              </p>
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              <button
                onClick={() => navigate("/market")}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(135deg,#14b8a6,#2563eb)",
                  color: "white",
                  fontWeight: "800",
                  cursor: "pointer",
                  boxShadow: "0 10px 20px rgba(37,99,235,0.14)",
                }}
              >
                Go to Checkout
              </button>

              <button
                onClick={() => navigate("/market")}
                style={secondaryWideButtonStyle}
              >
                Add More Products
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

const secondaryButtonStyle = {
  padding: "12px 16px",
  borderRadius: "14px",
  border: "1px solid #dbe4ee",
  background: "white",
  cursor: "pointer",
  fontWeight: "800",
  color: "#0f172a",
};

const dangerButtonStyle = {
  padding: "12px 16px",
  borderRadius: "14px",
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
  fontWeight: "800",
};

const qtyButtonStyle = {
  width: "42px",
  height: "42px",
  border: "none",
  background: "white",
  color: "#0f172a",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "18px",
};

const removeButtonStyle = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #fecaca",
  background: "#fff5f5",
  color: "#dc2626",
  cursor: "pointer",
  fontWeight: "800",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#475569",
  fontSize: "15px",
};

const secondaryWideButtonStyle = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid #dbe4ee",
  background: "white",
  color: "#0f172a",
  fontWeight: "800",
  cursor: "pointer",
};

export default CartPage;