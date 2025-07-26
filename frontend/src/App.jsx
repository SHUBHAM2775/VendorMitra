import React, { useState } from "react";
import Header from "./components/Header";
import Cart from "./components/Cart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Supplier from "./components/Supplier.jsx";
import Admin from "./components/Admin";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [supplierInfo, setSupplierInfo] = useState({ name: "ABC Supplier", rating: 4.5, reviews: 120 });

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id, qty) => {
    if (qty <= 0) {
      // Remove item if quantity becomes 0 or negative
      handleRemoveItem(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item => item.id === id ? { ...item, quantity: qty } : item)
    );
  };

  const handleSupplierView = () => {
    window.location.href = "/supplier";
  };

  const handleAdminView = () => {
    window.location.href = "/admin";
  };

  return (
    <AuthProvider>
      <Router>
        <Header
          cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
          onCartClick={() => setShowCart(true)}
          onSupplierView={handleSupplierView}
          onAdminView={handleAdminView}
          supplierInfo={supplierInfo}
        />
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        {showCart && (
          <Cart
            items={cartItems}
            onClose={() => setShowCart(false)}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;
