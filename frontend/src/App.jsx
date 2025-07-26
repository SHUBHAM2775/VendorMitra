import React, { useState } from "react";
import Header from "./components/Header";
import CartOrdersModal from "./components/CartOrdersModal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Supplier from "./components/Supplier.jsx";
import Admin from "./components/Admin";
import RoleRoute from "./components/RoleRoute.jsx";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
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

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setMyOrders(prevOrders => [...cartItems, ...prevOrders]);
    setCartItems([]);
  };

  return (
    <AuthProvider>
      <Router>
        <Header
          cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
          onCartClick={() => setShowCart(true)}
          supplierInfo={supplierInfo}
        />
        <Routes>
          <Route 
            path="/" 
            element={<Home onAddToCart={handleAddToCart} />}
          />
          <Route 
            path="/supplier" 
            element={
              <RoleRoute allowedRoles={['supplier']}>
                <Supplier />
              </RoleRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <RoleRoute allowedRoles={['admin']}>
                <Admin />
              </RoleRoute>
            } 
          />
        </Routes>
        {showCart && (
          <CartOrdersModal
            cartItems={cartItems}
            myOrders={myOrders}
            onClose={() => setShowCart(false)}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleCheckout}
          />
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;
