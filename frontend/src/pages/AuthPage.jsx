import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "Erbil",
    area: "ZinCity",
    houseNumber: "",
    addressDetails: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", loginData);

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setMessage("چوونەژوورەوە سەرکەوتوو بوو");
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "چوونەژوورەوە سەرکەوتوو نەبوو");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", registerData);

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setMessage("خۆتۆمارکردن سەرکەوتوو بوو");
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "خۆتۆمارکردن سەرکەوتوو نەبوو");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.tabs}>
          <button
            onClick={() => {
              setActiveTab("login");
              setError("");
              setMessage("");
            }}
            style={activeTab === "login" ? styles.activeTab : styles.tab}
          >
            چوونەژوورەوە
          </button>

          <button
            onClick={() => {
              setActiveTab("register");
              setError("");
              setMessage("");
            }}
            style={activeTab === "register" ? styles.activeTab : styles.tab}
          >
            خۆتۆمارکردن
          </button>
        </div>

        <h2 style={styles.title}>
          {activeTab === "login" ? "چوونەژوورەوە" : "خۆتۆمارکردن"}
        </h2>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        {activeTab === "login" ? (
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              name="email"
              placeholder="ئیمەیڵ"
              value={loginData.email}
              onChange={handleLoginChange}
              style={styles.input}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="وشەی نهێنی"
              value={loginData.password}
              onChange={handleLoginChange}
              style={styles.input}
              required
            />

            <button type="submit" style={styles.button}>
              چوونەژوورەوە
            </button>

            <Link to="/forgot-password" style={styles.link}>
              وشەی نهێنیت لەبیرکردووە؟
            </Link>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="ناوی تەواو"
              value={registerData.name}
              onChange={handleRegisterChange}
              style={styles.input}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="ئیمەیڵ"
              value={registerData.email}
              onChange={handleRegisterChange}
              style={styles.input}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="ژمارەی مۆبایل"
              value={registerData.phone}
              onChange={handleRegisterChange}
              style={styles.input}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="وشەی نهێنی"
              value={registerData.password}
              onChange={handleRegisterChange}
              style={styles.input}
              required
            />

            <input
              type="text"
              name="city"
              placeholder="شار"
              value={registerData.city}
              onChange={handleRegisterChange}
              style={styles.input}
              required
            />

            <input
              type="text"
              name="area"
              placeholder="ناوچە"
              value={registerData.area}
              onChange={handleRegisterChange}
              style={styles.input}
              required
            />

            <input
              type="text"
              name="houseNumber"
              placeholder="ژمارەی خانوو"
              value={registerData.houseNumber}
              onChange={handleRegisterChange}
              style={styles.input}
            />

            <textarea
              name="addressDetails"
              placeholder="وردەکاری ناونیشان"
              value={registerData.addressDetails}
              onChange={handleRegisterChange}
              style={styles.textarea}
            />

            <button type="submit" style={styles.button}>
              خۆتۆماربکە
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },
  tabs: {
    display: "flex",
    background: "#111827",
    borderRadius: "14px",
    padding: "6px",
    marginBottom: "20px",
    gap: "8px",
  },
  tab: {
    flex: 1,
    border: "none",
    background: "transparent",
    color: "#fff",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
  activeTab: {
    flex: 1,
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
  title: {
    textAlign: "center",
    marginBottom: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
  },
  textarea: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    minHeight: "90px",
    resize: "vertical",
  },
  button: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    padding: "14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    marginTop: "6px",
    color: "#2563eb",
    textDecoration: "none",
  },
  success: {
    textAlign: "center",
    color: "green",
    marginBottom: "12px",
  },
  error: {
    textAlign: "center",
    color: "red",
    marginBottom: "12px",
  },
};

export default AuthPage;