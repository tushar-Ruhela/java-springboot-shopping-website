import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { getCartItemsCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartItemsCount();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-bold text-sky-600 hover:text-sky-700 transition-colors duration-200"
          >
            <span className="text-3xl">🛍️</span>
            <span className="hidden sm:block">ShopHub</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Home Link */}
            <Link 
              to="/" 
              className="px-3 py-2 rounded-lg text-gray-600 hover:text-sky-600 hover:bg-sky-50 font-medium transition-all duration-200 text-sm md:text-base"
            >
              Home
            </Link>
            
            {/* Cart Link */}
            <Link 
              to="/cart" 
              className="relative px-3 py-2 rounded-lg text-gray-600 hover:text-sky-600 hover:bg-sky-50 font-medium transition-all duration-200 flex items-center gap-2 text-sm md:text-base"
            >
              <span className="text-xl">🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User Menu or Login/Signup */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg hover:bg-sky-100 hover:border-sky-300 transition-all duration-200 font-medium text-sm"
                >
                  <span className="text-lg">👤</span>
                  <span className="hidden md:block max-w-[120px] truncate">
                    {user?.username || 'User'}
                  </span>
                  <span className={`text-xs transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
                    {/* User Info */}
                    <div className="px-4 py-3 bg-sky-50 border-b border-sky-100">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {user?.fullName || user?.username}
                      </p>
                      <p className="text-xs text-gray-600 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    
                    {/* Logout Button */}
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all duration-200 text-sm font-medium"
                    >
                      <span className="text-base">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-sky-600 hover:bg-sky-50 font-semibold transition-all duration-200 text-sm md:text-base"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-sm md:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
