import React, { useState } from "react";
import { FaBox, FaShoppingCart, FaTruck, FaRupeeSign, FaStar, FaExclamationTriangle, FaCheckCircle, FaTimes } from "react-icons/fa";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showToast, setShowToast] = useState(null); // { type: 'success'|'error', message: string }
  const [form, setForm] = useState({
    name: "",
    desc: "",
    category: "",
    price: "",
    deliveryType: "instant",
    stock: "",
    supplierId: "SUPPLIER_ID_PLACEHOLDER" // TODO: Replace with real supplierId from context/token
  });
  const [adding, setAdding] = useState(false);

  // Verification states
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("not_submitted"); // "not_submitted", "pending", "verified", "rejected"
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationForm, setVerificationForm] = useState({
    businessName: "",
    fssaiNumber: "",
    certificateType: "FSSAI",
    certificateFile: null,
    businessAddress: "",
    contactPerson: "",
    phoneNumber: "",
    email: ""
  });
  const [submittingVerification, setSubmittingVerification] = useState(false);

  // Dynamic orders state
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customer: "Raj Kumar",
      phone: "+91 98765 43210",
      address: "Shop 123, Andheri West, Mumbai",
      orderDate: "2024-01-15",
      items: [
        { name: "Premium Basmati Rice", quantity: 2, price: 5000 },
        { name: "Organic Turmeric Powder", quantity: 1, price: 450 }
      ],
      total: 5450,
      status: "pending"
    },
    {
      id: "ORD002",
      customer: "Priya Sharma",
      phone: "+91 98765 43211",
      address: "B-45, Connaught Place, New Delhi",
      orderDate: "2024-01-14",
      items: [
        { name: "Premium Basmati Rice", quantity: 1, price: 2500 }
      ],
      total: 2500,
      status: "accepted"
    }
  ]);

  // Dynamic summary data that updates based on current state
  const getSummaryData = () => [
    { label: "Total Products", value: products.length, icon: <FaBox className="text-green-600 text-xl" /> },
    { label: "Pending Orders", value: orders.filter(order => order.status === "pending").length, icon: <FaShoppingCart className="text-yellow-500 text-xl" /> },
    { label: "In Transit", value: orders.filter(order => order.status === "dispatched").length, icon: <FaTruck className="text-blue-500 text-xl" /> },
    { label: "Monthly Revenue", value: "₹45,670", icon: <FaRupeeSign className="text-green-600 text-xl" /> },
  ];

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.desc || !form.category || !form.price || !form.stock) {
      setShowToast({ type: "error", message: "Please fill all required fields." });
      return;
    }
    setAdding(true);
    // Simulate API call
    setTimeout(() => {
      setProducts((prev) => [
        {
          name: form.name,
          desc: form.desc,
          category: form.category,
          price: form.price,
          stock: form.stock,
          status: "available",
          deliveryType: form.deliveryType,
          supplierId: form.supplierId
        },
        ...prev
      ]);
      setShowToast({ type: "success", message: "Product added successfully!" });
      setForm({
        name: "",
        desc: "",
        category: "",
        price: "",
        deliveryType: "instant",
        stock: "",
        supplierId: form.supplierId
      });
      setAdding(false);
    }, 800);
  };

  const handleAcceptOrder = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: "accepted" } : order
    ));
  };

  const handleRejectOrder = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: "rejected" } : order
    ));
  };

  const handleMarkDispatched = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: "dispatched" } : order
    ));
  };

  const handleOkToast = () => {
    setShowToast(null);
    setShowAddForm(false);
  };

  // Verification form handlers
  const handleVerificationFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "certificateFile") {
      setVerificationForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setVerificationForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    setSubmittingVerification(true);
    
    // Simulate API call for verification submission
    setTimeout(() => {
      setSubmittingVerification(false);
      setShowVerificationForm(false);
      setVerificationStatus("pending");
      setShowToast({ type: "success", message: "Verification details submitted successfully! Admin will review and verify your account." });
      // Reset form
      setVerificationForm({
        businessName: "",
        fssaiNumber: "",
        certificateType: "FSSAI",
        certificateFile: null,
        businessAddress: "",
        contactPerson: "",
        phoneNumber: "",
        email: ""
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {/* Verification Reminder Note */}
      {verificationStatus === "not_submitted" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-8 mt-6 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-yellow-800">
                  Account Verification Required
                </h3>
                <button
                  onClick={() => setShowVerificationForm(true)}
                  className="bg-yellow-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors"
                >
                  Verify Now
                </button>
              </div>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please verify your account to access all features and build trust with customers.</p>
                <p className="mt-1 text-xs">
                  <strong>Certificate Verification Options:</strong> FSSAI license verification available at{" "}
                  <a href="https://foscos.fssai.gov.in/verification/license" target="_blank" rel="noopener noreferrer" className="underline">
                    foscos.fssai.gov.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Pending Note */}
      {verificationStatus === "pending" && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-8 mt-6 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-blue-800">
                  Verification Under Review
                </h3>
              </div>
              <div className="mt-2 text-sm text-blue-700">
                <p>Your verification details have been submitted and are currently under review by our admin team.</p>
                <p className="mt-1 text-xs">
                  You will be notified once the verification is complete. This usually takes 1-2 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Rejected Note */}
      {verificationStatus === "rejected" && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-8 mt-6 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-red-800">
                  Verification Rejected
                </h3>
                <button
                  onClick={() => setShowVerificationForm(true)}
                  className="bg-red-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Resubmit
                </button>
              </div>
              <div className="mt-2 text-sm text-red-700">
                <p>Your verification was not approved. Please review your submitted documents and resubmit.</p>
                <p className="mt-1 text-xs">
                  Make sure your FSSAI license is valid and all information is accurate.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Status Badge */}
      {verificationStatus === "verified" && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-8 mt-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FaCheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-sm font-medium text-green-800">
              ✓ Account Verified
            </span>
          </div>
        </div>
      )}

      {/* Verification Form Modal */}
      {showVerificationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Account Verification</h2>
              <button
                onClick={() => setShowVerificationForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleVerificationSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={verificationForm.businessName}
                      onChange={handleVerificationFormChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate Type *
                    </label>
                    <select
                      name="certificateType"
                      value={verificationForm.certificateType}
                      onChange={handleVerificationFormChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      required
                    >
                      <option value="FSSAI">FSSAI License</option>
                      <option value="BMC">BMC License</option>
                      <option value="Other">Other Local Authority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FSSAI Number / License Number *
                  </label>
                  <input
                    type="text"
                    name="fssaiNumber"
                    value={verificationForm.fssaiNumber}
                    onChange={handleVerificationFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                    placeholder="e.g., 12345678901234"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Verify FSSAI license at{" "}
                    <a href="https://foscos.fssai.gov.in/verification/license" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      foscos.fssai.gov.in
                    </a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address *
                  </label>
                  <textarea
                    name="businessAddress"
                    value={verificationForm.businessAddress}
                    onChange={handleVerificationFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={verificationForm.contactPerson}
                      onChange={handleVerificationFormChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={verificationForm.phoneNumber}
                      onChange={handleVerificationFormChange}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={verificationForm.email}
                    onChange={handleVerificationFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Certificate/License *
                  </label>
                  <input
                    type="file"
                    name="certificateFile"
                    onChange={handleVerificationFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload FSSAI license, BMC certificate, or other relevant documents (PDF, JPG, PNG)
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVerificationForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingVerification}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
                >
                  {submittingVerification ? "Submitting..." : "Submit for Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-8 py-6">
        {getSummaryData().map((item) => (
          <div key={item.label} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div>{item.icon}</div>
            <div>
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="text-xl font-bold text-gray-800">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Add Product Button and Form below summary cards */}
      <div className="max-w-2xl mx-auto flex flex-col items-end mt-2 mb-6">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition mb-2"
          onClick={() => setShowAddForm(true)}
        >
          + Add Product
        </button>
        {showAddForm && (
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
        )}
      </div>
      {/* Product Catalog and rest of the page */}

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
              {/* The "+ Add Product" button is now outside the form */}
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
        )}
        {tab === "Dispatch" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Dispatch Management</h2>
            {orders.filter(order => order.status === "accepted").map((order) => (
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
        )}
      </div>

      {/* Toast for verification submission */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-2 rounded text-white font-medium ${
            showToast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}>
            {showToast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier; 