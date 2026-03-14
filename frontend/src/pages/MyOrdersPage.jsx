import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MarketNavbar from "./MarketNavbar";
import BottomNav from "./BottomNav";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [phone, setPhone] = useState(localStorage.getItem("myOrdersPhone") || "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "My Orders | Kozan Market";
  }, []);

  const fetchOrders = async () => {
    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      localStorage.setItem("myOrdersPhone", phone.trim());

      const res = await axios.get(
        `http://localhost:5000/api/orders/my-orders/${phone.trim()}`
      );

      setOrders(res.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch your orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = search.toLowerCase();

      const matchSearch =
        (order._id || "").toLowerCase().includes(q) ||
        (order.phone || "").toLowerCase().includes(q) ||
        (order.city || "").toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "" || order.orderStatus === statusFilter;

      const matchPaymentMethod =
        paymentMethodFilter === "" ||
        order.paymentMethod === paymentMethodFilter;

      return matchSearch && matchStatus && matchPaymentMethod;
    });
  }, [orders, search, statusFilter, paymentMethodFilter]);

  const getOrderStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return { background: "#dcfce7", color: "#166534" };
      case "cancelled":
        return { background: "#fee2e2", color: "#991b1b" };
      case "on-the-way":
        return { background: "#dbeafe", color: "#1d4ed8" };
      case "preparing":
        return { background: "#fef3c7", color: "#92400e" };
      case "confirmed":
        return { background: "#ede9fe", color: "#6d28d9" };
      default:
        return { background: "#e0e7ff", color: "#3730a3" };
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "paid":
        return { background: "#dcfce7", color: "#166534" };
      case "failed":
        return { background: "#fee2e2", color: "#991b1b" };
      case "cancelled":
        return { background: "#fef2f2", color: "#b91c1c" };
      default:
        return { background: "#fef3c7", color: "#92400e" };
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
            background: "linear-gradient(135deg, #0f766e, #2563eb)",
            borderRadius: "30px",
            padding: "30px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            boxShadow: "0 18px 40px rgba(37, 99, 235, 0.18)",
            marginBottom: "22px",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px 0",
                opacity: 0.9,
                fontSize: "13px",
                fontWeight: "800",
                letterSpacing: "1px",
              }}
            >
              ORDER HISTORY
            </p>
            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: "40px",
                lineHeight: 1.12,
                fontWeight: "900",
              }}
            >
              My Orders
            </h1>
            <p
              style={{
                margin: 0,
                opacity: 0.95,
                lineHeight: 1.7,
                maxWidth: "620px",
              }}
            >
              Check your previous orders, track delivery progress, and review
              payment and order details in one place.
            </p>
          </div>

          <button
            onClick={() => navigate("/market")}
            style={{
              padding: "14px 18px",
              borderRadius: "14px",
              border: "none",
              background: "white",
              color: "#0f172a",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            Back to Market
          </button>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "22px",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
            border: "1px solid #eef2f7",
            marginBottom: "22px",
          }}
        >
          <h2
            style={{
              margin: "0 0 14px 0",
              color: "#0f172a",
              fontSize: "24px",
              fontWeight: "800",
            }}
          >
            Find Your Orders
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr auto",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />

            <button
              onClick={fetchOrders}
              disabled={loading}
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg,#14b8a6,#2563eb)",
                color: "white",
                fontWeight: "800",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                minWidth: "140px",
              }}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>

        {searched && orders.length > 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "22px",
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
              border: "1px solid #eef2f7",
              marginBottom: "22px",
            }}
          >
            <h2
              style={{
                margin: "0 0 14px 0",
                color: "#0f172a",
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              Search & Filters
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
              }}
            >
              <input
                type="text"
                placeholder="Search by order id, phone, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={inputStyle}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="">All Order Status</option>
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="preparing">preparing</option>
                <option value="on-the-way">on-the-way</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>

              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="">All Payment Methods</option>
                <option value="cash">cash</option>
                <option value="fib">fib</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setPaymentMethodFilter("");
                }}
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: "1px solid #dbe4ee",
                  background: "white",
                  color: "#0f172a",
                  fontWeight: "800",
                  cursor: "pointer",
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {!searched && !loading && (
          <div
            style={{
              background: "white",
              borderRadius: "26px",
              padding: "42px 24px",
              textAlign: "center",
              boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
              border: "1px solid #eef2f7",
            }}
          >
            <div style={{ fontSize: "58px", marginBottom: "12px" }}>📋</div>
            <h2
              style={{
                margin: "0 0 10px 0",
                color: "#0f172a",
                fontSize: "32px",
                fontWeight: "900",
              }}
            >
              Search your orders
            </h2>
            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: "1.8",
                maxWidth: "560px",
                marginInline: "auto",
              }}
            >
              Enter the phone number you used when placing your order to view
              all matching orders.
            </p>
          </div>
        )}

        {searched && !loading && orders.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "26px",
              padding: "42px 24px",
              textAlign: "center",
              boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
              border: "1px solid #eef2f7",
            }}
          >
            <div style={{ fontSize: "58px", marginBottom: "12px" }}>📦</div>
            <h2
              style={{
                margin: "0 0 10px 0",
                color: "#0f172a",
                fontSize: "32px",
                fontWeight: "900",
              }}
            >
              No orders found
            </h2>
            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: "1.8",
                maxWidth: "560px",
                marginInline: "auto",
              }}
            >
              We could not find any orders with this phone number. Please check
              your number and try again.
            </p>
          </div>
        )}

        {searched && !loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "26px",
              padding: "32px 24px",
              textAlign: "center",
              boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
              border: "1px solid #eef2f7",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px 0",
                color: "#0f172a",
                fontSize: "28px",
                fontWeight: "900",
              }}
            >
              No matching orders
            </h2>
            <p style={{ margin: 0, color: "#64748b" }}>
              Try changing your search text or filter options.
            </p>
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div style={{ display: "grid", gap: "18px" }}>
            {filteredOrders.map((order) => {
              const orderStatusStyle = getOrderStatusStyle(order.orderStatus);
              const paymentStatusStyle = getPaymentStatusStyle(
                order.paymentStatus || "pending"
              );

              return (
                <div
                  key={order._id}
                  style={{
                    background: "white",
                    borderRadius: "26px",
                    padding: "22px",
                    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
                    border: "1px solid #eef2f7",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "14px",
                      flexWrap: "wrap",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: "0 0 6px 0",
                          color: "#0f172a",
                          fontSize: "28px",
                          fontWeight: "900",
                        }}
                      >
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h2>
                      <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <div style={{ ...badgeStyle, ...orderStatusStyle }}>
                        Order: {order.orderStatus || "pending"}
                      </div>

                      <div style={{ ...badgeStyle, ...paymentStatusStyle }}>
                        Payment: {order.paymentStatus || "pending"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "12px",
                      marginBottom: "18px",
                    }}
                  >
                    <div style={infoCardStyle}>
                      <p style={infoLabelStyle}>Phone</p>
                      <strong>{order.phone || "-"}</strong>
                    </div>

                    <div style={infoCardStyle}>
                      <p style={infoLabelStyle}>City</p>
                      <strong>{order.city || "-"}</strong>
                    </div>

                    <div style={infoCardStyle}>
                      <p style={infoLabelStyle}>Payment Method</p>
                      <strong style={{ textTransform: "uppercase" }}>
                        {order.paymentMethod || "-"}
                      </strong>
                    </div>

                    <div style={infoCardStyle}>
                      <p style={infoLabelStyle}>Items</p>
                      <strong>
                        {order.orderItems?.reduce(
                          (sum, item) => sum + (item.qty || 0),
                          0
                        ) || 0}
                      </strong>
                    </div>

                    <div style={infoCardStyle}>
                      <p style={infoLabelStyle}>Total</p>
                      <strong>{order.totalPrice || 0} IQD</strong>
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
                        color: "#64748b",
                        fontSize: "13px",
                      }}
                    >
                      Delivery Address
                    </p>
                    <strong style={{ color: "#0f172a" }}>
                      {order.address || "-"}
                    </strong>
                  </div>

                  <div style={{ display: "grid", gap: "10px", marginBottom: "18px" }}>
                    {order.orderItems?.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          flexWrap: "wrap",
                          background: "#fbfdff",
                          border: "1px solid #edf2f7",
                          borderRadius: "18px",
                          padding: "12px 14px",
                        }}
                      >
                        <div>
                          <strong>{item.name}</strong>
                          <p
                            style={{
                              margin: "4px 0 0 0",
                              color: "#64748b",
                              fontSize: "14px",
                            }}
                          >
                            Qty: {item.qty}
                            {item.weight ? ` • ${item.weight}` : ""}
                          </p>
                        </div>

                        <strong>
                          {(item.price || 0) * (item.qty || 0)} IQD
                        </strong>
                      </div>
                    ))}

                    {(order.orderItems?.length || 0) > 3 && (
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        + {order.orderItems.length - 3} more item(s)
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      style={{
                        padding: "13px 18px",
                        borderRadius: "14px",
                        border: "none",
                        background: "linear-gradient(135deg,#14b8a6,#2563eb)",
                        color: "white",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                    >
                      Track Order
                    </button>

                    <button
                      onClick={() => navigate("/market")}
                      style={{
                        padding: "13px 18px",
                        borderRadius: "14px",
                        border: "1px solid #dbe4ee",
                        background: "white",
                        color: "#0f172a",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                    >
                      Shop Again
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #dbe4ee",
  outline: "none",
  fontSize: "15px",
  background: "white",
  boxSizing: "border-box",
};

const badgeStyle = {
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "800",
  fontSize: "13px",
  textTransform: "capitalize",
};

const infoCardStyle = {
  background: "#f8fafc",
  borderRadius: "16px",
  padding: "14px",
};

const infoLabelStyle = {
  margin: "0 0 6px 0",
  color: "#64748b",
  fontSize: "13px",
};

export default MyOrdersPage;