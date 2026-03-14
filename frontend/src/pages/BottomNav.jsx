import { Link, useLocation } from "react-router-dom";

function BottomNav() {
  const location = useLocation();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-nav">
      <Link to="/market" className={`bottom-nav-item ${isActive("/market") ? "active" : ""}`}>
        <span>🏠</span>
        <p>Home</p>
      </Link>

      <Link to="/my-orders" className={`bottom-nav-item ${isActive("/my-orders") ? "active" : ""}`}>
        <span>📦</span>
        <p>Orders</p>
      </Link>

      <Link to="/cart" className={`bottom-nav-item ${isActive("/cart") ? "active" : ""}`}>
        <div className="cart-icon-wrap">
          <span>🛒</span>
          {cartCount > 0 && <small className="cart-badge">{cartCount}</small>}
        </div>
        <p>Cart</p>
      </Link>

      <Link to="/profile" className={`bottom-nav-item ${isActive("/profile") ? "active" : ""}`}>
        <span>👤</span>
        <p>Profile</p>
      </Link>
    </div>
  );
}

export default BottomNav;