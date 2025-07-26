import React from "react";

const ProductCatalog = ({
  products,
  editIndex,
  editProduct,
  handleEditClick,
  handleEditChange,
  handleEditSave,
  handleEditCancel
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product Catalog</h2>
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
  );
};

export default ProductCatalog; 