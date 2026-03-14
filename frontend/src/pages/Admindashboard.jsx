import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Dashboard | Kozan Market";

    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes, statsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/orders"),
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/dashboard/stats").catch(() => null),
        ]);

        const ordersData = ordersRes?.data || [];
        const productsData = productsRes?.data || [];

        setOrders(ordersData);
        setProducts(productsData);

        if (statsRes?.data) {
          setStats(statsRes.data);
        } else {
          const fallbackPending = ordersData.filter(
            (order) => order.orderStatus === "pending"
          ).length;

          const fallbackDelivered = ordersData.filter(
            (order) => order.orderStatus === "delivered"
          ).length;

          const fallbackRevenue = ordersData
            .filter((order) => order.orderStatus === "delivered")
            .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

          setStats({
            totalOrders: ordersData.length,
            totalProducts: productsData.length,
            totalUsers: 0,
            pendingOrders: fallbackPending,
            deliveredOrders: fallbackDelivered,
            totalRevenue: fallbackRevenue,
          });
        }
      } catch (err) {
        console.log(err);
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalOrders = stats?.totalOrders ?? orders.length;
  const totalSales =
    stats?.totalRevenue ??
    orders
      .filter((order) => order.orderStatus === "delivered")
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const totalProducts = stats?.totalProducts ?? products.length;
  const totalUsers = stats?.totalUsers ?? 0;
  const pendingOrders =
    stats?.pendingOrders ??
    orders.filter((order) => order.orderStatus === "pending").length;

  const deliveredOrders =
    stats?.deliveredOrders ??
    orders.filter((order) => order.orderStatus === "delivered").length;

  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  const statusData = useMemo(() => {
    const allStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "on-the-way",
      "delivered",
      "cancelled",
    ];

    return allStatuses.map((status) => ({
      status,
      count: orders.filter((order) => order.orderStatus === status).length,
    }));
  }, [orders]);

  const paymentData = useMemo(() => {
    return [
      {
        label: "Cash",
        count: orders.filter((order) => order.paymentMethod === "cash").length,
      },
      {
        label: "FIB",
        count: orders.filter((order) => order.paymentMethod === "fib").length,
      },
    ];
  }, [orders]);

  const maxStatusCount = Math.max(...statusData.map((item) => item.count), 1);
  const maxPaymentCount = Math.max(...paymentData.map((item) => item.count), 1);

  if (loading) {
    return (
      <div style={pageStyle}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Admin Dashboard</h1>
        <p style={subTitleStyle}>
          Overview of orders, products, users, sales, and activity
        </p>

        <div style={statsGridStyle}>
          <div style={blueCardStyle}>
            <p style={cardLabelStyle}>Total Orders</p>
            <h2 style={cardValueStyle}>{totalOrders}</h2>
          </div>

          <div style={greenCardStyle}>
            <p style={cardLabelStyle}>Total Sales</p>
            <h2 style={cardValueStyle}>{totalSales} IQD</h2>
          </div>

          <div style={orangeCardStyle}>
            <p style={cardLabelStyle}>Total Products</p>
            <h2 style={cardValueStyle}>{totalProducts}</h2>
          </div>

          <div style={purpleCardStyle}>
            <p style={cardLabelStyle}>Pending Orders</p>
            <h2 style={cardValueStyle}>{pendingOrders}</h2>
          </div>

          <div style={tealCardStyle}>
            <p style={cardLabelStyle}>Delivered Orders</p>
            <h2 style={cardValueStyle}>{deliveredOrders}</h2>
          </div>

          <div style={darkCardStyle}>
            <p style={cardLabelStyle}>Total Users</p>
            <h2 style={cardValueStyle}>{totalUsers}</h2>
          </div>
        </div>

        <div style={sectionCardStyle}>
          <h2 style={sectionTitleStyle}>Quick Actions</h2>
          <div style={actionsWrapStyle}>
            <button
              onClick={() => navigate("/admin-orders")}
              style={actionButtonStyle}
            >
              Go to Admin Orders
            </button>

            <button
              onClick={() => navigate("/admin-products")}
              style={actionButtonStyle}
            >
              Go to Admin Products
            </button>

            <button onClick={() => navigate("/market")} style={actionButtonStyle}>
              Go to Market
            </button>
          </div>
        </div>

        <div style={chartsGridStyle}>
          <div style={sectionCardStyle}>
            <h2 style={sectionTitleStyle}>Orders by Status</h2>

            <div style={{ marginTop: "18px" }}>
              {statusData.map((item) => (
                <div key={item.status} style={chartRowStyle}>
                  <div style={chartLabelRowStyle}>
                    <span style={statusNameStyle}>{item.status}</span>
                    <span style={statusCountStyle}>{item.count}</span>
                  </div>

                  <div style={barTrackStyle}>
                    <div
                      style={{
                        ...barFillStyle,
                        width: `${(item.count / maxStatusCount) * 100}%`,
                        background: getStatusBarColor(item.status),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={sectionCardStyle}>
            <h2 style={sectionTitleStyle}>Payment Methods</h2>

            <div style={{ marginTop: "18px" }}>
              {paymentData.map((item) => (
                <div key={item.label} style={chartRowStyle}>
                  <div style={chartLabelRowStyle}>
                    <span style={statusNameStyle}>{item.label}</span>
                    <span style={statusCountStyle}>{item.count}</span>
                  </div>

                  <div style={barTrackStyle}>
                    <div
                      style={{
                        ...barFillStyle,
                        width: `${(item.count / maxPaymentCount) * 100}%`,
                        background:
                          item.label === "FIB"
                            ? "linear-gradient(90deg, #14b8a6, #0f766e)"
                            : "linear-gradient(90deg, #f59e0b, #d97706)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={sectionCardStyle}>
          <h2 style={sectionTitleStyle}>Recent Orders</h2>

          {recentOrders.length === 0 ? (
            <p style={{ color: "#64748b" }}>No recent orders found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "850px",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Total</th>
                    <th style={thStyle}>Payment</th>
                    <th style={thStyle}>Order Status</th>
                    <th style={thStyle}>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      <td style={tdStyle}>{order.customerName}</td>
                      <td style={tdStyle}>{order.phone}</td>
                      <td style={tdStyle}>{order.totalPrice} IQD</td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background:
                              order.paymentMethod === "fib" ? "#dcfce7" : "#fef3c7",
                            color:
                              order.paymentMethod === "fib" ? "#166534" : "#92400e",
                            fontWeight: "700",
                            fontSize: "13px",
                            textTransform: "uppercase",
                          }}
                        >
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: getStatusSoftColor(order.orderStatus),
                            color: getStatusTextColor(order.orderStatus),
                            fontWeight: "700",
                            fontSize: "13px",
                            textTransform: "capitalize",
                          }}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusBarColor(status) {
  if (status === "pending") return "linear-gradient(90deg, #60a5fa, #2563eb)";
  if (status === "confirmed") return "linear-gradient(90deg, #818cf8, #4f46e5)";
  if (status === "preparing") return "linear-gradient(90deg, #fbbf24, #f59e0b)";
  if (status === "on-the-way") return "linear-gradient(90deg, #fb7185, #e11d48)";
  if (status === "delivered") return "linear-gradient(90deg, #34d399, #059669)";
  if (status === "cancelled") return "linear-gradient(90deg, #f87171, #dc2626)";
  return "linear-gradient(90deg, #cbd5e1, #94a3b8)";
}

function getStatusSoftColor(status) {
  if (status === "delivered") return "#dcfce7";
  if (status === "pending") return "#e0f2fe";
  if (status === "confirmed") return "#e0e7ff";
  if (status === "preparing") return "#fef3c7";
  if (status === "on-the-way") return "#ffe4e6";
  if (status === "cancelled") return "#fee2e2";
  return "#f1f5f9";
}

function getStatusTextColor(status) {
  if (status === "delivered") return "#166534";
  if (status === "pending") return "#0369a1";
  if (status === "confirmed") return "#3730a3";
  if (status === "preparing") return "#92400e";
  if (status === "on-the-way") return "#be123c";
  if (status === "cancelled") return "#991b1b";
  return "#334155";
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: "32px",
};

const containerStyle = {
  maxWidth: "1250px",
  margin: "0 auto",
};

const titleStyle = {
  margin: "0",
  color: "#0f172a",
  fontSize: "42px",
  fontWeight: "800",
};

const subTitleStyle = {
  margin: "8px 0 24px 0",
  color: "#64748b",
  fontSize: "16px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginBottom: "24px",
};

const commonCardStyle = {
  color: "white",
  padding: "24px",
  borderRadius: "20px",
};

const blueCardStyle = {
  ...commonCardStyle,
  background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.18)",
};

const greenCardStyle = {
  ...commonCardStyle,
  background: "linear-gradient(135deg, #15803d, #16a34a)",
  boxShadow: "0 10px 25px rgba(22, 163, 74, 0.18)",
};

const orangeCardStyle = {
  ...commonCardStyle,
  background: "linear-gradient(135deg, #ea580c, #f97316)",
  boxShadow: "0 10px 25px rgba(249, 115, 22, 0.18)",
};

const purpleCardStyle = {
  ...commonCardStyle,
  background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.18)",
};

const tealCardStyle = {
  ...commonCardStyle,
  background: "linear-gradient(135deg, #0f766e, #14b8a6)",
  boxShadow: "0 10px 25px rgba(20, 184, 166, 0.18)",
};

const darkCardStyle = {
  ...commonCardStyle,
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.18)",
};

const cardLabelStyle = {
  margin: 0,
  fontSize: "16px",
  opacity: 0.95,
};

const cardValueStyle = {
  margin: "10px 0 0 0",
  fontSize: "34px",
  fontWeight: "800",
};

const sectionCardStyle = {
  background: "white",
  borderRadius: "22px",
  padding: "24px",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  marginBottom: "24px",
};

const sectionTitleStyle = {
  margin: "0 0 18px 0",
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: "800",
};

const actionsWrapStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const actionButtonStyle = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "none",
  background: "#0f172a",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const chartsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
};

const chartRowStyle = {
  marginBottom: "16px",
};

const chartLabelRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const statusNameStyle = {
  color: "#334155",
  fontWeight: "700",
  textTransform: "capitalize",
};

const statusCountStyle = {
  color: "#0f172a",
  fontWeight: "800",
};

const barTrackStyle = {
  width: "100%",
  height: "12px",
  background: "#e2e8f0",
  borderRadius: "999px",
  overflow: "hidden",
};

const barFillStyle = {
  height: "100%",
  borderRadius: "999px",
};

const thStyle = {
  textAlign: "left",
  padding: "14px 12px",
  color: "#334155",
  fontSize: "15px",
};

const tdStyle = {
  padding: "14px 12px",
  color: "#0f172a",
  fontSize: "15px",
};

export default AdminDashboard;