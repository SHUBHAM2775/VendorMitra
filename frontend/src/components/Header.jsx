import React, { useState } from "react";
import {
  FaShoppingCart,
  FaGlobeAsia,
  FaUserFriends,
  FaStar,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Login from "../auth/Login";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ onSupplierView, onAdminView, supplierInfo, cartCount = 0, onCartClick }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const { user, isLoading, login, logout } = useAuth();

  const handleLoginClick = () => setShowLogin(true);
  const handleLoginSuccess = (userData) => {
    login(userData);
    setShowLogin(false);
  };
  const handleLogout = () => {
    logout();
  };

  // Detect if on /supplier route
  const isSupplier = location.pathname === "/supplier";
  // Detect if on /admin route
  const isAdmin = location.pathname === "/admin";

  return (
    <>
      <header className="bg-white shadow-md py-3 px-8 flex items-center justify-between">
        {/* Left: Logo and App Name */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl flex-shrink-0">
            <span role="img" aria-label="logo">🌱</span>
          </span>
          <div className="min-w-0">
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {t('title')}
              <span className="flex items-center text-gray-700 text-base font-normal ml-2 whitespace-nowrap">
                <FaUserFriends className="mr-1" />
                {t('vendors')}
              </span>
            </div>
            <div className="text-sm text-gray-500 -mt-1 whitespace-nowrap overflow-hidden text-ellipsis">{t('subtitle')}</div>
          </div>
        </div>

        {/* Right: Language Toggle, Supplier View, Login/Signup or User Info/Cart */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-50 border rounded-lg px-2 py-1">
            <FaGlobeAsia className="mr-2 text-gray-500" />
            <button
              className={`px-3 py-1 rounded-md font-semibold transition ${
                language === "en"
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => i18n.changeLanguage("en")}
            >
              EN
            </button>
            <button
              className={`px-3 py-1 rounded-md font-semibold transition ${
                language === "hi"
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => i18n.changeLanguage("hi")}
            >
              हिंदी
            </button>
          </div>
          {/* Supplier View Button (hide on /supplier and /admin) */}
          {!isSupplier && !isAdmin && (
            <button
              className="border px-4 py-2 rounded-lg shadow-sm hover:bg-green-100 transition text-green-700 font-medium"
              onClick={onSupplierView}
            >
              Supplier View
            </button>
          )}
          {/* Admin View Button (hide on /supplier and /admin) */}
          {!isSupplier && !isAdmin && (
            <button
              className="border px-4 py-2 rounded-lg shadow-sm hover:bg-blue-100 transition text-blue-700 font-medium"
              onClick={onAdminView}
            >
              Admin View
            </button>
          )}
          {!user && !isLoading && (
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
              onClick={handleLoginClick}
            >
              Login / Signup
            </button>
          )}
          {isLoading && (
            <div className="text-gray-500 text-sm">Loading...</div>
          )}
          {user && (
            <>
              <div className="text-right ml-4">
                <div className="text-gray-500 text-sm">Welcome</div>
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
              <button 
                onClick={onCartClick}
                className={`flex items-center gap-2 border px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition ml-4 relative ${
                  cartCount > 0 ? 'border-green-300 bg-green-50' : ''
                }`}
              >
                <FaShoppingCart className={`text-lg transition-transform ${cartCount > 0 ? 'scale-110' : ''}`} />
                <span>
                  {t('cart')} ({cartCount})
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
              <button className="ml-4 text-sm text-red-600 hover:underline cursor-pointer" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
        {showLogin && <Login onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />}
      </header>
      {/* Supplier extra header content */}
      {isSupplier && supplierInfo && (
        <div className="bg-white shadow-sm px-8 pb-2 flex items-center justify-between">
          <div className="text-right">
            <div className="text-gray-500 text-sm">Welcome,</div>
            <div className="font-medium text-gray-800">{supplierInfo.name}</div>
          </div>
          <div className="flex items-center gap-1 text-yellow-600 font-semibold">
            <FaStar className="text-lg" />
            <span>{supplierInfo.rating}</span>
            <span className="text-gray-400 text-xs">({supplierInfo.reviews} reviews)</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
