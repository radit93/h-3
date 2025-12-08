import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";

import Main from "./pages/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/User/Dashboard";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import CategoryPage from "./pages/Category/CategoryPage";

import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";
import AdminRoute from "./route/AdminRoute";

import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import ProfileAdmin from "./pages/Admin/ProfileAdmin";
import ProductsPage from "./pages/Admin/Products/ProductsPage";
import OrdersPage from "./pages/Admin/Orders/OrdersPage";
import AddProduct from "./pages/Admin/Products/AddProduct";
import EditProduct from "./pages/Admin/Products/EditProduct";
import EditVariant from "./pages/Admin/Products/EditVariants";

import ProductDetails from "./pages/ProductDetails";

import CheckoutPage from "./pages/CheckoutPage";
import Ordersuccess from "./pages/Ordersuccess";
import UserOrders from "./pages/UserOrders";
import OrderDetail from "./pages/OrderDetail";

export default function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/cart") ||
    location.pathname.startsWith("/wishlist") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/orders") ||
    location.pathname.startsWith("/order") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/checkout");


  return (
    <>
      {!hideLayout && <Header />}

      <Routes>

        <Route path="/" element={<Main />} />

        {/* Auth */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Category */}
        <Route path="/category/:main" element={<CategoryPage />} />
        <Route path="/category/:main/:sub" element={<CategoryPage />} />

        {/* Product */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* User */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        {/* ORDER SYSTEM */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><Ordersuccess /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/:id/variants" element={<EditVariant />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        {/* Wrong routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}
