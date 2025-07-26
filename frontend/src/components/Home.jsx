import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';

// Demo translation map for product fields
const productTranslations = {
  "Chaat Stall Starter": {
    hi: "चाट स्टाल स्टार्टर"
  },
  "Mumbai Fresh Supplies": {
    hi: "मुंबई फ्रेश सप्लाइज"
  },
  "Andheri West, Mumbai": {
    hi: "अंधेरी वेस्ट, मुंबई"
  }
};

function translateField(text, language) {
  if (language === "en") return text;
  return productTranslations[text]?.[language] || text;
}

function getTranslatedField(item, field, language) {
  if (language === "en") return item[field];
  return item.translations?.[language]?.[field] || item[field];
}

function RatingStars({ value }) {
  const fullStars = Math.floor(value);
  const halfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <span className="text-yellow-400">
      {"★".repeat(fullStars)}
      {halfStar ? "½" : ""}
      <span className="text-gray-300">
        {"★".repeat(emptyStars)}
      </span>
    </span>
  );
}

// Helper function to map API data to frontend format
function mapApiProductToFrontend(apiProduct) {
  return {
    id: apiProduct._id,
    name: apiProduct.name,
    price: apiProduct.pricePerUnit,
    supplier: apiProduct.supplierId?.name || 'Unknown Supplier',
    supplierId: apiProduct.supplierId?._id || apiProduct.supplierId, // Include supplier ID
    rating: 4.2, // Default rating since API doesn't provide this yet
    ratingCount: Math.floor(Math.random() * 200) + 50, // Random count for demo
    image: apiProduct.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    address: "Location not specified", // API doesn't provide address yet
    delivery: "Pickup, Local Delivery", // Default delivery options
    phone: apiProduct.supplierId?.phone || "+91 98765 43210",
    verified: apiProduct.supplierId?.isVerified || false,
    inStock: apiProduct.stockQty,
    unit: apiProduct.unit,
    description: apiProduct.description,
    translations: {
      en: { 
        name: apiProduct.name, 
        supplier: apiProduct.supplierId?.name || 'Unknown Supplier', 
        address: "Location not specified" 
      },
      hi: { 
        name: apiProduct.name, 
        supplier: apiProduct.supplierId?.name || 'Unknown Supplier', 
        address: "Location not specified" 
      }
    }
  };
}

function Home({ onAddToCart }) {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const [addedToCart, setAddedToCart] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getProducts();
        const mappedProducts = response.map(mapApiProductToFrontend);
        setProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
        // Fallback to demo products if API fails
        setProducts([
          {
            id: 1,
            name: "Chaat Stall Starter",
            price: 700,
            supplier: "Mumbai Fresh Supplies",
            rating: 4.2,
            ratingCount: 127,
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
            address: "Andheri West, Mumbai",
            delivery: "Pickup, Local Delivery",
            phone: "+91 98765 43210",
            verified: true,
            inStock: 15,
            translations: {
              en: { name: "Chaat Stall Starter", supplier: "Mumbai Fresh Supplies", address: "Andheri West, Mumbai" },
              hi: { name: "चाट स्टाल स्टार्टर", supplier: "मुंबई फ्रेश सप्लाइज", address: "अंधेरी वेस्ट, मुंबई" }
            }
          },
          {
            id: 2,
            name: "Street Food Combo",
            price: 1200,
            supplier: "Delhi Street Foods",
            rating: 4.5,
            ratingCount: 89,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&q=80",
            address: "Chandni Chowk, Delhi",
            delivery: "Pickup, Express Delivery",
            phone: "+91 98765 43211",
            verified: true,
            inStock: 8,
            translations: {
              en: { name: "Street Food Combo", supplier: "Delhi Street Foods", address: "Chandni Chowk, Delhi" },
              hi: { name: "स्ट्रीट फूड कॉम्बो", supplier: "दिल्ली स्ट्रीट फूड्स", address: "चांदनी चौक, दिल्ली" }
            }
          },
          {
            id: 3,
            name: "South Indian Breakfast Kit",
            price: 950,
            supplier: "Bangalore Tiffin Center",
            rating: 4.7,
            ratingCount: 203,
            image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
            address: "Koramangala, Bangalore",
            delivery: "Home Delivery",
            phone: "+91 98765 43212",
            verified: true,
            inStock: 12,
            translations: {
              en: { name: "South Indian Breakfast Kit", supplier: "Bangalore Tiffin Center", address: "Koramangala, Bangalore" },
              hi: { name: "दक्षिण भारतीय नाश्ता किट", supplier: "बैंगलोर टिफिन सेंटर", address: "कोरमंगला, बैंगलोर" }
            }
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }
    
    onAddToCart(product);
    setAddedToCart(product.name);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {t('featuredProducts') || 'Featured Products'}
          </h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {t('featuredProducts') || 'Featured Products'}
          </h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-2">⚠️ Error loading products</div>
              <div className="text-gray-600 mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      {/* Success Notification */}
      {addedToCart && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <FaCheck />
          <span>{getTranslatedField({ name: addedToCart, translations: products.find(p => p.name === addedToCart)?.translations }, 'name', language)} added to cart!</span>
        </div>
      )}
      
      {/* Login Prompt Notification */}
      {showLoginPrompt && (
        <div className="fixed top-20 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>{language === 'hi' ? 'कार्ट में जोड़ने के लिए लॉगिन करें' : 'Please login to add to cart'}</span>
        </div>
      )}
      
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t('featuredProducts') || 'Featured Products'}
        </h1>
        
        {products.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-500 text-lg">No products available</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {products.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg w-full max-w-sm flex flex-col">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-t-2xl h-48 w-full object-cover"
                />
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h2 className="text-xl font-semibold">{getTranslatedField(item, 'name', language)}</h2>
                  <div className="flex items-center justify-between">
                    <div className="text-green-700 text-2xl font-bold">
                      ₹{item.price} / {item.unit}
                    </div>
                    {item.verified && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full ml-2">
                        {t('verified')}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 font-medium">{getTranslatedField(item, 'supplier', language)}</div>
                  <div className="flex items-center gap-2">
                    <RatingStars value={item.rating} />
                    <span className="text-gray-500 text-sm">
                      ({item.ratingCount})
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="text-gray-600 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243z" /></svg>
                    {getTranslatedField(item, 'address', language)}
                  </div>
                  <div className="text-gray-600 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 4v8" /></svg>
                    {item.delivery}
                  </div>
                  <div className="text-gray-600 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h2l.4 2M7 13h10l1.4-7H6.6M7 13l-1.4 7h10.8L17 13M7 13V5a2 2 0 012-2h6a2 2 0 012 2v8" /></svg>
                    {item.phone}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-green-700 font-semibold">{item.inStock} {item.unit} {t('inStock')}</span>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="ml-auto bg-green-600 hover:bg-green-700 text-white text-base px-6 py-2 rounded-lg flex items-center gap-2 font-semibold shadow transition duration-150 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l1.4-7H6.6M7 13l-1.4 7h10.8L17 13M7 13V5a2 2 0 012-2h6a2 2 0 012 2v8" /></svg>
                      {t('addToCart')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;