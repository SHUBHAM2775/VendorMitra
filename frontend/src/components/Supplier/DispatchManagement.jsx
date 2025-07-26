import React from "react";

const DispatchManagement = ({ orders, handleMarkDispatched }) => {
  const acceptedOrders = orders.filter(order => order.status === "accepted");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dispatch Management</h2>
      {acceptedOrders.map((order) => (
        <div key={order.id} className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <div className="font-semibold">
            Order #{order.id} 
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs ml-2">
              {order.status}
            </span>
          </div>
          <div className="text-sm text-gray-700">{order.customer} · {order.phone}</div>
          <div className="text-xs text-gray-500 mb-2">{order.address}</div>
          <div className="font-semibold">Total: ₹{order.total}</div>
          <button 
            className="mt-2 px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
            onClick={() => handleMarkDispatched(order.id)}
          >
            Mark Dispatched
          </button>
        </div>
      ))}
    </div>
  );
};

export default DispatchManagement; 