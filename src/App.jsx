/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/authSlice";
import { supabase } from "./lib/supabaseClient";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

// Components
import Navbar from "./components/jason/Navbar";
import Footer from "./components/jason/Footer";
import JasonAssistant from "./features/jason/virtual-assistant/JasonAssistant";
import AdvertHero from "./components/AdvertHero";
import UserProtectedRoute from "./components/jason/dashboard/UserProtectedRoute";
import SellerProtectedRoute from "./components/jason/sellers/SellerProtectedRoute";
import LoadingSpinner from "./components/jason/sellers/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import MaintenancePage from "./pages/MaintenancePage";

// Lazy-loaded Pages with better error handling
const lazyLoad = (path) =>
  lazy(() =>
    import(`./${path}`).catch((err) => {
      console.error("Failed to load component:", err);
      return { default: () => <MaintenancePage /> };
    })
  );

// Existing imports...
const HomePage = lazyLoad("pages/HomePage");
const ProductsPage = lazyLoad("pages/ProductsPage");
const ProductPage = lazyLoad("pages/ProductPage");
const CategoryProductsPage = lazyLoad("pages/CategoryProductsPage");
const CartPage = lazyLoad("pages/CartPage");
const CheckoutPage = lazyLoad("pages/CheckoutPage");
const DashboardPage = lazyLoad("pages/DashboardPage");
const SellWithUs = lazyLoad("pages/SellWithUs");
const AuthPage = lazyLoad("pages/AuthPage");
const ForgotPassword = lazyLoad("components/ForgotPassword");
const ResetPasswordPage = lazyLoad("pages/ResetPasswordPage");
const SellerRegistrationForm = lazyLoad("pages/SellerRegistrationForm");
const SellerDashboard = lazyLoad("pages/SellerDashboard");
const SellerLogin = lazyLoad("pages/SellerLogin");
const SellerHub = lazyLoad("pages/SellerHub");
const CompleteSellerProfile = lazyLoad("pages/CompleteSellerProfile");
const UnauthorizedPage = lazyLoad("pages/UnauthorizedPage");
const NotFoundPage = lazyLoad("pages/NotFoundPage");
const SearchResult = lazyLoad("pages/SearchResult");
const AboutPage = lazyLoad("pages/AboutPage");

// Sales Pages
const SummerSale = lazyLoad("pages/SummerSale");
const NewArrivals = lazyLoad("pages/NewArrivals");
const BestDeals = lazyLoad("pages/BestDeals");

// Seller Pages
const AddProductPage = lazyLoad("pages/seller/AddProductPage");
const SellerProducts = lazyLoad("pages/seller/Products");
const EditProductPage = lazyLoad("pages/seller/EditProduct");
const SellerSettings = lazyLoad("pages/seller/Settings");

// Dashboard Components
const OrderHistory = lazyLoad("components/jason/OrderHistory");
const WishlistPreview = lazyLoad("components/jason/WishlistPreview");
const AccountSettings = lazyLoad("components/jason/dashboard/AccountSettings");
const AddressBook = lazyLoad("components/jason/dashboard/AddressBook");
const AddressForm = lazyLoad("components/jason/dashboard/AddressForm");
const PaymentMethodsList = lazyLoad("components/jason/dashboard/PaymentMethodsList");
const PaymentMethodForm = lazyLoad("components/jason/dashboard/PaymentMethodForm");

// New Pages
const DailyDealsPage = lazyLoad("pages/DailyDealsPage");
const JasonsPicksPage = lazyLoad("pages/JasonsPicksPage");
const ContactPage = lazyLoad("pages/ContactPage");
const FAQPage = lazyLoad("pages/FAQPage");
const ReturnsPage = lazyLoad("pages/ReturnsPage");

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
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
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route
                path="/categories/:categorySlug"
                element={<CategoryProductsPage />}
              />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/sell-with-us" element={<SellWithUs />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/search" element={<SearchResult />} />

              {/* Sales Pages */}
              <Route path="/summer-sale" element={<SummerSale />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/best-deals" element={<BestDeals />} />

              {/* New Pages */}
              <Route path="/deals" element={<DailyDealsPage />} />
              <Route path="/jasons-picks" element={<JasonsPicksPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/returns" element={<ReturnsPage />} />

              {/* Protected customer routes */}
              <Route element={<UserProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />}>
                  <Route
                    index
                    element={
                      <h2 className="text-xl font-semibold">Account Overview</h2>
                    }
                  />
                  <Route path="orders" element={<OrderHistory />} />
                  <Route path="wishlist" element={<WishlistPreview />} />
                  <Route path="settings" element={<AccountSettings />} />
                  <Route path="addresses" element={<AddressBook />}>
                    <Route path="add" element={<AddressForm />} />
                    <Route path=":id/edit" element={<AddressForm />} />
                  </Route>
                  <Route
                    path="payment-methods"
                    element={<PaymentMethodsList />}
                  />
                  <Route
                    path="payment-methods/add"
                    element={<PaymentMethodForm />}
                  />
                  <Route
                    path="payment-methods/:id/edit"
                    element={<PaymentMethodForm />}
                  />
                </Route>
                <Route path="/checkout" element={<CheckoutPage />} />
              </Route>

              {/* Seller routes */}
              <Route path="/seller/login" element={<SellerLogin />} />
              <Route
                path="/seller/register"
                element={<SellerRegistrationForm />}
              />

              {/* Protected seller routes */}
              <Route element={<SellerProtectedRoute />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/hub" element={<SellerHub />} />
                <Route
                  path="/seller/complete-profile"
                  element={<CompleteSellerProfile />}
                />
                <Route path="/seller/products/new" element={<AddProductPage />} />
                <Route path="/seller/products" element={<SellerProducts />} />
                <Route path="/seller/products/:id/edit" element={<EditProductPage />} />
                <Route path="/seller/settings" element={<SellerSettings />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<NotFoundPage />} />
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