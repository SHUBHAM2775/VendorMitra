import React, { useState } from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import Supplier from "./components/Supplier";
import Cart from "./components/Cart";
import { Routes, Route, useNavigate } from "react-router-dom";

const supplierInfo = {
  name: "Mumbai Fresh Supplies",
  rating: 4.5,
  reviews: 127
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const exists = cartItems.find((item) => item.id === product.id);
    if (exists) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <>
      <Header
        onSupplierView={() => navigate("/supplier")}
        cartItems={cartItems}
        onCartClick={() => setShowCart(true)}
        supplierInfo={location.pathname === "/supplier" ? supplierInfo : undefined}
      />
      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/supplier" element={<Supplier />} />
      </Routes>
      {showCart && (
        <Cart
          items={cartItems}
          onClose={() => setShowCart(false)}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}
    </>
  );
}

export default App;
