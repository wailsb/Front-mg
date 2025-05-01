import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';
import AdminRegister from './pages/auth/AdminRegister';
import AdminWaitingApproval from './pages/auth/AdminWaitingApproval';
import PublicProducts from './pages/public/Products';
import PublicProductDetails from './pages/public/ProductDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserProfile from './pages/user/Profile';
import ProductList from './pages/user/ProductList';
import ProductDetails from './pages/user/ProductDetails';
import Wishlist from './pages/user/Wishlist';
import OrderHistory from './pages/user/OrderHistory';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import UserSettings from './pages/user/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminAddProduct from './pages/admin/AddProduct';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';
import AdminStatistics from './pages/admin/Statistics';
import AdminSettings from './pages/admin/Settings';
import AdminPendingApprovals from './pages/admin/PendingApprovals';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Guards
// PublicRoute: For public pages like /login, /register, etc. Never redirects!
const PublicRoute = ({ children }) => {
  return <PublicLayout>{children}</PublicLayout>;
};

const UserRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  if (!currentUser) {
    // Always redirect to login if not authenticated - the routing should ensure this
    // component is never used for the login page itself
    return <Navigate to="/login" replace />;
  }
  
  // Redirect admins to admin dashboard if they try to access user routes
  if (currentUser.role === 'admin') {
    // Get the current path
    const path = window.location.pathname;
    
    // Map user routes to admin equivalents
    const routeMap = {
      '/dashboard': '/admin/dashboard',
      '/profile': '/admin/users',
      '/settings': '/admin/settings',
    };
    
    // If we have a mapping for this route, redirect to admin version
    if (routeMap[path]) {
      return <Navigate to={routeMap[path]} replace />;
    }
  }
  
  return <UserLayout>{children}</UserLayout>;
};

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }
  
  if (currentUser.role !== 'admin') {
    if (currentUser.pendingAdmin) {
      return <Navigate to="/admin/waiting-approval" />;
    }
    return <Navigate to="/" />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  // Auth is initialized in AuthProvider; no need to call checkAuth here.
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
      <Route path="/admin/register" element={<PublicRoute><AdminRegister /></PublicRoute>} />
      <Route path="/admin/waiting-approval" element={<PublicRoute><AdminWaitingApproval /></PublicRoute>} />
      <Route path="/products" element={<PublicRoute><PublicProducts /></PublicRoute>} />
      <Route path="/products/:id" element={<PublicRoute><PublicProductDetails /></PublicRoute>} />
      <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
      <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
      
      {/* User Routes */}
      <Route path="/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
      <Route path="/profile" element={<UserRoute><UserProfile /></UserRoute>} />
      <Route path="/user/products" element={<UserRoute><ProductList /></UserRoute>} />
      <Route path="/user/products/:id" element={<UserRoute><ProductDetails /></UserRoute>} />
      <Route path="/wishlist" element={<UserRoute><Wishlist /></UserRoute>} />
      <Route path="/orders" element={<UserRoute><OrderHistory /></UserRoute>} />
      <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
      <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
      <Route path="/settings" element={<UserRoute><UserSettings /></UserRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/products/add" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
      <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/statistics" element={<AdminRoute><AdminStatistics /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
      <Route path="/admin/pending-approvals" element={<AdminRoute><AdminPendingApprovals /></AdminRoute>} />
      
      {/* 404 - Catch All */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
