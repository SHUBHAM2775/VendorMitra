import React, { useState, useEffect } from "react";
import VerificationStatus from "./supplier/VerificationStatus";
import SummaryCards from "./Supplier/SummaryCards";
import AddProductForm from "./Supplier/AddProductForm";
import TabNavigation from "./Supplier/TabNavigation";
import ProductCatalog from "./Supplier/ProductCatalog";
import OrderManagement from "./Supplier/OrderManagement";
import DispatchManagement from "./Supplier/DispatchManagement";
import Toast from "./Supplier/Toast";
import { useAuth } from "../context/AuthContext";
import { tokenManager, productAPI } from "../services/api";

const Supplier = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("Products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showToast, setShowToast] = useState(null); // { type: 'success'|'error', message: string }
  const [form, setForm] = useState({
    name: "",
    description: "", // Changed from 'desc' to 'description'
    unit: "kg", // Added unit field
    pricePerUnit: "", // Changed from 'price' to 'pricePerUnit'
    stockQty: "", // Changed from 'stock' to 'stockQty'
    image: "", // Image field
    supplierId: user?.id || "SUPPLIER_ID_PLACEHOLDER" // Use actual user ID from auth context
  });
  const [adding, setAdding] = useState(false);

  // Function to map API product data to component format
  const mapApiProductToComponent = (apiProduct) => {
    return {
      _id: apiProduct._id,
      name: apiProduct.name,
      desc: apiProduct.description,
      category: "General", // Default category since API doesn't have this field
      price: `₹${apiProduct.pricePerUnit}`,
      stock: apiProduct.stockQty,
      status: apiProduct.isActive ? "available" : "unavailable",
      image: apiProduct.image || "",
      unit: apiProduct.unit,
      pricePerUnit: apiProduct.pricePerUnit,
      stockQty: apiProduct.stockQty,
      supplierId: apiProduct.supplierId
    };
  };

  // Function to fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;
      
      // If user is logged in, get their specific products
      if (user?.id) {
        response = await productAPI.getProductsBySupplierId(user.id);
      } else {
        // Fallback to all products if no user
        response = await productAPI.getProducts();
      }
      
      const mappedProducts = response.map(mapApiProductToComponent);
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setShowToast({ type: "error", message: "Failed to load products" });
      // Keep empty array if error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when component mounts or user changes
  useEffect(() => {
    fetchProducts();
  }, [user?.id]);

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
    const product = products[idx];
    setEditIndex(idx);
    setEditProduct({ 
      category: product.category || "General",
      price: product.price,
      stock: product.stock,
      status: product.status,
      desc: product.desc,
      pricePerUnit: product.pricePerUnit,
      stockQty: product.stockQty
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const token = tokenManager.getToken();
      const productToUpdate = products[editIndex];
      
      if (!token) {
        setShowToast({ type: "error", message: "Please log in to edit products." });
        return;
      }

      // Prepare update data - map UI fields back to API format
      const updateData = {
        description: editProduct.desc || productToUpdate.desc,
        pricePerUnit: parseFloat(editProduct.price?.replace('₹', '') || editProduct.pricePerUnit || productToUpdate.pricePerUnit),
        stockQty: parseInt(editProduct.stock || editProduct.stockQty || productToUpdate.stockQty),
        isActive: editProduct.status === "available"
      };

      const response = await fetch(`http://localhost:5000/api/prod/update-product/${productToUpdate._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        setShowToast({ type: "error", message: errorData.error || "Failed to update product" });
        return;
      }

      // Refresh the product list to get updated data
      await fetchProducts();
      
      setEditIndex(null);
      setEditProduct(null);
      setShowToast({ type: "success", message: "Product updated successfully!" });
      
    } catch (error) {
      console.error("Error updating product:", error);
      setShowToast({ type: "error", message: "Failed to update product" });
    }
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.description || !form.pricePerUnit || !form.stockQty || !form.unit) {
      setShowToast({ type: "error", message: "Please fill all required fields." });
      return;
    }
    
    // Optional: Validate that image is uploaded (uncomment if you want to make image required)
    // if (!form.image) {
    //   setShowToast({ type: "error", message: "Please upload a product image." });
    //   return;
    // }
    
    setAdding(true);
    
    try {
      const token = tokenManager.getToken();
      
      if (!token || !user) {
        setShowToast({ type: "error", message: "Please log in to add products." });
        setAdding(false);
        return;
      }

      // Check if backend is reachable
      const apiUrl = "http://localhost:5000/api/prod/add-product";
      console.log("Making API request to:", apiUrl);
      console.log("Request payload:", {
        name: form.name,
        description: form.description,
        image: form.image ? "Image data provided" : "No image",
        unit: form.unit,
        pricePerUnit: parseFloat(form.pricePerUnit),
        stockQty: parseInt(form.stockQty),
      });
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          image: form.image,
          unit: form.unit,
          pricePerUnit: parseFloat(form.pricePerUnit),
          stockQty: parseInt(form.stockQty),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setShowToast({ type: "error", message: "Authentication failed. Please log in again." });
          // Clear invalid token and logout user
          tokenManager.removeToken();
          logout();
        } else {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          setShowToast({ type: "error", message: errorData.error || "Failed to add product" });
        }
        setAdding(false);
        return;
      }

      const data = await response.json();
      
      // Refresh the product list from the server to get the latest data
      await fetchProducts();
      
      setShowToast({ type: "success", message: "Product added successfully!" });
      setForm({
        name: "",
        description: "", // Reset description field
        unit: "kg", // Reset to default unit
        pricePerUnit: "", // Reset pricePerUnit field
        stockQty: "", // Reset stockQty field
        image: "", // Reset image field
        supplierId: user?.id || "SUPPLIER_ID_PLACEHOLDER" // Use current user ID
      });
      
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setShowToast({ type: "error", message: "Backend server is not running. Please start the server on http://localhost:5000" });
      } else {
        setShowToast({ type: "error", message: "Network error. Please check your connection and ensure the backend server is running." });
      }
    } finally {
      setAdding(false);
    }
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
      {/* Check if user is authenticated and is a supplier */}
      {!user ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Please log in to access supplier features</h2>
            <p className="text-gray-600">You need to be logged in as a supplier to view this page.</p>
          </div>
        </div>
      ) : user.role !== 'supplier' ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Access Restricted</h2>
            <p className="text-gray-600">This page is only accessible to suppliers.</p>
          </div>
        </div>
      ) : (
        <>
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
            setShowToast={setShowToast}
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
                loading={loading}
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
        </>
      )}
    </div>
  );
};

export default Supplier; 