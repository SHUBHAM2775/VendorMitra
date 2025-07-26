import React, { useState } from "react";
import VerificationStatus from "./supplier/VerificationStatus";
import SummaryCards from "./Supplier/SummaryCards";
import AddProductForm from "./Supplier/AddProductForm";
import TabNavigation from "./Supplier/TabNavigation";
import ProductCatalog from "./Supplier/ProductCatalog";
import OrderManagement from "./Supplier/OrderManagement";
import DispatchManagement from "./Supplier/DispatchManagement";
import Toast from "./Supplier/Toast";

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
      {/* Verification Status Component */}
      <VerificationStatus
        verificationStatus={verificationStatus}
        showVerificationForm={showVerificationForm}
        setShowVerificationForm={setShowVerificationForm}
        verificationForm={verificationForm}
        handleVerificationFormChange={handleVerificationFormChange}
        handleVerificationSubmit={handleVerificationSubmit}
        submittingVerification={submittingVerification}
      />

      {/* Summary Cards Component */}
      <SummaryCards products={products} orders={orders} />

      {/* Add Product Form Component */}
      <AddProductForm
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        form={form}
        handleFormChange={handleFormChange}
        handleAddProduct={handleAddProduct}
        adding={adding}
        showToast={showToast}
        handleOkToast={handleOkToast}
      />

      {/* Tab Navigation Component */}
      <TabNavigation
        tab={tab}
        setTab={setTab}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
      />

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow mx-8 mb-8 p-6 mt-4">
        {tab === "Products" && (
          <ProductCatalog
            products={products}
            editIndex={editIndex}
            editProduct={editProduct}
            handleEditClick={handleEditClick}
            handleEditChange={handleEditChange}
            handleEditSave={handleEditSave}
            handleEditCancel={handleEditCancel}
          />
        )}
        {tab === "Orders" && (
          <OrderManagement
            orders={orders}
            handleAcceptOrder={handleAcceptOrder}
            handleRejectOrder={handleRejectOrder}
          />
        )}
        {tab === "Dispatch" && (
          <DispatchManagement
            orders={orders}
            handleMarkDispatched={handleMarkDispatched}
          />
        )}
      </div>

      {/* Toast Component */}
      <Toast showToast={showToast} />
    </div>
  );
};

export default Supplier; 