import { Link, useNavigate } from "react-router-dom";

function MarketNavbar({ cartCount = 0, search = "", setSearch = () => {} }) {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };


  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "18px",
        marginBottom: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        border: "1px solid #eef2f7",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #14b8a6, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            K
          </div>

          <div>
            <h2 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>
              Kozan Market
            </h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              Smart shopping for everyone
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              minWidth: "240px",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #dbe4ee",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <button
            onClick={() => navigate("/market")}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "none",
              background: "#14b8a6",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/my-orders")}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid #dbe4ee",
              background: "white",
              color: "#0f172a",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            My Orders
          </button>

          <button
            onClick={() => navigate("/cart")}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Cart ({cartCount})
          </button>

          {!userInfo ? (
            <>
              <Link
                to="/login"
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #dbe4ee",
                  background: "white",
                  color: "#0f172a",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Login
              </Link>

              <Link
                to="/register"
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#0f172a",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  color: "#0f172a",
                  fontWeight: "600",
                }}
              >
                {userInfo.name || "User"}
              </div>

              <button
  onClick={() => navigate("/profile")}
  style={{
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #dbe4ee",
    background: "white",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Profile
</button>

              <button
                onClick={logoutHandler}
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketNavbar;