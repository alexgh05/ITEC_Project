type TranslationKey = 
  | 'home'
  | 'shop'
  | 'cultures'
  | 'wishlist'
  | 'cart'
  | 'about'
  | 'login'
  | 'register'
  | 'logout'
  | 'profile'
  | 'myOrders'
  | 'adminDashboard'
  | 'language'
  | 'english'
  | 'romanian'
  | 'spanish'
  | 'german'
  | 'shoppingCart'
  | 'item'
  | 'items'
  | 'yourCartIsEmpty'
  | 'size'
  | 'total'
  | 'viewCart'
  | 'checkout';

type TranslationsType = {
  [key in TranslationKey]: {
    en: string;
    ro: string;
    es: string;
    de: string;
  }
};

export const translations: TranslationsType = {
  home: {
    en: 'Home',
    ro: 'Acasă',
    es: 'Inicio',
    de: 'Startseite'
  },
  shop: {
    en: 'Shop',
    ro: 'Magazin',
    es: 'Tienda',
    de: 'Shop'
  },
  cultures: {
    en: 'Cultures',
    ro: 'Culturi',
    es: 'Culturas',
    de: 'Kulturen'
  },
  wishlist: {
    en: 'Wishlist',
    ro: 'Favorite',
    es: 'Lista de deseos',
    de: 'Wunschliste'
  },
  cart: {
    en: 'Cart',
    ro: 'Coș',
    es: 'Carrito',
    de: 'Warenkorb'
  },
  about: {
    en: 'About',
    ro: 'Despre',
    es: 'Acerca de',
    de: 'Über uns'
  },
  login: {
    en: 'Login',
    ro: 'Autentificare',
    es: 'Iniciar sesión',
    de: 'Anmelden'
  },
  register: {
    en: 'Register',
    ro: 'Înregistrare',
    es: 'Registrarse',
    de: 'Registrieren'
  },
  logout: {
    en: 'Logout',
    ro: 'Deconectare',
    es: 'Cerrar sesión',
    de: 'Abmelden'
  },
  profile: {
    en: 'My Profile',
    ro: 'Profilul meu',
    es: 'Mi perfil',
    de: 'Mein Profil'
  },
  myOrders: {
    en: 'My Orders',
    ro: 'Comenzile mele',
    es: 'Mis pedidos',
    de: 'Meine Bestellungen'
  },
  adminDashboard: {
    en: 'Admin Dashboard',
    ro: 'Panou de administrare',
    es: 'Panel de administración',
    de: 'Admin-Dashboard'
  },
  language: {
    en: 'Language',
    ro: 'Limbă',
    es: 'Idioma',
    de: 'Sprache'
  },
  english: {
    en: 'English',
    ro: 'Engleză',
    es: 'Inglés',
    de: 'Englisch'
  },
  romanian: {
    en: 'Romanian',
    ro: 'Română',
    es: 'Rumano',
    de: 'Rumänisch'
  },
  spanish: {
    en: 'Spanish',
    ro: 'Spaniolă',
    es: 'Español',
    de: 'Spanisch'
  },
  german: {
    en: 'German',
    ro: 'Germană',
    es: 'Alemán',
    de: 'Deutsch'
  },
  shoppingCart: {
    en: 'Shopping Cart',
    ro: 'Coș de cumpărături',
    es: 'Carrito de compras',
    de: 'Einkaufswagen'
  },
  item: {
    en: 'item',
    ro: 'produs',
    es: 'artículo',
    de: 'Artikel'
  },
  items: {
    en: 'items',
    ro: 'produse',
    es: 'artículos',
    de: 'Artikel'
  },
  yourCartIsEmpty: {
    en: 'Your cart is empty',
    ro: 'Coșul tău este gol',
    es: 'Tu carrito está vacío',
    de: 'Dein Warenkorb ist leer'
  },
  size: {
    en: 'Size',
    ro: 'Mărime',
    es: 'Talla',
    de: 'Größe'
  },
  total: {
    en: 'Total',
    ro: 'Total',
    es: 'Total',
    de: 'Gesamt'
  },
  viewCart: {
    en: 'View Cart',
    ro: 'Vezi Coșul',
    es: 'Ver Carrito',
    de: 'Warenkorb anzeigen'
  },
  checkout: {
    en: 'Checkout',
    ro: 'Finalizare comandă',
    es: 'Pagar',
    de: 'Zur Kasse'
  }
};

export type Language = 'en' | 'ro' | 'es' | 'de';

export const getTranslation = (key: TranslationKey, language: Language): string => {
  return translations[key][language];
}; 