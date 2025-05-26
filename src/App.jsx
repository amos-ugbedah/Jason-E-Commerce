/* eslint-disable no-unused-vars */
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/authSlice";
import { supabase } from "./lib/supabaseClient";
import toast from "react-hot-toast";
import { useAuth, useProtectedRoute } from "./context/AuthContext";

// Components
import Navbar from "./components/jason/Navbar";
import Footer from "./components/jason/Footer";
import JasonAssistant from "./features/jason/virtual-assistant/JasonAssistant";
import AdvertHero from "./components/AdvertHero";
import LoadingSpinner from "./components/jason/sellers/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import MaintenancePage from "./pages/MaintenancePage";

// Route-based code splitting with explicit imports
const routeComponents = {
  HomePage: lazy(() => import("./pages/HomePage")),
  ProductsPage: lazy(() => import("./pages/ProductsPage")),
  ProductPage: lazy(() => import("./pages/ProductPage")),
  CategoryProductsPage: lazy(() => import("./pages/CategoryProductsPage")),
  CartPage: lazy(() => import("./pages/CartPage")),
  CheckoutPage: lazy(() => import("./pages/CheckoutPage")),
  DashboardPage: lazy(() => import("./pages/DashboardPage")),
  SellWithUs: lazy(() => import("./pages/SellWithUs")),
  AuthPage: lazy(() => import("./pages/AuthPage")),
  ForgotPassword: lazy(() => import("./components/ForgotPassword")),
  ResetPasswordPage: lazy(() => import("./pages/ResetPasswordPage")),
  SellerRegistrationForm: lazy(() => import("./pages/SellerRegistrationForm")),
  SellerDashboard: lazy(() => import("./pages/SellerDashboard")),
  SellerLogin: lazy(() => import("./pages/SellerLogin")),
  SellerHub: lazy(() => import("./pages/SellerHub")),
  CompleteSellerProfile: lazy(() => import("./pages/CompleteSellerProfile")),
  UnauthorizedPage: lazy(() => import("./pages/UnauthorizedPage")),
  NotFoundPage: lazy(() => import("./pages/NotFoundPage")),
  SearchResult: lazy(() => import("./pages/SearchResult")),
  AboutPage: lazy(() => import("./pages/AboutPage")),
  SummerSale: lazy(() => import("./pages/SummerSale")),
  NewArrivals: lazy(() => import("./pages/NewArrivals")),
  BestDeals: lazy(() => import("./pages/BestDeals")),
  AddProductPage: lazy(() => import("./pages/seller/AddProductPage")),
  SellerProducts: lazy(() => import("./pages/seller/Products")),
  EditProductPage: lazy(() => import("./pages/seller/EditProduct")),
  SellerSettings: lazy(() => import("./pages/seller/Settings")),
  OrderHistory: lazy(() => import("./components/jason/OrderHistory")),
  WishlistPreview: lazy(() => import("./components/jason/WishlistPreview")),
  AccountSettings: lazy(() => import("./components/jason/dashboard/AccountSettings")),
  AddressBook: lazy(() => import("./components/jason/dashboard/AddressBook")),
  AddressForm: lazy(() => import("./components/jason/dashboard/AddressForm")),
  PaymentMethodsList: lazy(() => import("./components/jason/dashboard/PaymentMethodsList")),
  PaymentMethodForm: lazy(() => import("./components/jason/dashboard/PaymentMethodForm")),
  DailyDealsPage: lazy(() => import("./pages/DailyDealsPage")),
  JasonsPicksPage: lazy(() => import("./pages/JasonsPicksPage")),
  ContactPage: lazy(() => import("./pages/ContactPage")),
  FAQPage: lazy(() => import("./pages/FAQPage")),
  ReturnsPage: lazy(() => import("./pages/ReturnsPage"))
};

// Protected Route Components
const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

const SellerProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return user?.user_metadata?.role === 'seller' ? children : <Navigate to="/unauthorized" replace />;
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        const currentUser = session?.user || null;
        dispatch(setUser(currentUser));

        switch (event) {
          case "PASSWORD_RECOVERY":
            navigate("/reset-password");
            toast.success("Please set a new password");
            break;
          case "EMAIL_VERIFIED":
            toast.success("Email verified successfully!");
            if (window.location.pathname === "/auth") {
              navigate("/dashboard");
            }
            break;
          case "SIGNED_OUT":
            toast("You've been signed out", { icon: "👋" });
            break;
          case "USER_UPDATED":
            if (session?.user?.email_confirmed_at) {
              toast.success("Account updated successfully");
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        toast.error("An authentication error occurred");
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, navigate]);

  // Check for maintenance mode
  const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "true";

  if (maintenanceMode) {
    return <MaintenancePage />;
  }

  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-gray-50">
      <AdvertHero />
      <Navbar />

      <main className="flex-grow">
        <ErrorBoundary>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<routeComponents.HomePage />} />
              <Route path="/products" element={<routeComponents.ProductsPage />} />
              <Route path="/products/:id" element={<routeComponents.ProductPage />} />
              <Route path="/categories/:categorySlug" element={<routeComponents.CategoryProductsPage />} />
              <Route path="/cart" element={<routeComponents.CartPage />} />
              <Route path="/auth" element={<routeComponents.AuthPage />} />
              <Route path="/forgot-password" element={<routeComponents.ForgotPassword />} />
              <Route path="/reset-password" element={<routeComponents.ResetPasswordPage />} />
              <Route path="/sell-with-us" element={<routeComponents.SellWithUs />} />
              <Route path="/unauthorized" element={<routeComponents.UnauthorizedPage />} />
              <Route path="/about" element={<routeComponents.AboutPage />} />
              <Route path="/search" element={<routeComponents.SearchResult />} />

              {/* Sales Pages */}
              <Route path="/summer-sale" element={<routeComponents.SummerSale />} />
              <Route path="/new-arrivals" element={<routeComponents.NewArrivals />} />
              <Route path="/best-deals" element={<routeComponents.BestDeals />} />

              {/* New Pages */}
              <Route path="/deals" element={<routeComponents.DailyDealsPage />} />
              <Route path="/jasons-picks" element={<routeComponents.JasonsPicksPage />} />
              <Route path="/contact" element={<routeComponents.ContactPage />} />
              <Route path="/faq" element={<routeComponents.FAQPage />} />
              <Route path="/returns" element={<routeComponents.ReturnsPage />} />

              {/* Protected customer routes */}
              <Route element={<UserProtectedRoute />}>
                <Route path="/dashboard" element={<routeComponents.DashboardPage />}>
                  <Route index element={<h2 className="text-xl font-semibold">Account Overview</h2>} />
                  <Route path="orders" element={<routeComponents.OrderHistory />} />
                  <Route path="wishlist" element={<routeComponents.WishlistPreview />} />
                  <Route path="settings" element={<routeComponents.AccountSettings />} />
                  <Route path="addresses" element={<routeComponents.AddressBook />}>
                    <Route path="add" element={<routeComponents.AddressForm />} />
                    <Route path=":id/edit" element={<routeComponents.AddressForm />} />
                  </Route>
                  <Route path="payment-methods" element={<routeComponents.PaymentMethodsList />} />
                  <Route path="payment-methods/add" element={<routeComponents.PaymentMethodForm />} />
                  <Route path="payment-methods/:id/edit" element={<routeComponents.PaymentMethodForm />} />
                </Route>
                <Route path="/checkout" element={<routeComponents.CheckoutPage />} />
              </Route>

              {/* Seller routes */}
              <Route path="/seller/login" element={<routeComponents.SellerLogin />} />
              <Route path="/seller/register" element={<routeComponents.SellerRegistrationForm />} />

              {/* Protected seller routes */}
              <Route element={<SellerProtectedRoute />}>
                <Route path="/seller/dashboard" element={<routeComponents.SellerDashboard />} />
                <Route path="/seller/hub" element={<routeComponents.SellerHub />} />
                <Route path="/seller/complete-profile" element={<routeComponents.CompleteSellerProfile />} />
                <Route path="/seller/products/new" element={<routeComponents.AddProductPage />} />
                <Route path="/seller/products" element={<routeComponents.SellerProducts />} />
                <Route path="/seller/products/:id/edit" element={<routeComponents.EditProductPage />} />
                <Route path="/seller/settings" element={<routeComponents.SellerSettings />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<routeComponents.NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      <JasonAssistant />
    </div>
  );
}

export default App;