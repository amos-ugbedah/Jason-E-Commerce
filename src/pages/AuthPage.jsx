import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import JasonLogo from "../components/jason/JasonLogo";
import { toast } from "react-hot-toast";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AuthPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get("type") || "login";

  const [type, setType] = useState(initialType);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [oauthLoading, setOauthLoading] = useState({
    google: false,
    facebook: false,
  });

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Check if coming from OAuth redirect
      const fromOAuth = window.location.search.includes("code=");
      if (!fromOAuth) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (type === "login") {
        const user = await signIn(email, password);
        if (user) {
          toast.success("Login successful!");
          navigate("/dashboard", { replace: true });
        }
      } else {
        const { user: signedUpUser, error: signUpError } = await signUp(email, password, name);
        if (signUpError) throw signUpError;
        
        if (signedUpUser) {
          setSuccess("Account created! Please check your email for confirmation.");
          setEmail("");
          setPassword("");
          setName("");
          
          // For immediate login after signup (if email confirmation not required)
          if (!signedUpUser.identities || signedUpUser.identities.length > 0) {
            navigate("/dashboard", { replace: true });
          }
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      setOauthLoading((prev) => ({ ...prev, [provider]: true }));
      setError("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to login with ${provider}`);
    } finally {
      setOauthLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  const switchAuthType = (newType) => {
    setType(newType);
    setError("");
    setSuccess("");
    navigate(`/auth?type=${newType}`, { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Left Side - Branding */}
      <div className="flex flex-col items-center justify-center p-12 text-white bg-blue-600 md:w-1/2">
        <div className="max-w-md">
          <JasonLogo className="w-16 h-16 mb-6" />
          <h1 className="mb-4 text-4xl font-bold">Welcome to Jason</h1>
          <p className="mb-8 text-lg text-blue-100">
            {type === "login"
              ? "Login to access your personalized shopping experience with Jason's AI recommendations."
              : "Join Jason today and unlock a smarter way to shop with our AI-powered assistant."}
          </p>
          <div className="flex items-center space-x-2 text-blue-200">
            <ArrowRight size={20} />
            <span>Your AI shopping companion</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 md:w-1/2 md:p-12">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
          <div className="flex mb-6 border-b">
            <button
              onClick={() => switchAuthType("login")}
              className={`pb-2 px-4 font-medium ${
                type === "login"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchAuthType("register")}
              className={`pb-2 px-4 font-medium ${
                type === "register"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            {type === "login" ? "Welcome Back" : "Create Your Account"}
          </h2>

          {error && (
            <div className="flex items-center p-3 mb-4 text-red-600 rounded-lg bg-red-50">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center p-3 mb-4 text-green-600 rounded-lg bg-green-50">
              <span className="mr-2">🎉</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {type === "register" && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full py-3 pl-10 pr-4 transition border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full py-3 pl-10 pr-4 transition border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full py-3 pl-10 pr-10 transition border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </button>
            </div>

            {type === "login" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="block ml-2 text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="mr-2 animate-spin">🌀</span>
              ) : (
                <ArrowRight size={18} className="mr-2" />
              )}
              {type === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                disabled={oauthLoading.google}
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {oauthLoading.google ? (
                  <span className="animate-spin">🌀</span>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.786-1.667-4.167-2.698-6.735-2.698-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.069-1.325-0.189-1.955h-9.811z" />
                    </svg>
                    <span>Google</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin("facebook")}
                disabled={oauthLoading.facebook}
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {oauthLoading.facebook ? (
                  <span className="animate-spin">🌀</span>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                    <span>Facebook</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}