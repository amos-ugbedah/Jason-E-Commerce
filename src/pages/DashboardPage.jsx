import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  Home,
  MapPin,
  CreditCard,
  X,
  Loader2,
  Menu,
} from "lucide-react";
import JasonLogo from "../components/jason/JasonLogo";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
          toast.error("Please login to access dashboard");
          navigate("/auth");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("jason_profiles")
          .select("*")
          .eq("user_id", authUser.id)
          .maybeSingle();

        if (profileError) throw profileError;

        let userProfile = profileData;
        if (!profileData) {
          const { data: newProfile, error: createError } = await supabase
            .from("jason_profiles")
            .insert([{
              user_id: authUser.id,
              email: authUser.email,
              created_at: new Date().toISOString()
            }])
            .select()
            .single();

          if (createError) throw createError;
          userProfile = newProfile;
        }

        setUser(authUser);
        setProfile(userProfile || {
          user_id: authUser.id,
          email: authUser.email
        });
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
        
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser(authUser);
          setProfile({
            email: authUser.email,
            user_id: authUser.id
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      dispatch(clearCart());
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const navItems = [
    {
      key: "overview",
      label: "Account Overview",
      icon: <User size={18} />,
      path: "/dashboard",
      exact: true,
    },
    {
      key: "orders",
      label: "My Orders",
      icon: <ShoppingBag size={18} />,
      path: "/dashboard/orders",
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: <Heart size={18} />,
      path: "/dashboard/wishlist",
    },
    {
      key: "addresses",
      label: "My Addresses",
      icon: <MapPin size={18} />,
      path: "/dashboard/addresses",
    },
    {
      key: "payment",
      label: "Payment Methods",
      icon: <CreditCard size={18} />,
      path: "/dashboard/payment-methods",
    },
    {
      key: "settings",
      label: "Account Settings",
      icon: <Settings size={18} />,
      path: "/dashboard/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Sign Out</h3>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      <header className="bg-white shadow-sm">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 md:hidden"
              aria-label="Toggle menu"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <JasonLogo className="h-8" />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="hidden p-2 rounded-full hover:bg-gray-100 md:block"
              aria-label="Home"
            >
              <Home size={20} className="text-gray-600" />
            </button>
            <button
              className="relative hidden p-2 rounded-full hover:bg-gray-100 md:block"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              className="hidden p-2 rounded-full hover:bg-gray-100 md:block"
              aria-label="Help"
            >
              <HelpCircle size={20} className="text-gray-600" />
            </button>
            <div className="hidden w-px h-6 bg-gray-200 md:block"></div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="items-center hidden text-gray-600 md:flex hover:text-blue-600"
              aria-label="Sign out"
            >
              <LogOut size={18} className="mr-1" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container px-0 py-0 mx-auto md:px-4 md:py-8">
        <div className="flex flex-col md:flex-row">
          {/* Mobile Sidebar */}
          <aside className={`fixed top-0 left-0 z-40 w-64 h-full p-6 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="flex items-center mb-8 space-x-4">
              <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-blue-100 rounded-full">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || "User avatar"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User size={24} className="text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="font-bold">
                  {profile?.full_name || user?.email?.split("@")[0] || "User"}
                </h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map(({ key, label, icon, path }) => (
                <button
                  key={key}
                  onClick={() => {
                    navigate(path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                    location.pathname === path ||
                    (path === "/dashboard" && location.pathname === "/dashboard")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-6 mt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Loyalty Points</span>
                <span className="font-medium">
                  {profile?.loyalty_points || 0}
                </span>
              </div>
              <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      ((profile?.loyalty_points || 0) / 1000) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="mb-6 text-xs text-gray-500">
                {1000 - (profile?.loyalty_points || 0)} points to next tier
              </div>
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-between ${
                    cartItems.length > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>Checkout ({cartItems.length})</span>
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          </aside>

          {/* Desktop Sidebar */}
          <aside className="sticky hidden p-6 bg-white shadow-sm md:block md:w-64 rounded-xl h-fit top-8">
            <div className="flex items-center mb-8 space-x-4">
              <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-blue-100 rounded-full">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || "User avatar"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User size={24} className="text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="font-bold">
                  {profile?.full_name || user?.email?.split("@")[0] || "User"}
                </h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map(({ key, label, icon, path }) => (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                    location.pathname === path ||
                    (path === "/dashboard" && location.pathname === "/dashboard")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-6 mt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Loyalty Points</span>
                <span className="font-medium">
                  {profile?.loyalty_points || 0}
                </span>
              </div>
              <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      ((profile?.loyalty_points || 0) / 1000) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="mb-6 text-xs text-gray-500">
                {1000 - (profile?.loyalty_points || 0)} points to next tier
              </div>
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-between ${
                    cartItems.length > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>Checkout ({cartItems.length})</span>
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 w-full px-4 py-4 md:px-6 md:py-6">
            <div className="p-4 bg-white rounded-lg shadow-sm md:p-6">
              <Outlet context={{ user, profile }} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}