import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle, FaShoppingCart, FaHeart, FaBars, FaTimes, FaIndustry } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FaIndustry className="h-8 w-8 text-amber-500 mr-2" />
              <span className="font-bold text-xl tracking-tight">Industrial Supply</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 hover:text-amber-500 transition-colors">Home</Link>
            <Link to="/products" className="px-3 py-2 hover:text-amber-500 transition-colors">Products</Link>
            <Link to="/about" className="px-3 py-2 hover:text-amber-500 transition-colors">About</Link>
            <Link to="/contact" className="px-3 py-2 hover:text-amber-500 transition-colors">Contact</Link>
            
            {currentUser ? (
              <>
                {/* Logged in user menu */}
                <div className="flex items-center space-x-2">
                  <Link to="/cart" className="relative p-2 hover:text-amber-500">
                    <FaShoppingCart className="h-5 w-5" />
                  </Link>
                  <Link to="/wishlist" className="p-2 hover:text-amber-500">
                    <FaHeart className="h-5 w-5" />
                  </Link>
                  <div className="relative inline-block text-left">
                    <button 
                      className="flex items-center px-3 py-2 rounded-md hover:text-amber-500"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <FaUserCircle className="h-5 w-5 mr-1" />
                      <span>{currentUser.name}</span>
                    </button>
                    {isDropdownOpen && (
                      <div 
                        className="absolute right-0 w-48 mt-2 origin-top-right bg-gray-800 rounded-md shadow-lg z-10"
                        onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        <div className="py-1 rounded-md shadow-xs">
                          <Link 
                            to={currentUser.role === 'admin' ? "/admin/dashboard" : "/dashboard"} 
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                          >
                            Dashboard
                          </Link>
                          <Link 
                            to="/profile" 
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                          >
                            Profile
                          </Link>
                          <Link 
                            to={currentUser.role === 'admin' ? "/admin/orders" : "/orders"} 
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                          >
                            Orders
                          </Link>
                          <Link 
                            to={currentUser.role === 'admin' ? "/admin/settings" : "/settings"} 
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                          >
                            Settings
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Login/Register buttons */}
                <Link 
                  to="/login" 
                  className="px-3 py-2 border border-amber-500 text-amber-500 rounded-md hover:bg-amber-500 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-3 py-2 bg-amber-500 text-gray-900 font-bold rounded-md hover:bg-amber-600 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-500 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="block px-3 py-2 hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 hover:bg-gray-800 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to={currentUser.role === 'admin' ? "/admin/dashboard" : "/dashboard"} 
                  className="block px-3 py-2 hover:bg-gray-800 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 hover:bg-gray-800 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/cart" 
                  className="block px-3 py-2 hover:bg-gray-800 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart
                </Link>
                <Link 
                  to="/wishlist" 
                  className="block px-3 py-2 hover:bg-gray-800 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-800 rounded-md"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 hover:bg-gray-800 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 hover:bg-gray-800 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
