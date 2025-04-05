import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ThemeProvider from "./providers/ThemeProvider";
import { AuthProvider } from "./providers/AuthProvider";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useEffect } from "react";
import { Language } from "@/lib/translations";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ShopCategory from "./pages/ShopCategory";
import ProductDetail from "./pages/ProductDetail";
import Cultures from "./pages/Cultures";
import Culture from "./pages/Culture";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FinalOutfitGenerator from "./pages/FinalOutfitGenerator";

const queryClient = new QueryClient();

// Component to handle language detection from URL
const LanguageHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguageStore();
  
  useEffect(() => {
    // Parse the URL for language parameter
    const params = new URLSearchParams(location.search);
    const langParam = params.get('lang');
    
    if (langParam && ['en', 'ro', 'es', 'de'].includes(langParam)) {
      // Set language if it's valid and different from current
      if (langParam !== language) {
        setLanguage(langParam as Language);
        
        // Remove the lang parameter from URL after setting language
        params.delete('lang');
        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        
        // Replace URL without the lang parameter to keep it clean
        navigate(newPath, { replace: true });
      }
    }
  }, [location.search, language, setLanguage, navigate, location.pathname]);
  
  return null;
};

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <BrowserRouter>
                <LanguageHandler />
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="shop" element={<Shop />} />
                    <Route path="shop/:category" element={<ShopCategory />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                    <Route path="cultures" element={<Cultures />} />
                    <Route path="cultures/:name" element={<Culture />} />
                    <Route path="about" element={<About />} />
                    <Route path="outfit-generator" element={<FinalOutfitGenerator />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="terms" element={<TermsOfService />} />
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="wishlist" element={<Wishlist />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="profile/edit" element={<EditProfile />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="admin" element={<Admin />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
