import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [updatingPaymentId, setUpdatingPaymentId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("latest");

  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 4;

  useEffect(() => {
    document.title = "Admin Orders | Kozan Market";
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, paymentMethodFilter, paymentStatusFilter, sortOption]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);

      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus }
      );

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? res.data : order))
      );
    } catch (error) {
      console.log(error);
      alert("Failed to update order status");
    } finally {
      setUpdatingOrderId("");
    }
  };

  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      setUpdatingPaymentId(orderId);

      const currentOrder = orders.find((o) => o._id === orderId);

      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/payment-status`,
        {
          paymentStatus: newPaymentStatus,
          fibTransactionId: currentOrder?.fibTransactionId || "",
        }
      );

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? res.data : order))
      );
    } catch (error) {
      console.log(error);
      alert("Failed to update payment status");
    } finally {
      setUpdatingPaymentId("");
    }
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    result = result.filter((order) => {
      const customerName = (order.customerName || "").toLowerCase();
      const phone = (order.phone || "").toLowerCase();
      const id = (order._id || "").toLowerCase();
      const query = search.toLowerCase();

      const matchSearch =
        customerName.includes(query) ||
        phone.includes(query) ||
        id.includes(query);

      const matchStatus =
        statusFilter === "" || order.orderStatus === statusFilter;

      const matchPaymentMethod =
        paymentMethodFilter === "" ||
        order.paymentMethod === paymentMethodFilter;

      const matchPaymentStatus =
        paymentStatusFilter === "" ||
        (order.paymentStatus || "pending") === paymentStatusFilter;

      return (
        matchSearch &&
        matchStatus &&
        matchPaymentMethod &&
        matchPaymentStatus
      );
    });

    result.sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortOption === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortOption === "total-high-low") {
        return (b.totalPrice || 0) - (a.totalPrice || 0);
      }

      if (sortOption === "total-low-high") {
        return (a.totalPrice || 0) - (b.totalPrice || 0);
      }

      return 0;
    });

    return result;
  }, [
    orders,
    search,
    statusFilter,
    paymentMethodFilter,
    paymentStatusFilter,
    sortOption,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)
  );

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);

  const visiblePages = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered"
  ).length;
  const fibOrders = orders.filter((order) => order.paymentMethod === "fib").length;
  const paidOrders = orders.filter(
    (order) => (order.paymentStatus || "pending") === "paid"
  ).length;

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

  const getFibSenderPhone = (order) =>
    order.fibSenderPhone || order.fibPhone || "-";

  const getFibReference = (order) =>
    order.fibReference || order.fibNote || "-";

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
        <div style={{ marginBottom: "22px" }}>
          <h1 style={titleStyle}>Admin Orders</h1>
          <p style={subTitleStyle}>
            Manage customer orders, payment status, and delivery progress
          </p>
        </div>

        <div style={summaryGridStyle}>
          <div style={summaryCardBlue}>
            <p style={summaryLabelStyle}>Total Orders</p>
            <h3 style={summaryValueStyle}>{totalOrders}</h3>
          </div>

          <div style={summaryCardPurple}>
            <p style={summaryLabelStyle}>Pending Orders</p>
            <h3 style={summaryValueStyle}>{pendingOrders}</h3>
          </div>

          <div style={summaryCardGreen}>
            <p style={summaryLabelStyle}>Delivered Orders</p>
            <h3 style={summaryValueStyle}>{deliveredOrders}</h3>
          </div>

          <div style={summaryCardTeal}>
            <p style={summaryLabelStyle}>FIB Orders</p>
            <h3 style={summaryValueStyle}>{fibOrders}</h3>
          </div>

          <div style={summaryCardOrange}>
            <p style={summaryLabelStyle}>Paid Orders</p>
            <h3 style={summaryValueStyle}>{paidOrders}</h3>
          </div>
        </div>

        <div style={filterCardStyle}>
          <h2 style={sectionTitleStyle}>Search & Filters</h2>

          <div style={filtersGridStyle}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Search by customer, phone, or order id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              style={inputStyle}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              style={inputStyle}
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="">All Payment Methods</option>
              <option value="cash">cash</option>
              <option value="fib">fib</option>
            </select>

            <select
              style={inputStyle}
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
            >
              <option value="">All Payment Status</option>
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="failed">failed</option>
              <option value="cancelled">cancelled</option>
            </select>

            <select
              style={inputStyle}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="total-high-low">Total: High to Low</option>
              <option value="total-low-high">Total: Low to High</option>
            </select>

            <button
              style={clearButtonStyle}
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setPaymentMethodFilter("");
                setPaymentStatusFilter("");
                setSortOption("latest");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div style={summaryGridStyle}>
          <div style={summaryBoxLightStyle}>
            <p style={summaryLabelDarkStyle}>Filtered Results</p>
            <h3 style={summaryValueDarkStyle}>{filteredOrders.length}</h3>
          </div>

          <div style={summaryBoxLightStyle}>
            <p style={summaryLabelDarkStyle}>Current Page</p>
            <h3 style={summaryValueDarkStyle}>
              {currentPage} / {totalPages}
            </h3>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div style={emptyCardStyle}>No orders found</div>
        ) : (
          <>
            <div style={{ display: "grid", gap: "20px" }}>
              {paginatedOrders.map((order) => {
                const orderStatusStyle = getOrderStatusStyle(order.orderStatus);
                const paymentStatusStyle = getPaymentStatusStyle(
                  order.paymentStatus || "pending"
                );

                return (
                  <div key={order._id} style={orderCardStyle}>
                    <div style={orderHeaderStyle}>
                      <div>
                        <h2 style={orderTitleStyle}>
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h2>
                        <p style={dateTextStyle}>
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div style={badgeWrapStyle}>
                        <div style={{ ...badgeStyle, ...orderStatusStyle }}>
                          Order: {order.orderStatus}
                        </div>

                        <div style={{ ...badgeStyle, ...paymentStatusStyle }}>
                          Payment: {order.paymentStatus || "pending"}
                        </div>
                      </div>
                    </div>

                    <div style={infoGridStyle}>
                      <div style={infoCardStyle}>
                        <p style={infoLabelStyle}>Customer</p>
                        <strong>{order.customerName}</strong>
                      </div>

                      <div style={infoCardStyle}>
                        <p style={infoLabelStyle}>Phone</p>
                        <strong>{order.phone}</strong>
                      </div>

                      <div style={infoCardStyle}>
                        <p style={infoLabelStyle}>City</p>
                        <strong>{order.city || "-"}</strong>
                      </div>

                      <div style={infoCardStyle}>
                        <p style={infoLabelStyle}>Address</p>
                        <strong>{order.address || "-"}</strong>
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

                    {order.paymentMethod === "fib" && (
                      <div style={fibCardStyle}>
                        <h3 style={fibTitleStyle}>FIB Payment Info</h3>

                        <div style={infoGridStyle}>
                          <div style={infoCardStyle}>
                            <p style={infoLabelStyle}>Sender Phone</p>
                            <strong>{getFibSenderPhone(order)}</strong>
                          </div>

                          <div style={infoCardStyle}>
                            <p style={infoLabelStyle}>Transaction ID</p>
                            <strong>{order.fibTransactionId || "-"}</strong>
                          </div>

                          <div style={infoCardStyle}>
                            <p style={infoLabelStyle}>Reference / Note</p>
                            <strong>{getFibReference(order)}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: "18px" }}>
                      <h3 style={itemsTitleStyle}>Order Items</h3>

                      <div style={{ display: "grid", gap: "10px" }}>
                        {order.orderItems?.map((item, index) => (
                          <div key={index} style={itemRowStyle}>
                            <div>
                              <strong>{item.name}</strong>
                              <p style={itemMetaStyle}>
                                Qty: {item.qty}
                                {item.weight ? ` | ${item.weight}` : ""}
                              </p>
                            </div>

                            <strong>{(item.price || 0) * (item.qty || 0)} IQD</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={controlsGridStyle}>
                      <div style={controlCardStyle}>
                        <p style={controlTitleStyle}>Update Order Status</p>

                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          disabled={updatingOrderId === order._id}
                          style={selectStyle}
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="preparing">preparing</option>
                          <option value="on-the-way">on-the-way</option>
                          <option value="delivered">delivered</option>
                          <option value="cancelled">cancelled</option>
                        </select>

                        {updatingOrderId === order._id && (
                          <p style={updatingTextBlueStyle}>
                            Updating order status...
                          </p>
                        )}
                      </div>

                      <div style={controlCardStyle}>
                        <p style={controlTitleStyle}>Update Payment Status</p>

                        <select
                          value={order.paymentStatus || "pending"}
                          onChange={(e) =>
                            updatePaymentStatus(order._id, e.target.value)
                          }
                          disabled={updatingPaymentId === order._id}
                          style={selectStyle}
                        >
                          <option value="pending">pending</option>
                          <option value="paid">paid</option>
                          <option value="failed">failed</option>
                          <option value="cancelled">cancelled</option>
                        </select>

                        {updatingPaymentId === order._id && (
                          <p style={updatingTextTealStyle}>
                            Updating payment status...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={paginationWrapStyle}>
              <button
                style={{
                  ...paginationButtonStyle,
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div style={pageNumbersWrapStyle}>
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      ...pageNumberStyle,
                      background: currentPage === page ? "#2563eb" : "white",
                      color: currentPage === page ? "white" : "#0f172a",
                      border:
                        currentPage === page
                          ? "1px solid #2563eb"
                          : "1px solid #dbe2ea",
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                style={{
                  ...paginationButtonStyle,
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "28px",
  background: "#f8fafc",
};

const containerStyle = {
  maxWidth: "1250px",
  margin: "0 auto",
};

const titleStyle = {
  margin: 0,
  fontSize: "44px",
  fontWeight: "800",
  color: "#0f172a",
};

const subTitleStyle = {
  marginTop: "8px",
  color: "#64748b",
  fontSize: "16px",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "22px",
};

const summaryCardBase = {
  padding: "20px",
  borderRadius: "20px",
  color: "white",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.10)",
};

const summaryCardBlue = {
  ...summaryCardBase,
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
};

const summaryCardPurple = {
  ...summaryCardBase,
  background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
};

const summaryCardGreen = {
  ...summaryCardBase,
  background: "linear-gradient(135deg, #22c55e, #15803d)",
};

const summaryCardTeal = {
  ...summaryCardBase,
  background: "linear-gradient(135deg, #14b8a6, #0f766e)",
};

const summaryCardOrange = {
  ...summaryCardBase,
  background: "linear-gradient(135deg, #f97316, #ea580c)",
};

const summaryLabelStyle = {
  margin: 0,
  fontSize: "14px",
  opacity: 0.95,
};

const summaryValueStyle = {
  margin: "10px 0 0 0",
  fontSize: "32px",
  fontWeight: "800",
};

const summaryBoxLightStyle = {
  background: "white",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  border: "1px solid #eef2f7",
};

const summaryLabelDarkStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
};

const summaryValueDarkStyle = {
  margin: "8px 0 0 0",
  color: "#0f172a",
  fontSize: "30px",
  fontWeight: "800",
};

const filterCardStyle = {
  background: "white",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  border: "1px solid #eef2f7",
  marginBottom: "22px",
};

const sectionTitleStyle = {
  margin: "0 0 16px 0",
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "800",
};

const filtersGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #dbe2ea",
  outline: "none",
  background: "white",
  fontSize: "15px",
  boxSizing: "border-box",
};

const clearButtonStyle = {
  padding: "12px 16px",
  borderRadius: "14px",
  border: "none",
  background: "#0f172a",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const emptyCardStyle = {
  background: "white",
  borderRadius: "24px",
  padding: "30px",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
};

const orderCardStyle = {
  background: "white",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  border: "1px solid #eef2f7",
};

const orderHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const orderTitleStyle = {
  margin: "0 0 6px 0",
  color: "#0f172a",
  fontSize: "30px",
  fontWeight: "800",
};

const dateTextStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
};

const badgeWrapStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const badgeStyle = {
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: "800",
  fontSize: "13px",
  textTransform: "capitalize",
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginBottom: "18px",
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

const fibCardStyle = {
  background: "#f8fffe",
  border: "1px solid #d9f3ea",
  borderRadius: "18px",
  padding: "16px",
  marginBottom: "18px",
};

const fibTitleStyle = {
  marginTop: 0,
  marginBottom: "12px",
  color: "#0f172a",
  fontSize: "18px",
};

const itemsTitleStyle = {
  marginBottom: "10px",
  color: "#0f172a",
  fontSize: "20px",
};

const itemRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
  background: "#f8fafc",
  padding: "12px 14px",
  borderRadius: "14px",
};

const itemMetaStyle = {
  margin: "4px 0 0 0",
  color: "#64748b",
};

const controlsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "12px",
};

const controlCardStyle = {
  background: "#f8fafc",
  borderRadius: "18px",
  padding: "16px",
};

const controlTitleStyle = {
  margin: "0 0 10px 0",
  fontWeight: "800",
  color: "#0f172a",
};

const selectStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #dbe2ea",
  outline: "none",
  background: "white",
  fontSize: "15px",
};

const updatingTextBlueStyle = {
  margin: "10px 0 0 0",
  color: "#2563eb",
  fontWeight: "700",
  fontSize: "14px",
};

const updatingTextTealStyle = {
  margin: "10px 0 0 0",
  color: "#0f766e",
  fontWeight: "700",
  fontSize: "14px",
};

const paginationWrapStyle = {
  marginTop: "22px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const paginationButtonStyle = {
  padding: "10px 16px",
  borderRadius: "12px",
  border: "none",
  background: "#0f172a",
  color: "white",
  fontWeight: "800",
};

const pageNumbersWrapStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const pageNumberStyle = {
  minWidth: "42px",
  height: "42px",
  borderRadius: "12px",
  fontWeight: "800",
  cursor: "pointer",
};

export default AdminOrdersPage;