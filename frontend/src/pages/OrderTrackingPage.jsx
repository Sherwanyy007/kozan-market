import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MarketNavbar from "./MarketNavbar";
import BottomNav from "./BottomNav";

function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Order Tracking | Kozan Market";

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
        setOrder(res.data || null);
      } catch (error) {
        console.log(error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const timelineSteps = useMemo(() => {
    if (!order) return [];

    const timeline = order.statusTimeline || {};

    return [
      {
        key: "pending",
        title: "Order Placed",
        description: "Your order has been received.",
        date: timeline.pendingAt || order.createdAt || null,
        active: true,
        done: !!timeline.pendingAt || !!order.createdAt,
      },
      {
        key: "confirmed",
        title: "Confirmed",
        description: "Your order has been confirmed.",
        date: timeline.confirmedAt || null,
        active: isStepActive(order.orderStatus, "confirmed"),
        done: !!timeline.confirmedAt,
      },
      {
        key: "preparing",
        title: "Preparing",
        description: "Your items are being prepared.",
        date: timeline.preparingAt || null,
        active: isStepActive(order.orderStatus, "preparing"),
        done: !!timeline.preparingAt,
      },
      {
        key: "on-the-way",
        title: "On The Way",
        description: "Your order is on the way.",
        date: timeline.onTheWayAt || null,
        active: isStepActive(order.orderStatus, "on-the-way"),
        done: !!timeline.onTheWayAt,
      },
      {
        key: "delivered",
        title: "Delivered",
        description: "The order has been delivered.",
        date: timeline.deliveredAt || null,
        active: isStepActive(order.orderStatus, "delivered"),
        done: !!timeline.deliveredAt,
      },
    ];
  }, [order]);

  const orderStatusStyle = useMemo(() => {
    return getOrderStatusStyle(order?.orderStatus);
  }, [order]);

  const paymentStatusStyle = useMemo(() => {
    return getPaymentStatusStyle(order?.paymentStatus || "pending");
  }, [order]);

  if (loading) {
    return (
      <div style={pageBgStyle}>
        <MarketNavbar />
        <div style={containerStyle}>
          <div style={loadingCardStyle}>
            <h2 style={{ margin: 0, color: "#0f172a" }}>Loading order...</h2>
            <p style={{ marginTop: 10, color: "#64748b" }}>
              Please wait while we fetch your order details.
            </p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={pageBgStyle}>
        <MarketNavbar />
        <div style={containerStyle}>
          <div style={notFoundCardStyle}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>📦</div>
            <h1 style={notFoundTitleStyle}>Order not found</h1>
            <p style={notFoundTextStyle}>
              We could not find this order. It may have been removed or the link
              may be incorrect.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={() => navigate("/market")}
                style={primaryButtonStyle}
              >
                Go to Market
              </button>

              <button
                onClick={() => navigate("/my-orders")}
                style={secondaryButtonStyle}
              >
                My Orders
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={pageBgStyle}>
      <MarketNavbar />

      <div style={containerStyle}>
        <div style={heroCardStyle}>
          <div>
            <p style={heroMiniTextStyle}>ORDER TRACKING</p>
            <h1 style={heroTitleStyle}>
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p style={heroSubTextStyle}>
              Track your order status, payment details, and order summary.
            </p>
          </div>

          <div style={heroBadgeWrapStyle}>
            <div style={{ ...heroBadgeStyle, ...orderStatusStyle }}>
              Order: {order.orderStatus || "pending"}
            </div>

            <div style={{ ...heroBadgeStyle, ...paymentStatusStyle }}>
              Payment: {order.paymentStatus || "pending"}
            </div>
          </div>
        </div>

        <div style={topInfoGridStyle}>
          <div style={infoCardStyle}>
            <p style={infoLabelStyle}>Customer</p>
            <strong>{order.customerName || "-"}</strong>
          </div>

          <div style={infoCardStyle}>
            <p style={infoLabelStyle}>Phone</p>
            <strong>{order.phone || "-"}</strong>
          </div>

          <div style={infoCardStyle}>
            <p style={infoLabelStyle}>Payment Method</p>
            <strong style={{ textTransform: "uppercase" }}>
              {order.paymentMethod || "-"}
            </strong>
          </div>

          <div style={infoCardStyle}>
            <p style={infoLabelStyle}>Order Date</p>
            <strong>{formatDate(order.createdAt)}</strong>
          </div>

          <div style={infoCardStyle}>
            <p style={infoLabelStyle}>Items</p>
            <strong>
              {order.orderItems?.reduce((sum, item) => sum + (item.qty || 0), 0) ||
                0}
            </strong>
          </div>

          <div style={infoCardStyle}>
            <p style={infoLabelStyle}>Total</p>
            <strong>{order.totalPrice || 0} IQD</strong>
          </div>
        </div>

        <div style={mainGridStyle}>
          <div style={sectionCardStyle}>
            <h2 style={sectionTitleStyle}>Order Timeline</h2>

            {order.orderStatus === "cancelled" ? (
              <div style={cancelledBoxStyle}>
                <div style={{ fontSize: "22px" }}>❌</div>
                <div>
                  <strong style={{ display: "block", marginBottom: "4px" }}>
                    This order was cancelled
                  </strong>
                  <span style={{ color: "#7f1d1d" }}>
                    {formatDate(order.statusTimeline?.cancelledAt)}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: "18px" }}>
                {timelineSteps.map((step, index) => (
                  <div key={step.key} style={timelineRowStyle}>
                    <div style={timelineIconColStyle}>
                      <div
                        style={{
                          ...timelineDotStyle,
                          background: step.done
                            ? "linear-gradient(135deg,#14b8a6,#2563eb)"
                            : step.active
                            ? "#dbeafe"
                            : "#e5e7eb",
                          color: step.done
                            ? "white"
                            : step.active
                            ? "#2563eb"
                            : "#94a3b8",
                          border: step.done
                            ? "none"
                            : step.active
                            ? "1px solid #bfdbfe"
                            : "1px solid #e5e7eb",
                        }}
                      >
                        {step.done ? "✓" : index + 1}
                      </div>

                      {index !== timelineSteps.length - 1 && (
                        <div
                          style={{
                            ...timelineLineStyle,
                            background: step.done ? "#93c5fd" : "#e5e7eb",
                          }}
                        />
                      )}
                    </div>

                    <div style={timelineContentStyle}>
                      <div style={timelineHeaderStyle}>
                        <h3 style={timelineTitleStyle}>{step.title}</h3>
                        <span style={timelineDateStyle}>
                          {formatDate(step.date)}
                        </span>
                      </div>

                      <p style={timelineDescStyle}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={sectionCardStyle}>
            <h2 style={sectionTitleStyle}>Delivery Details</h2>

            <div style={{ display: "grid", gap: "12px" }}>
              <div style={detailBoxStyle}>
                <p style={infoLabelStyle}>City</p>
                <strong>{order.city || "-"}</strong>
              </div>

              <div style={detailBoxStyle}>
                <p style={infoLabelStyle}>Address</p>
                <strong>{order.address || "-"}</strong>
              </div>

              {order.street ? (
                <div style={detailBoxStyle}>
                  <p style={infoLabelStyle}>Street</p>
                  <strong>{order.street}</strong>
                </div>
              ) : null}

              {order.buildingName ? (
                <div style={detailBoxStyle}>
                  <p style={infoLabelStyle}>Building</p>
                  <strong>{order.buildingName}</strong>
                </div>
              ) : null}

              {order.apartmentNumber ? (
                <div style={detailBoxStyle}>
                  <p style={infoLabelStyle}>Apartment</p>
                  <strong>{order.apartmentNumber}</strong>
                </div>
              ) : null}

              {order.floor ? (
                <div style={detailBoxStyle}>
                  <p style={infoLabelStyle}>Floor</p>
                  <strong>{order.floor}</strong>
                </div>
              ) : null}

              {order.additionalDirections ? (
                <div style={detailBoxStyle}>
                  <p style={infoLabelStyle}>Directions</p>
                  <strong>{order.additionalDirections}</strong>
                </div>
              ) : null}

              {order.notes ? (
                <div style={detailBoxStyle}>
                  <p style={infoLabelStyle}>Notes</p>
                  <strong>{order.notes}</strong>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {order.paymentMethod === "fib" && (
          <div style={fibSectionStyle}>
            <h2 style={sectionTitleStyle}>FIB Payment Info</h2>

            <div style={topInfoGridStyle}>
              <div style={infoCardStyle}>
                <p style={infoLabelStyle}>Sender Phone</p>
                <strong>{order.fibSenderPhone || order.fibPhone || "-"}</strong>
              </div>

              <div style={infoCardStyle}>
                <p style={infoLabelStyle}>Transaction ID</p>
                <strong>{order.fibTransactionId || "-"}</strong>
              </div>

              <div style={infoCardStyle}>
                <p style={infoLabelStyle}>Reference</p>
                <strong>{order.fibReference || order.fibNote || "-"}</strong>
              </div>
            </div>
          </div>
        )}

        <div style={sectionCardStyle}>
          <div style={sectionHeaderFlexStyle}>
            <h2 style={sectionTitleStyle}>Order Items</h2>
            <span style={itemsCountBadgeStyle}>
              {order.orderItems?.length || 0} item(s)
            </span>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {order.orderItems?.map((item, index) => (
              <div key={index} style={itemCardStyle}>
                <div style={itemLeftStyle}>
                  <div style={itemImageWrapStyle}>
                    {item.imageUrl ? (
                      <img
                        src={`http://localhost:5000${item.imageUrl}`}
                        alt={item.name}
                        style={itemImageStyle}
                      />
                    ) : (
                      <div style={{ color: "#94a3b8", fontWeight: "700" }}>
                        No Image
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 style={itemNameStyle}>{item.name}</h3>
                    <p style={itemMetaStyle}>
                      Qty: {item.qty || 0}
                      {item.weight ? ` • ${item.weight}` : ""}
                    </p>
                    <p style={itemPriceStyle}>{item.price || 0} IQD each</p>
                  </div>
                </div>

                <div style={itemTotalWrapStyle}>
                  <p style={itemTotalLabelStyle}>Item Total</p>
                  <strong style={itemTotalValueStyle}>
                    {(item.price || 0) * (item.qty || 0)} IQD
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={actionBarStyle}>
          <button onClick={() => navigate("/my-orders")} style={secondaryButtonStyle}>
            My Orders
          </button>

          <button onClick={() => navigate("/market")} style={primaryButtonStyle}>
            Continue Shopping
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function isStepActive(currentStatus, stepStatus) {
  const order = [
    "pending",
    "confirmed",
    "preparing",
    "on-the-way",
    "delivered",
  ];

  const currentIndex = order.indexOf(currentStatus);
  const stepIndex = order.indexOf(stepStatus);

  return currentIndex >= stepIndex && currentIndex !== -1 && stepIndex !== -1;
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
}

function getOrderStatusStyle(status) {
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
}

function getPaymentStatusStyle(status) {
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
}

const pageBgStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, #eef7ff 0%, #f8fafc 45%, #f8fafc 100%)",
  paddingBottom: "110px",
};

const containerStyle = {
  maxWidth: "1220px",
  margin: "0 auto",
  padding: "20px",
};

const loadingCardStyle = {
  background: "white",
  borderRadius: "28px",
  padding: "40px",
  marginTop: "24px",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
  border: "1px solid #eef2f7",
};

const notFoundCardStyle = {
  background: "white",
  borderRadius: "28px",
  padding: "50px 24px",
  textAlign: "center",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
  border: "1px solid #eef2f7",
  marginTop: "24px",
};

const notFoundTitleStyle = {
  margin: "0 0 10px 0",
  fontSize: "34px",
  color: "#0f172a",
  fontWeight: "900",
};

const notFoundTextStyle = {
  margin: "0 auto 22px auto",
  maxWidth: "560px",
  color: "#64748b",
  lineHeight: "1.8",
  fontSize: "15px",
};

const heroCardStyle = {
  background: "linear-gradient(135deg, #0f766e, #2563eb)",
  borderRadius: "30px",
  padding: "28px",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  boxShadow: "0 18px 40px rgba(37, 99, 235, 0.18)",
  marginBottom: "22px",
};

const heroMiniTextStyle = {
  margin: "0 0 8px 0",
  opacity: 0.9,
  fontSize: "13px",
  fontWeight: "800",
  letterSpacing: "1px",
};

const heroTitleStyle = {
  margin: "0 0 8px 0",
  fontSize: "38px",
  lineHeight: 1.15,
  fontWeight: "900",
};

const heroSubTextStyle = {
  margin: 0,
  opacity: 0.94,
  lineHeight: "1.7",
  maxWidth: "620px",
};

const heroBadgeWrapStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const heroBadgeStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  fontWeight: "800",
  fontSize: "13px",
  textTransform: "capitalize",
};

const topInfoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginBottom: "22px",
};

const infoCardStyle = {
  background: "white",
  borderRadius: "18px",
  padding: "16px",
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
  border: "1px solid #eef2f7",
};

const infoLabelStyle = {
  margin: "0 0 6px 0",
  color: "#64748b",
  fontSize: "13px",
};

const mainGridStyle = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: "20px",
  marginBottom: "22px",
};

const sectionCardStyle = {
  background: "white",
  borderRadius: "26px",
  padding: "22px",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
  border: "1px solid #eef2f7",
  marginBottom: "22px",
};

const sectionTitleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: "900",
};

const cancelledBoxStyle = {
  marginTop: "18px",
  display: "flex",
  gap: "12px",
  alignItems: "center",
  padding: "16px",
  borderRadius: "18px",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#991b1b",
};

const timelineRowStyle = {
  display: "flex",
  gap: "14px",
};

const timelineIconColStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const timelineDotStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
  fontSize: "14px",
  flexShrink: 0,
};

const timelineLineStyle = {
  width: "3px",
  minHeight: "44px",
  borderRadius: "999px",
  marginTop: "8px",
  marginBottom: "8px",
};

const timelineContentStyle = {
  flex: 1,
  paddingBottom: "18px",
};

const timelineHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
  alignItems: "center",
};

const timelineTitleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "19px",
  fontWeight: "800",
};

const timelineDateStyle = {
  color: "#64748b",
  fontSize: "13px",
  fontWeight: "700",
};

const timelineDescStyle = {
  margin: "6px 0 0 0",
  color: "#64748b",
  lineHeight: "1.7",
};

const detailBoxStyle = {
  background: "#f8fafc",
  borderRadius: "16px",
  padding: "14px",
};

const fibSectionStyle = {
  background: "#f8fffe",
  border: "1px solid #d9f3ea",
  borderRadius: "26px",
  padding: "22px",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
  marginBottom: "22px",
};

const sectionHeaderFlexStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "16px",
};

const itemsCountBadgeStyle = {
  background: "#eff6ff",
  color: "#2563eb",
  padding: "8px 12px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: "800",
};

const itemCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  alignItems: "center",
  background: "#fbfdff",
  border: "1px solid #edf2f7",
  borderRadius: "20px",
  padding: "14px",
};

const itemLeftStyle = {
  display: "flex",
  gap: "14px",
  alignItems: "center",
  flex: 1,
  minWidth: "260px",
};

const itemImageWrapStyle = {
  width: "90px",
  height: "90px",
  background: "linear-gradient(180deg,#f8fafc,#f1f5f9)",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  flexShrink: 0,
};

const itemImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const itemNameStyle = {
  margin: "0 0 6px 0",
  fontSize: "20px",
  color: "#0f172a",
  fontWeight: "800",
};

const itemMetaStyle = {
  margin: "0 0 6px 0",
  color: "#64748b",
  fontSize: "14px",
};

const itemPriceStyle = {
  margin: 0,
  color: "#16a34a",
  fontWeight: "800",
};

const itemTotalWrapStyle = {
  textAlign: "right",
  minWidth: "130px",
};

const itemTotalLabelStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "13px",
};

const itemTotalValueStyle = {
  display: "block",
  marginTop: "6px",
  color: "#2563eb",
  fontSize: "20px",
  fontWeight: "900",
};

const actionBarStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const primaryButtonStyle = {
  padding: "14px 20px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg,#14b8a6,#2563eb)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(37,99,235,0.16)",
};

const secondaryButtonStyle = {
  padding: "14px 20px",
  borderRadius: "14px",
  border: "1px solid #dbe4ee",
  background: "white",
  color: "#0f172a",
  fontWeight: "800",
  cursor: "pointer",
};

export default OrderTrackingPage;