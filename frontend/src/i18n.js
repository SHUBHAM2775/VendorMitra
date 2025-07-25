import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        title: 'VendorMitra',
        subtitle: 'Trusted Vendor Marketplace',
        vendors: '50,000+ Vendors',
        welcome: 'Welcome back,',
        cart: 'Cart',
        inStock: 'in stock',
        verified: 'Verified',
        addToCart: 'Add to Cart',
        address: 'Address',
        delivery: 'Delivery',
        phone: 'Phone',
      },
    },
    hi: {
      translation: {
        title: 'वेंडरमित्रा',
        subtitle: 'विश्वसनीय विक्रेता बाज़ार',
        vendors: '50,000+ विक्रेता',
        welcome: 'वापसी पर स्वागत है,',
        cart: 'कार्ट',
        inStock: 'स्टॉक में',
        verified: 'सत्यापित',
        addToCart: 'कार्ट में जोड़ें',
        address: 'पता',
        delivery: 'डिलीवरी',
        phone: 'फ़ोन',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n; 