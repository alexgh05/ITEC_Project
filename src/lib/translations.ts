export type TranslationKey = 
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
  | 'checkout'
  | 'outfitGenerator'
  // Homepage translations
  | 'featuredProducts'
  | 'curatedItems'
  | 'viewAllProducts'
  | 'yourStyleYourChoice'
  | 'selectCultureTheme'
  | 'lightMode'
  | 'darkMode'
  | 'chooseTheme'
  | 'exploreAllCultures'
  | 'whereMusicMeetsFashion'
  | 'storeDescription'
  | 'aboutUs'
  | 'subscribeNewsletter'
  | 'stayUpdated'
  | 'thankSubscribing'
  | 'emailPlaceholder'
  | 'subscribe'
  // Product related
  | 'addToCart'
  | 'outOfStock'
  | 'inStock'
  | 'notifyMe'
  | 'price'
  | 'description'
  | 'color'
  | 'quantity'
  | 'addedToCart'
  | 'errorAddingToCart'
  // Checkout related
  | 'completeOrder'
  | 'shippingInfo'
  | 'billingInfo'
  | 'paymentMethod'
  | 'orderSummary'
  | 'subtotal'
  | 'shipping'
  | 'tax'
  | 'placeOrder'
  // Footer
  | 'allRightsReserved'
  | 'privacyPolicy'
  | 'termsOfService';

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
  outfitGenerator: {
    en: 'AI Outfit Generator',
    ro: 'Generator de Ținute AI',
    es: 'Generador de Outfits AI',
    de: 'KI-Outfit-Generator'
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
  },
  // Homepage translations
  featuredProducts: {
    en: 'Featured Products',
    ro: 'Produse Recomandate',
    es: 'Productos Destacados',
    de: 'Ausgewählte Produkte'
  },
  curatedItems: {
    en: 'Curated items from our latest collections',
    ro: 'Articole selecționate din cele mai recente colecții',
    es: 'Artículos seleccionados de nuestras últimas colecciones',
    de: 'Ausgewählte Artikel aus unseren neuesten Kollektionen'
  },
  viewAllProducts: {
    en: 'View All Products',
    ro: 'Vezi Toate Produsele',
    es: 'Ver Todos los Productos',
    de: 'Alle Produkte Anzeigen'
  },
  yourStyleYourChoice: {
    en: 'Your Style, Your Choice',
    ro: 'Stilul Tău, Alegerea Ta',
    es: 'Tu Estilo, Tu Elección',
    de: 'Dein Stil, Deine Wahl'
  },
  selectCultureTheme: {
    en: 'Select a culture theme to customize your shopping experience',
    ro: 'Selectează o temă culturală pentru a personaliza experiența de cumpărături',
    es: 'Selecciona un tema cultural para personalizar tu experiencia de compra',
    de: 'Wähle ein Kulturthema, um dein Einkaufserlebnis anzupassen'
  },
  lightMode: {
    en: 'Light Mode',
    ro: 'Mod Luminos',
    es: 'Modo Claro',
    de: 'Heller Modus'
  },
  darkMode: {
    en: 'Dark Mode',
    ro: 'Mod Întunecat',
    es: 'Modo Oscuro',
    de: 'Dunkler Modus'
  },
  chooseTheme: {
    en: 'Choose your theme below',
    ro: 'Alege tema ta mai jos',
    es: 'Elige tu tema a continuación',
    de: 'Wähle dein Thema unten'
  },
  exploreAllCultures: {
    en: 'Explore All Cultures',
    ro: 'Explorează Toate Culturile',
    es: 'Explorar Todas las Culturas',
    de: 'Alle Kulturen Erkunden'
  },
  whereMusicMeetsFashion: {
    en: 'Where Music Meets Fashion',
    ro: 'Unde Muzica Întâlnește Moda',
    es: 'Donde la Música Se Encuentra con la Moda',
    de: 'Wo Musik auf Mode Trifft'
  },
  storeDescription: {
    en: 'HypeHeritage is more than just a store. We\'re a platform that celebrates the intersection of music and fashion across different urban cultures.',
    ro: 'HypeHeritage este mai mult decât un magazin. Suntem o platformă care celebrează intersecția dintre muzică și modă în diferite culturi urbane.',
    es: 'HypeHeritage es más que una tienda. Somos una plataforma que celebra la intersección de la música y la moda en diferentes culturas urbanas.',
    de: 'HypeHeritage ist mehr als nur ein Geschäft. Wir sind eine Plattform, die die Verbindung von Musik und Mode in verschiedenen urbanen Kulturen feiert.'
  },
  aboutUs: {
    en: 'About Us',
    ro: 'Despre Noi',
    es: 'Sobre Nosotros',
    de: 'Über Uns'
  },
  subscribeNewsletter: {
    en: 'Subscribe to Our Newsletter',
    ro: 'Abonează-te la Newsletter',
    es: 'Suscríbete a Nuestro Boletín',
    de: 'Abonniere Unseren Newsletter'
  },
  stayUpdated: {
    en: 'Stay updated with the latest drops, exclusive offers, and cultural insights.',
    ro: 'Rămâi la curent cu cele mai noi lansări, oferte exclusive și perspective culturale.',
    es: 'Mantente actualizado con los últimos lanzamientos, ofertas exclusivas y conocimientos culturales.',
    de: 'Bleibe auf dem Laufenden über die neuesten Drops, exklusive Angebote und kulturelle Einblicke.'
  },
  thankSubscribing: {
    en: 'Thanks for subscribing! We\'ll keep you updated.',
    ro: 'Mulțumim pentru abonare! Te vom ține la curent.',
    es: '¡Gracias por suscribirte! Te mantendremos informado.',
    de: 'Danke für dein Abonnement! Wir halten dich auf dem Laufenden.'
  },
  emailPlaceholder: {
    en: 'Your email address',
    ro: 'Adresa ta de email',
    es: 'Tu dirección de correo electrónico',
    de: 'Deine E-Mail-Adresse'
  },
  subscribe: {
    en: 'Subscribe',
    ro: 'Abonează-te',
    es: 'Suscribirse',
    de: 'Abonnieren'
  },
  // Product related
  addToCart: {
    en: 'Add to Cart',
    ro: 'Adaugă în Coș',
    es: 'Añadir al Carrito',
    de: 'In den Warenkorb'
  },
  outOfStock: {
    en: 'Out of Stock',
    ro: 'Stoc Epuizat',
    es: 'Agotado',
    de: 'Ausverkauft'
  },
  inStock: {
    en: 'In Stock',
    ro: 'În Stoc',
    es: 'En Stock',
    de: 'Auf Lager'
  },
  notifyMe: {
    en: 'Notify Me',
    ro: 'Anunță-mă',
    es: 'Notificarme',
    de: 'Benachrichtige Mich'
  },
  price: {
    en: 'Price',
    ro: 'Preț',
    es: 'Precio',
    de: 'Preis'
  },
  description: {
    en: 'Description',
    ro: 'Descriere',
    es: 'Descripción',
    de: 'Beschreibung'
  },
  color: {
    en: 'Color',
    ro: 'Culoare',
    es: 'Color',
    de: 'Farbe'
  },
  quantity: {
    en: 'Quantity',
    ro: 'Cantitate',
    es: 'Cantidad',
    de: 'Menge'
  },
  addedToCart: {
    en: 'Added to Cart',
    ro: 'Adăugat în Coș',
    es: 'Añadido al Carrito',
    de: 'In den Warenkorb gelegt'
  },
  errorAddingToCart: {
    en: 'Error adding to cart',
    ro: 'Eroare la adăugarea în coș',
    es: 'Error al añadir al carrito',
    de: 'Fehler beim Hinzufügen zum Warenkorb'
  },
  // Checkout related
  completeOrder: {
    en: 'Complete Your Order',
    ro: 'Finalizează Comanda',
    es: 'Completa Tu Pedido',
    de: 'Bestellung Abschließen'
  },
  shippingInfo: {
    en: 'Shipping Information',
    ro: 'Informații de Livrare',
    es: 'Información de Envío',
    de: 'Versandinformationen'
  },
  billingInfo: {
    en: 'Billing Information',
    ro: 'Informații de Facturare',
    es: 'Información de Facturación',
    de: 'Rechnungsinformationen'
  },
  paymentMethod: {
    en: 'Payment Method',
    ro: 'Metodă de Plată',
    es: 'Método de Pago',
    de: 'Zahlungsmethode'
  },
  orderSummary: {
    en: 'Order Summary',
    ro: 'Rezumat Comandă',
    es: 'Resumen del Pedido',
    de: 'Bestellübersicht'
  },
  subtotal: {
    en: 'Subtotal',
    ro: 'Subtotal',
    es: 'Subtotal',
    de: 'Zwischensumme'
  },
  shipping: {
    en: 'Shipping',
    ro: 'Livrare',
    es: 'Envío',
    de: 'Versand'
  },
  tax: {
    en: 'Tax',
    ro: 'Taxe',
    es: 'Impuesto',
    de: 'Steuer'
  },
  placeOrder: {
    en: 'Place Order',
    ro: 'Plasează Comanda',
    es: 'Realizar Pedido',
    de: 'Bestellung Aufgeben'
  },
  // Footer
  allRightsReserved: {
    en: 'All rights reserved',
    ro: 'Toate drepturile rezervate',
    es: 'Todos los derechos reservados',
    de: 'Alle Rechte vorbehalten'
  },
  privacyPolicy: {
    en: 'Privacy Policy',
    ro: 'Politica de Confidențialitate',
    es: 'Política de Privacidad',
    de: 'Datenschutzrichtlinie'
  },
  termsOfService: {
    en: 'Terms of Service',
    ro: 'Termeni și Condiții',
    es: 'Términos de Servicio',
    de: 'Nutzungsbedingungen'
  }
};

export type Language = 'en' | 'ro' | 'es' | 'de';

// Get translation with fallback to English
export const getTranslation = (key: TranslationKey, language: Language): string => {
  try {
    return translations[key][language];
  } catch (error) {
    console.warn(`Translation missing for key: ${key} in language: ${language}`);
    return translations[key]['en']; // Fallback to English
  }
};

// Helper for translating dynamic content that isn't in the main translations object
// For example, culture names, product categories, etc.
export const getDynamicTranslation = (
  content: { [key in Language]?: string },
  language: Language,
  fallback: string
): string => {
  if (!content) return fallback;
  
  // Try to get the translation for the current language
  const translation = content[language];
  if (translation) return translation;
  
  // Try English as fallback
  const englishTranslation = content['en'];
  if (englishTranslation) return englishTranslation;
  
  // Return the provided fallback if no translation exists
  return fallback;
}; 