import React, { useState } from 'react';
import { FaTimes, FaShoppingCart, FaClipboardList, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const CartOrdersModal = ({ cartItems, myOrders, onClose, onRemoveItem, onUpdateQuantity, onCheckout }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('cart'); // 'cart' or 'orders'
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Handler for placing order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const vendorId = cartItems[0]?.vendorId;
      const supplierId = cartItems[0]?.supplierId;
      if (!vendorId || !supplierId) {
        alert('Missing vendor or supplier information.');
        setLoading(false);
        return;
      }
  
      const orderData = {
        vendorId,
        supplierId,
        items: cartItems.map(item => ({
          productId: item.id || item.productId,
          quantity: item.quantity,
          unitPrice: item.price
        })),
        deliveryType: 'pickup',
      };
  
      const response = await fetch('http://localhost:5000/api/orders/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert('Order failed: ' + (errorData.message || response.statusText));
        setLoading(false);
        return;
      }
  
      await response.json();
      alert('Order placed successfully!');
  
      // ✅ Switch to My Orders tab
      setActiveTab('orders');
  
      // Optionally clear cart
      // clearCart(); // if you have a function for this
  
      setLoading(false);
    } catch (error) {
      alert('Order failed: ' + error.message);
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-green-50 sticky top-0 z-10">
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-lg transition-all ${activeTab === 'cart' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('cart')}
          >
            <FaShoppingCart /> {t('cart')}
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-lg transition-all ${activeTab === 'orders' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaClipboardList /> My Orders
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-green-600 text-3xl font-bold focus:outline-none"
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 overflow-y-auto">
        {activeTab === 'cart' && (
          <div className="w-full mx-auto">
            <h2 className="text-3xl font-extrabold mb-8 text-green-700 flex items-center gap-3"><FaShoppingCart className="text-2xl" /> Cart</h2>
            {cartItems.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-7xl mb-6">🛒</div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Add some items to get started!</p>
              </div>
            ) : (
              <>
                <div className="space-y-6 mb-32">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-xl border"
                      />
                      <div className="flex-1 w-full flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-xl font-bold text-gray-900 truncate">{item.name}</div>
                          <div className="text-sm text-gray-500 truncate">{item.supplier}</div>
                          <div className="text-lg font-bold text-green-600 mt-2">₹{item.price}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`w-10 h-10 flex items-center justify-center rounded-full text-xl transition ${
                              item.quantity <= 1 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-gray-200 hover:bg-gray-300 text-green-700"
                            }`}
                          >
                            <FaMinus />
                          </button>
                          <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-200 hover:bg-green-300 text-green-800 text-xl transition"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-xl transition ml-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Sticky Checkout Bar */}
                <div className="fixed bottom-0 left-0 w-full flex justify-center bg-white border-t py-6 z-20">
                  <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                    <div className="text-2xl font-bold text-gray-800">Total:</div>
                    <div className="text-3xl font-extrabold text-green-600">₹{totalPrice}</div>
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full md:w-64 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-md transition disabled:opacity-50"
                      disabled={cartItems.length === 0 || loading}
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="w-full mx-auto">
            <h2 className="text-3xl font-extrabold mb-8 text-green-700 flex items-center gap-3"><FaClipboardList className="text-2xl" /> My Orders</h2>
            {myOrders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-7xl mb-6">📦</div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No orders yet</h3>
                <p className="text-gray-500">Your orders will appear here after checkout.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {myOrders.map((item, idx) => (
                  <div key={item.id + '-' + idx} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-xl border"
                    />
                    <div className="flex-1 w-full flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-xl font-bold text-gray-900 truncate">{item.name}</div>
                        <div className="text-sm text-gray-500 truncate">{item.supplier}</div>
                        <div className="text-lg font-bold text-green-600 mt-2">₹{item.price}</div>
                        <div className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartOrdersModal; 