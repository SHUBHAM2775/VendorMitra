import React from "react";

const OrderManagement = ({ orders, handleAcceptOrder, handleRejectOrder }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Incoming Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className={`border-l-4 p-4 rounded mb-4 ${
          order.status === "pending" ? "bg-yellow-50 border-yellow-400" :
          order.status === "accepted" ? "bg-green-50 border-green-400" :
          order.status === "dispatched" ? "bg-blue-50 border-blue-400" :
          "bg-red-50 border-red-400"
        }`}>
          <div className="font-semibold">
            Order #{order.id} 
            <span className={`px-2 py-1 rounded text-xs ml-2 ${
              order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
              order.status === "accepted" ? "bg-green-100 text-green-700" :
              order.status === "dispatched" ? "bg-blue-100 text-blue-700" :
              "bg-red-100 text-red-700"
            }`}>
              {order.status}
            </span>
          </div>
          <div className="text-sm text-gray-700">{order.customer} · {order.phone}</div>
          <div className="text-xs text-gray-500 mb-2">{order.address} · Order Date: {order.orderDate}</div>
          <div className="text-sm">Items:</div>
          <ul className="text-xs text-gray-700 mb-2">
            {order.items.map((item, idx) => (
              <li key={idx}>{item.name} x {item.quantity} – ₹{item.price}</li>
            ))}
          </ul>
          <div className="font-semibold">Total: ₹{order.total}</div>
          {order.status === "pending" && (
            <div className="flex gap-2 mt-2">
              <button 
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => handleRejectOrder(order.id)}
              >
                Reject
              </button>
              <button 
                className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                onClick={() => handleAcceptOrder(order.id)}
              >
                Accept
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderManagement; 