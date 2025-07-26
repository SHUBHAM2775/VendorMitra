import React from "react";

const AddProductForm = ({
  showAddForm,
  setShowAddForm,
  form,
  handleFormChange,
  handleAddProduct,
  adding,
  showToast,
  handleOkToast
}) => {
  if (!showAddForm) return null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-end mt-2 mb-6">
      <div className="w-full relative bg-white rounded-lg shadow p-6">
        {/* Cross button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold focus:outline-none"
          onClick={() => setShowAddForm(false)}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Add Product</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddProduct}>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="e.g. Premium Basmati Rice"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (include quantity, e.g. 25 kg)</label>
            <textarea
              name="desc"
              value={form.desc}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="e.g. High quality aged basmati rice, 25kg bag"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              required
            >
              <option value="">Select category</option>
              <option value="Grains">Grains</option>
              <option value="Spices">Spices</option>
              <option value="Oils">Oils</option>
              <option value="Pulses">Pulses</option>
              <option value="Beverages">Beverages</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="e.g. 2500"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
            <select
              name="deliveryType"
              value={form.deliveryType}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="instant">Instant</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock (packs available)</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="e.g. 50"
              min="1"
              required
            />
          </div>
          <input type="hidden" name="supplierId" value={form.supplierId} />
          <div className="col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-60"
              disabled={adding}
            >
              {adding ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
        {showToast && showToast.type === "success" && (
          <div className="mt-4 px-4 py-2 rounded text-white font-medium bg-green-500 flex items-center justify-between">
            <span>Product added successfully!</span>
            <button
              className="ml-4 bg-white text-green-700 px-3 py-1 rounded font-semibold border border-green-600 hover:bg-green-50 transition"
              onClick={handleOkToast}
            >
              OK
            </button>
          </div>
        )}
        {showToast && showToast.type === "error" && (
          <div className="mt-4 px-4 py-2 rounded text-white font-medium bg-red-500">
            {showToast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductForm; 