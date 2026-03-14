import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleNavigate = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const linkBaseStyle = {
    display: "block",
    padding: "14px 18px",
    borderRadius: "16px",
    textDecoration: "none",
    fontWeight: "700",
    marginBottom: "12px",
    transition: "0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f8fafc",
        position: "relative",
      }}
    >
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            zIndex: 20,
          }}
        />
      )}

      <aside
        style={{
          width: "290px",
          background: "linear-gradient(180deg, #0f172a, #1e3a8a)",
          color: "white",
          padding: "24px 18px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 30,

          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: 0,
          height: "100vh",
          transform: isMobile
            ? sidebarOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "translateX(0)",
          transition: "transform 0.25s ease",
          boxShadow: isMobile ? "0 10px 30px rgba(0,0,0,0.25)" : "none",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              Kozan Admin
            </h2>

            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  border: "none",
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  width: "38px",
                  height: "38px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                ✕
              </button>
            )}
          </div>

          <NavLink
            to="/admin-dashboard"
            onClick={handleNavigate}
            style={({ isActive }) => ({
              ...linkBaseStyle,
              background: isActive ? "#2563eb" : "rgba(255,255,255,0.04)",
              color: "white",
              boxShadow: isActive ? "0 8px 20px rgba(37,99,235,0.35)" : "none",
            })}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin-orders"
            onClick={handleNavigate}
            style={({ isActive }) => ({
              ...linkBaseStyle,
              background: isActive ? "#2563eb" : "rgba(255,255,255,0.04)",
              color: "white",
              boxShadow: isActive ? "0 8px 20px rgba(37,99,235,0.35)" : "none",
            })}
          >
            Orders
          </NavLink>

          <NavLink
            to="/admin-products"
            onClick={handleNavigate}
            style={({ isActive }) => ({
              ...linkBaseStyle,
              background: isActive ? "#2563eb" : "rgba(255,255,255,0.04)",
              color: "white",
              boxShadow: isActive ? "0 8px 20px rgba(37,99,235,0.35)" : "none",
            })}
          >
            Products
          </NavLink>

          <NavLink
            to="/market"
            onClick={handleNavigate}
            style={({ isActive }) => ({
              ...linkBaseStyle,
              background: isActive ? "#2563eb" : "rgba(255,255,255,0.04)",
              color: "white",
              boxShadow: isActive ? "0 8px 20px rgba(37,99,235,0.35)" : "none",
            })}
          >
            Market
          </NavLink>
        </div>

        <div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "16px",
              border: "none",
              background: "#ef4444",
              color: "white",
              fontWeight: "800",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(239,68,68,0.30)",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: isMobile ? 0 : "290px",
        }}
      >
        {isMobile && (
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "#ffffffee",
              backdropFilter: "blur(8px)",
              borderBottom: "1px solid #e5e7eb",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                border: "none",
                background: "#2563eb",
                color: "white",
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: "800",
                boxShadow: "0 8px 20px rgba(37,99,235,0.30)",
              }}
            >
              ☰
            </button>

            <div>
              <div
                style={{
                  fontWeight: "800",
                  fontSize: "18px",
                  color: "#0f172a",
                }}
              >
                Kozan Admin
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                Admin Panel
              </div>
            </div>
          </div>
        )}

        <main
          style={{
            minWidth: 0,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;