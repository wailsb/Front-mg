import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useSite } from '../contexts/SiteContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const PublicLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const { siteName } = useSite();
  const { t } = useLanguage();

  useEffect(() => {
    if (siteName) document.title = siteName;
  }, [siteName]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-yellow-500">
            {t.siteName || "Industrie Import"}
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`${location.pathname === '/' ? 'text-yellow-500' : 'text-gray-600'} hover:text-yellow-500`}>
              {t.navigation?.home || 'Home'}
            </Link>
            <Link to="/products" className={`${location.pathname.includes('/products') ? 'text-yellow-500' : 'text-gray-600'} hover:text-yellow-500`}>
              {t.navigation?.shop || 'Products'}
            </Link>
            <Link to="/about" className={`${location.pathname === '/about' ? 'text-yellow-500' : 'text-gray-600'} hover:text-yellow-500`}>
              {t.navigation?.about || 'About'}
            </Link>
            <Link to="/contact" className={`${location.pathname === '/contact' ? 'text-yellow-500' : 'text-gray-600'} hover:text-yellow-500`}>
              {t.navigation?.contact || 'Contact'}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {currentUser ? (
              <>
                <Link to="/cart" className="text-gray-600 hover:text-yellow-500">
                  <FaShoppingCart className="text-xl" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-yellow-500">
                    <FaUser className="text-xl" />
                    <span className="hidden md:inline">{currentUser.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-yellow-50">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-yellow-50">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-yellow-50">
                      Orders
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-yellow-50">
                      Wishlist
                    </Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-yellow-500 flex items-center">
                  <FaSignInAlt className="mr-1" />
                  <span className="hidden md:inline">Login</span>
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-yellow-500 flex items-center">
                  <FaUserPlus className="mr-1" />
                  <span className="hidden md:inline">Register</span>
                </Link>
                <Link to="/admin/login" className="bg-gray-900 text-yellow-500 px-4 py-2 rounded-md hover:bg-gray-800 border border-yellow-500">
                  Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">StockManager</h3>
              <p className="text-gray-300">
                Comprehensive stock management solution for businesses of all sizes.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-300 hover:text-white">Products</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-gray-300 hover:text-white">Shipping Policy</Link>
                </li>
                <li>
                  <Link to="/returns" className="text-gray-300 hover:text-white">Returns & Refunds</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="text-gray-300 not-italic">
                <p>123 Stock Street</p>
                <p>Inventory City, ST 12345</p>
                <p>Email: info@stockmanager.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} StockManager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
