import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";

import App from "./App";
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AddressPage from "./pages/AddressPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import CustomerMarketPage from "./pages/CustomerMarketPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import AdminRoute from "./pages/AdminRoute";
import AdminDashboard from "./pages/Admindashboard";
import ProductPage from "./pages/ProductPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminLayout from "./pages/AdminLayout";
import BrandsPage from "./pages/BrandsPage";
import BrandProductsPage from "./pages/BrandProductsPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerMarketPage />} />
        <Route path="/market" element={<CustomerMarketPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/order/:id" element={<OrderTrackingPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/brands/:brandName" element={<BrandProductsPage />} />

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Old Admin App */}
        <Route path="/old-admin-app" element={<App />} />

        {/* Admin Routes with Sidebar Layout */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-orders" element={<AdminOrdersPage />} />
          <Route path="/admin-products" element={<AdminProductsPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);