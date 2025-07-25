import React, { useState } from "react";
import { FaBox, FaShoppingCart, FaTruck, FaRupeeSign, FaStar } from "react-icons/fa";

const summaryData = [
  { label: "Total Products", value: 2, icon: <FaBox className="text-green-600 text-xl" /> },
  { label: "Pending Orders", value: 1, icon: <FaShoppingCart className="text-yellow-500 text-xl" /> },
  { label: "In Transit", value: 0, icon: <FaTruck className="text-blue-500 text-xl" /> },
  { label: "Monthly Revenue", value: "₹45,670", icon: <FaRupeeSign className="text-green-600 text-xl" /> },
];

const initialProducts = [
  {
    name: "Premium Basmati Rice",
    desc: "High quality aged basmati rice, 25kg bag",
    category: "Grains",
    price: "₹2500",
    stock: 50,
    status: "available",
  },
  {
    name: "Organic Turmeric Powder",
    desc: "Pure organic turmeric powder, 1kg pack",
    category: "Spices",
    price: "₹450",
    stock: 30,
    status: "available",
  },
];

const Supplier = () => {
  const [tab, setTab] = useState("Products");
  const [products, setProducts] = useState(initialProducts);
  const [editIndex, setEditIndex] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const handleEditClick = (idx) => {
    const { category, price, stock, status } = products[idx];
    setEditIndex(idx);
    setEditProduct({ category, price, stock, status });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    setProducts((prev) =>
      prev.map((p, idx) =>
        idx === editIndex ? { ...p, ...editProduct } : p
      )
    );
    setEditIndex(null);
    setEditProduct(null);
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {/* Header removed: now handled globally by Header.jsx */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-8 py-6">
        {summaryData.map((item) => (
          <div key={item.label} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div>{item.icon}</div>
            <div>
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="text-xl font-bold text-gray-800">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 px-8">
        {["Products", "Orders", "Dispatch"].map((t) => (
          <button
            key={t}
            className={`px-8 py-2 rounded-t-lg font-medium transition-colors duration-200 ${tab === t ? "bg-white text-green-600 shadow" : "bg-transparent text-gray-500"}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow mx-8 mb-8 p-6 mt-0">
        {tab === "Products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Product Catalog</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition">+ Add Product</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="py-2">Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => (
                  <tr key={p.name} className="border-b last:border-b-0">
                    <td className="py-3">
                      <div className="font-semibold text-gray-800">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.desc}</div>
                      {/* If you want to show unit, add here: */}
                      {/* <div className="text-xs text-gray-400 italic">{p.unit}</div> */}
                    </td>
                    <td>
                      {editIndex === idx ? (
                        <input
                          className="border rounded px-2 py-1 w-full"
                          name="category"
                          value={editProduct.category}
                          onChange={handleEditChange}
                        />
                      ) : (
                        p.category
                      )}
                    </td>
                    <td>
                      {editIndex === idx ? (
                        <input
                          className="border rounded px-2 py-1 w-full"
                          name="price"
                          value={editProduct.price}
                          onChange={handleEditChange}
                        />
                      ) : (
                        p.price
                      )}
                    </td>
                    <td>
                      {editIndex === idx ? (
                        <input
                          className="border rounded px-2 py-1 w-full"
                          name="stock"
                          type="number"
                          value={editProduct.stock}
                          onChange={handleEditChange}
                        />
                      ) : (
                        p.stock
                      )}
                    </td>
                    <td>
                      {editIndex === idx ? (
                        <select
                          className="border rounded px-2 py-1 w-full"
                          name="status"
                          value={editProduct.status}
                          onChange={handleEditChange}
                        >
                          <option value="available">Available</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            p.status.trim() === "available"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.status.trim() === "available" ? "Available" : "Unavailable"}
                        </span>
                      )}
                    </td>
                    <td>
                      {editIndex === idx ? (
                        <>
                          <button className="bg-green-600 text-white px-3 py-1 rounded mr-2" onClick={handleEditSave}>Save</button>
                          <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded" onClick={handleEditCancel}>Cancel</button>
                        </>
                      ) : (
                        <button className="border px-3 py-1 rounded hover:bg-gray-100 transition" onClick={() => handleEditClick(idx)}>Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === "Orders" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Incoming Orders</h2>
            <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded mb-4">
              <div className="font-semibold">Order #ORD001 <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs ml-2">pending</span></div>
              <div className="text-sm text-gray-700">Raj Kumar · +91 98765 43210</div>
              <div className="text-xs text-gray-500 mb-2">Shop 123, Andheri West, Mumbai · Order Date: 2024-01-15</div>
              <div className="text-sm">Items:</div>
              <ul className="text-xs text-gray-700 mb-2">
                <li>Premium Basmati Rice x 2 – ₹5000</li>
                <li>Organic Turmeric Powder x 1 – ₹450</li>
              </ul>
              <div className="font-semibold">Total: ₹5450</div>
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300">Reject</button>
                <button className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700">Accept</button>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <div className="font-semibold">Order #ORD002 <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs ml-2">accepted</span></div>
              <div className="text-sm text-gray-700">Priya Sharma · +91 98765 43211</div>
              <div className="text-xs text-gray-500 mb-2">B-45, Connaught Place, New Delhi · Order Date: 2024-01-14</div>
              <div className="text-sm">Items:</div>
              <ul className="text-xs text-gray-700 mb-2">
                <li>Premium Basmati Rice x 1 – ₹2500</li>
              </ul>
              <div className="font-semibold">Total: ₹2500</div>
            </div>
          </div>
        )}
        {tab === "Dispatch" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Dispatch Management</h2>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <div className="font-semibold">Order #ORD002 <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs ml-2">accepted</span></div>
              <div className="text-sm text-gray-700">Priya Sharma · +91 98765 43211</div>
              <div className="text-xs text-gray-500 mb-2">B-45, Connaught Place, New Delhi</div>
              <div className="font-semibold">Total: ₹2500</div>
              <button className="mt-2 px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700">Mark Dispatched</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Supplier; 