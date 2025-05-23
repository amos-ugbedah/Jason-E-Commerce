import { Link, useNavigate } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  HelpCircle,
  Shield,
  Gift,
  Truck,
  CreditCard,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-hot-toast";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleFeaturedClick = async () => {
    try {
      // Fetch featured category with proper headers
      const { data, error } = await supabase
        .from("jason_categories")
        .select("*")
        .eq("slug", "featured")
        .single();

      if (error) throw error;
      if (!data) throw new Error("No featured category found");

      navigate(`/categories/featured`, { state: { category: data } });
    } catch (error) {
      console.error("Error fetching featured items:", error);
      toast.error("Failed to load featured items");
    }
  };

  return (
    <footer className="pt-12 pb-6 text-white bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Jason */}
          <div>
            <h3 className="flex items-center mb-4 text-xl font-bold">
              <span className="flex items-center justify-center w-8 h-8 mr-2 bg-blue-600 rounded-full">
                J
              </span>
              JASON
            </h3>
            <p className="mb-4 text-gray-400">
              Your AI-powered shopping companion. We combine cutting-edge
              technology with curated products to revolutionize your shopping
              experience.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Shop With Jason</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  All Products
                </Link>
              </li>
              <li>
                <button
                  onClick={handleFeaturedClick}
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  Featured Items
                </button>
              </li>
              <li>
                <Link
                  to="/categories/new-arrivals"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  Daily Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/jasons-picks"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  Jason's Picks
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Customer Care</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Why Choose Jason?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Truck
                  size={20}
                  className="flex-shrink-0 mt-1 mr-3 text-blue-400"
                />
                <div>
                  <h4 className="font-medium">Fast Delivery</h4>
                  <p className="text-sm text-gray-400">
                    Get your orders in 2-3 business days
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield
                  size={20}
                  className="flex-shrink-0 mt-1 mr-3 text-blue-400"
                />
                <div>
                  <h4 className="font-medium">Secure Payments</h4>
                  <p className="text-sm text-gray-400">
                    100% secure payment processing
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Gift
                  size={20}
                  className="flex-shrink-0 mt-1 mr-3 text-blue-400"
                />
                <div>
                  <h4 className="font-medium">Loyalty Rewards</h4>
                  <p className="text-sm text-gray-400">
                    Earn points with every purchase
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="p-6 mb-8 bg-gray-800 rounded-lg">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <h3 className="mb-1 text-lg font-semibold">
                Stay Updated with Jason
              </h3>
              <p className="text-gray-400">
                Subscribe for exclusive deals and tech insights
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 text-white bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 font-medium transition-colors bg-blue-600 rounded-r-lg hover:bg-blue-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between pt-6 border-t border-gray-800 md:flex-row">
          <p className="mb-4 text-sm text-gray-400 md:mb-0">
            &copy; {currentYear} Jason Technologies. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-sm text-gray-400 transition-colors hover:text-blue-400"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-400 transition-colors hover:text-blue-400"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-gray-400 transition-colors hover:text-blue-400"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}