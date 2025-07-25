import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      {/* Logo and Title */}
      <div>
        <div className="text-2xl font-bold text-green-600">RawMart</div>
        <div className="text-sm text-gray-500 -mt-1">Vendor Marketplace</div>
      </div>

      {/* User Info and Cart */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-gray-500 text-sm">Welcome back,</div>
          <div className="font-medium text-gray-800">Raj Kumar</div>
        </div>
        <button className="flex items-center gap-2 border px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
          <FaShoppingCart className="text-lg" />
          <span>Cart (0)</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
