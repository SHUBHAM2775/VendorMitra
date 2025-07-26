import React, { useState, useEffect } from 'react';
import { FaTimes, FaShoppingCart, FaClipboardList, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CartOrdersModal = ({ cartItems, myOrders, onClose, onRemoveItem, onUpdateQuantity, onCheckout }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('cart'); // 'cart' or 'orders'
  const [loading, setLoading] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Fetch user orders when orders tab is active
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (activeTab === 'orders' && user?._id) {
        setOrdersLoading(true);
        try {
          const orders = await orderAPI.getVendorOrders(user._id);
          setUserOrders(orders);
        } catch (error) {
          console.error('Error fetching user orders:', error);
          setUserOrders([]);
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    fetchUserOrders();
  }, [activeTab, user?._id]);

  // Handler for placing order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    
    try {
      // Get vendor and supplier information from cart items
      // For now, we'll use the first item's vendor/supplier info
      // In a real app, you'd group orders by vendor/supplier
      const firstItem = cartItems[0];
      
      // Generate a valid MongoDB ObjectId format for vendorId if not available
      // MongoDB ObjectIds are 24-character hex strings
      const generateObjectId = () => {
        return '507f1f77bcf86cd799439011'; // Valid demo ObjectId
      };
      
      const vendorId = user?._id || user?.vendorId || firstItem?.vendorId || generateObjectId();
      const supplierId = firstItem?.supplierId;
      
      if (!supplierId) {
        alert('Missing supplier information. Please try again.');
        setLoading(false);
        return;
      }
      
      // Validate that vendorId is a valid ObjectId format (24 hex characters)
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      const finalVendorId = objectIdRegex.test(vendorId) ? vendorId : generateObjectId();
      
      const orderData = {
        vendorId: finalVendorId,
        supplierId,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price
        })),
        deliveryType: 'pickup', // You can make this dynamic if needed
      };
      
      const result = await orderAPI.placeOrder(orderData);
      alert('Order placed successfully!');
      
      // Clear cart after successful order
      if (onCheckout) {
        onCheckout();
      }
      
      // Automatically switch to My Orders tab and refresh orders
      setActiveTab('orders');
      
      setLoading(false);
      
      // Refresh orders after successful placement
      if (user?._id) {
        try {
          const orders = await orderAPI.getVendorOrders(user._id);
          setUserOrders(orders);
        } catch (error) {
          console.error('Error refreshing orders:', error);
        }
      }
      
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
            {ordersLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your orders...</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-7xl mb-6">📦</div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">No orders yet</h3>
                <p className="text-gray-500">Your orders will appear here after checkout.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order, idx) => (
                  <div key={order._id} className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Order #{order._id.slice(-8)}</h3>
                        <p className="text-sm text-gray-500">
                          Placed on: {new Date(order.orderedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">₹{order.totalPrice}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'dispatched' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Order Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center justify-between bg-white p-3 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-800">Product ID: {item.productId}</div>
                              <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-800">₹{item.unitPrice}</div>
                              <div className="text-sm text-gray-500">Unit Price</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Delivery Type: </span>
                          <span className="font-medium capitalize">{order.deliveryType}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Updated: </span>
                          <span className="font-medium">
                            {new Date(order.updatedAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
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