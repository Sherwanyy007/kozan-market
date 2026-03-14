import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketNavbar from "./MarketNavbar";
import BottomNav from "./BottomNav";

function ProfilePage() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = "Profile | Kozan Market";

    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUserInfo(storedUser);
      setName(storedUser.name || "");
      setEmail(storedUser.email || "");
      setPhone(storedUser.phone || "");
    }
  }, []);

  const memberLabel = useMemo(() => {
    if (!userInfo) return "Guest";
    if (userInfo.isAdmin) return "Admin Account";
    return "Customer Account";
  }, [userInfo]);

  const saveProfile = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    const updatedUser = {
      ...(userInfo || {}),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    setUserInfo(updatedUser);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const logout = () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;

    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const initials = useMemo(() => {
    const value = (name || userInfo?.name || "U").trim();
    return value
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [name, userInfo]);

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
              ACCOUNT OVERVIEW
            </p>
            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: "40px",
                lineHeight: 1.12,
                fontWeight: "900",
              }}
            >
              My Profile
            </h1>
            <p
              style={{
                margin: 0,
                opacity: 0.95,
                lineHeight: 1.7,
                maxWidth: "620px",
              }}
            >
              Manage your personal details, review your account information, and
              keep your shopping experience fast and organized.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/market")} style={heroWhiteButtonStyle}>
              Back to Market
            </button>
            <button onClick={() => navigate("/my-orders")} style={heroOutlineButtonStyle}>
              My Orders
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "20px",
            alignItems: "start",
          }}
        >
          <div
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
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "18px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontSize: "28px",
                    fontWeight: "900",
                  }}
                >
                  Edit Profile
                </h2>
                <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
                  Update your account information here
                </p>
              </div>

              {saved && (
                <div
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "10px 14px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: "800",
                  }}
                >
                  Profile saved successfully
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
              }}
            >
              <input
                style={inputStyle}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Account Type"
                value={memberLabel}
                disabled
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "18px",
              }}
            >
              <button onClick={saveProfile} style={primaryButtonStyle}>
                Save Changes
              </button>

              <button onClick={logout} style={dangerButtonStyle}>
                Logout
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            <div
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
                  gap: "16px",
                  alignItems: "center",
                  marginBottom: "18px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "76px",
                    height: "76px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#14b8a6,#2563eb)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "900",
                    fontSize: "26px",
                    boxShadow: "0 10px 20px rgba(37,99,235,0.16)",
                  }}
                >
                  {initials}
                </div>

                <div>
                  <h2
                    style={{
                      margin: "0 0 6px 0",
                      color: "#0f172a",
                      fontSize: "28px",
                      fontWeight: "900",
                    }}
                  >
                    {name || "User"}
                  </h2>
                  <p style={{ margin: 0, color: "#64748b", fontWeight: "700" }}>
                    {memberLabel}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={infoCardStyle}>
                  <p style={infoLabelStyle}>Name</p>
                  <strong>{name || "-"}</strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={infoLabelStyle}>Email</p>
                  <strong>{email || "-"}</strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={infoLabelStyle}>Phone</p>
                  <strong>{phone || "-"}</strong>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "26px",
                padding: "22px",
                boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
                border: "1px solid #eef2f7",
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px 0",
                  color: "#0f172a",
                  fontSize: "26px",
                  fontWeight: "900",
                }}
              >
                Quick Actions
              </h2>

              <div style={{ display: "grid", gap: "10px" }}>
                <button
                  onClick={() => navigate("/address")}
                  style={secondaryWideButtonStyle}
                >
                  Manage Address
                </button>

                <button
                  onClick={() => navigate("/my-orders")}
                  style={secondaryWideButtonStyle}
                >
                  View My Orders
                </button>

                <button
                  onClick={() => navigate("/market")}
                  style={primaryWideButtonStyle}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
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

const primaryButtonStyle = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg,#14b8a6,#2563eb)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(37,99,235,0.16)",
};

const dangerButtonStyle = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  background: "#ef4444",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const heroWhiteButtonStyle = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  background: "white",
  color: "#0f172a",
  fontWeight: "800",
  cursor: "pointer",
};

const heroOutlineButtonStyle = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.35)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
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

const primaryWideButtonStyle = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg,#14b8a6,#2563eb)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(37,99,235,0.16)",
};

export default ProfilePage;