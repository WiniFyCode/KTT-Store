import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider as AdminThemeProvider } from './contexts/AdminThemeContext';
import { ThemeProvider as CustomerThemeProvider } from './contexts/CustomerThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminRegister from "./pages/admin/Register";
import AdminForgotPassword from "./pages/admin/ForgotPassword";
import Dashboard from './pages/admin/Dashboard';
import Customers from './pages/admin/CustomerMangement';
// import Products from "./pages/admin/ProductManagement";
import ProductBackup from "./pages/admin/ProductManagement.backup";
import Orders from "./pages/admin/OrderManagement";
import Coupons from "./pages/admin/CouponManagement";
import Notifications from './pages/admin/NotificationManagement';

// Customer Pages
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import ForgotPassword from "./pages/customer/ForgotPassword";
import Home from "./pages/customer/Home";
import ProductList from "./pages/customer/Products";
import MenProducts from "./pages/customer/MenProducts";
import WomenProducts from "./pages/customer/WomenProducts";
import SaleProducts from "./pages/customer/SaleProducts";
import NewArrivals from "./pages/customer/NewArrivals";
import TetCollection from "./pages/customer/TetCollection";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Profile from "./pages/customer/Profile";
import Wishlist from "./pages/customer/Wishlist";
import OrderHistory from "./pages/customer/OrderHistory";
import CustomerOrders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import News from "./pages/customer/News";
import NewsDetail from "./pages/customer/NewsDetail";
import About from "./pages/customer/About";
import NotFound from "./pages/NotFound";

// Policy Pages
import ShippingPolicy from "./pages/customer/policy/ShippingPolicy";
import ReturnPolicy from "./pages/customer/policy/ReturnPolicy";
import PaymentPolicy from "./pages/customer/policy/PaymentPolicy";
import Policy from "./pages/customer/policy/Policy";

// Support Pages
import FAQ from "./pages/customer/support/FAQ";
import SizeGuide from "./pages/customer/support/SizeGuide";
import Contact from "./pages/customer/support/Contact";
import Support from "./pages/customer/support/Support";

// Connect
import Connect from "./pages/customer/connect/Connect";

// Promotion Page
import Promotion from "./pages/customer/promotion/Promotion";

// Layouts
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';

function App() {
  return (
    <AdminThemeProvider>
      <CustomerThemeProvider>
        <Router>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="products" element={<ProductList />} />
              <Route path="nam" element={<MenProducts />} />
              <Route path="nu" element={<WomenProducts />} />
              <Route path="sale" element={<SaleProducts />} />
              <Route path="sale-tet" element={<SaleProducts />} />
              <Route path="new-arrivals" element={<NewArrivals />} />
              <Route path="tet-collection" element={<TetCollection />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="order-history" element={<OrderHistory />} />
              <Route path="news" element={<News />} />
              <Route path="news/:id" element={<NewsDetail />} />
              <Route path="about" element={<About />} />

              {/* Policy Pages */}
              <Route path="policy">
                <Route index element={<Policy />} />
                <Route path="shipping" element={<ShippingPolicy />} />
                <Route path="return" element={<ReturnPolicy />} />
                <Route path="payment" element={<PaymentPolicy />} />
              </Route>

              {/* Support Pages */}
              <Route path="support">
                <Route index element={<Support />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="size-guide" element={<SizeGuide />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              {/* Connect */}
              <Route path="connect" element={<Connect />} />

              {/* Promotion Page */}
              <Route path="promotion" element={<Promotion />} />
            </Route>

            {/* Customer Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin Auth Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

            {/* Routes sử dụng AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              {/* Chuyển hướng /admin về /admin/dashboard */}
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<ProductBackup />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="settings" element={<div>Settings</div>} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* Route cho trang 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={1500} />
      </CustomerThemeProvider>
    </AdminThemeProvider>
  );
}

export default App;
