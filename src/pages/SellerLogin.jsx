import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function SellerLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Verify user exists and has seller role
      const { data: userData, error: userError } = await supabase
        .from("jason_users")
        .select("id, role")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (userError) throw userError;
      if (!userData) {
        await supabase.auth.signOut();
        throw new Error("User account not found. Please register first.");
      }
      if (userData.role !== "seller") {
        await supabase.auth.signOut();
        throw new Error("You don't have seller privileges. Please use the customer login.");
      }

      // 3. Verify seller profile exists
      const { data: sellerData, error: sellerError } = await supabase
        .from("jason_sellers")
        .select("id, approved")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (sellerError) throw sellerError;
      
      if (!sellerData) {
        await supabase.auth.signOut();
        navigate("/seller/register", {
          state: { 
            message: "Please complete your seller registration",
            email: formData.email 
          },
          replace: true
        });
        return;
      }

      // 4. Check approval status
      if (!sellerData.approved) {
        navigate("/seller/dashboard");
        return;
      }

      // Successful login
      const redirectTo = location.state?.from || "/seller/dashboard";
      navigate(redirectTo, { replace: true });
      toast.success("Welcome back!");

    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.message.includes("Invalid login credentials")
        ? "Invalid email or password"
        : error.message;
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Seller Login</h1>
          <p className="text-gray-600">Manage your seller account</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="pt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/seller/register")}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Register as seller
          </button>
        </div>
      </div>
    </div>
  );
}