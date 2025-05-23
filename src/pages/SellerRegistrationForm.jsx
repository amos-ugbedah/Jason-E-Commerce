import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function SellerRegistrationForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    businessName: "",
    businessDescription: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    taxId: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!formData.phone) {
      setError("Phone number is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const { data: existingUser, error: userCheckError } = await supabase
        .from('jason_users')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (userCheckError) throw userCheckError;
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // 1. Sign up the user with Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: "seller",
            phone: formData.phone
          },
          emailRedirectTo: `${window.location.origin}/seller/dashboard`
        }
      });

      if (authError) throw authError;
      if (!authData.user) {
        throw new Error("User creation failed - no user returned");
      }

      // 2. Create user profile in jason_users
      const { error: profileError } = await supabase
        .from("jason_users")
        .insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          phone: formData.phone,
          role: "seller",
        });

      if (profileError) throw profileError;

      // Prepare JSON data structures
      const businessAddress = {
        street: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country
      };

      const bankDetails = {
        bank_name: formData.bankName,
        account_number: formData.accountNumber,
        account_name: formData.accountName
      };

      // 3. Create seller profile with properly formatted JSON
      const { error: sellerError } = await supabase
        .from("jason_sellers")
        .insert({
          user_id: authData.user.id,
          email: formData.email,
          business_name: formData.businessName,
          business_description: formData.businessDescription,
          business_address: businessAddress,
          bank_account_details: bankDetails,
          tax_id: formData.taxId || null,
          is_profile_complete: true,
          approved: false,
          phone: formData.phone
        });

      if (sellerError) throw sellerError;

      // 4. Create basic profile in jason_profiles
      const { error: profileCreateError } = await supabase
        .from("jason_profiles")
        .insert({
          user_id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: "seller"
        });

      if (profileCreateError) throw profileCreateError;

      toast.success("Seller account created successfully! Please check your email to verify your account.");
      navigate("/seller/dashboard");

    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to create seller account");
      toast.error(error.message || "Failed to create seller account");
      
      // Clean up any partial data if registration failed
      if (formData.email) {
        try {
          // Delete from auth if user was created
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.auth.admin.deleteUser(user.id);
          }
          
          // Delete from users table if exists
          await supabase
            .from('jason_users')
            .delete()
            .eq('email', formData.email);
            
          // Delete from sellers table if exists
          await supabase
            .from('jason_sellers')
            .delete()
            .eq('email', formData.email);
            
          // Delete from profiles table if exists
          await supabase
            .from('jason_profiles')
            .delete()
            .eq('email', formData.email);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Become a Seller</h2>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Information */}
        <div className="space-y-4">
          <h3 className="pb-2 text-lg font-medium border-b">
            Account Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
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
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute text-gray-500 right-3 top-3 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength="6"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute text-gray-500 right-3 top-3 hover:text-gray-700"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="pb-2 text-lg font-medium border-b">
            Business Information
          </h3>
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="businessDescription">Business Description</Label>
            <textarea
              id="businessDescription"
              name="businessDescription"
              rows="3"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.businessDescription}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Business Address */}
        <div className="space-y-4">
          <h3 className="pb-2 text-lg font-medium border-b">
            Business Address
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                required
                value={formData.streetAddress}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="space-y-4">
          <h3 className="pb-2 text-lg font-medium border-b">
            Payment Information
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                name="bankName"
                required
                value={formData.bankName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                required
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                name="accountName"
                required
                value={formData.accountName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="taxId">Tax ID (Optional)</Label>
              <Input
                id="taxId"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Register as Seller"
            )}
          </Button>
          
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/seller/login")}
              className="font-medium text-blue-600 hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}