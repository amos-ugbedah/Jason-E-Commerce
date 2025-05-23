import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/auth/authSlice";
import { supabase } from '../../lib/supabaseClient';
import { debounce } from 'lodash';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const categoriesRef = useRef(null);
  const searchRef = useRef(null);

  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategoriesDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const { data: categoryDetails, error: categoriesError } = await supabase
          .from('jason_categories')
          .select('name, slug, description, is_featured')
          .order('name', { ascending: true });

        if (categoriesError) throw categoriesError;

        if (categoryDetails && categoryDetails.length > 0) {
          setCategories(categoryDetails.map(cat => ({
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
            description: cat.description,
            isFeatured: cat.is_featured
          })));
          return;
        }

        // Fallback to product categories if no dedicated categories table
        const { data: productCategories, error: productsError } = await supabase
          .from('jason_products')
          .select('category')
          .not('category', 'is', null);

        if (productsError) throw productsError;

        const uniqueCategoryNames = [...new Set(
          productCategories.map(item => item.category).filter(Boolean)
        )];

        setCategories(uniqueCategoryNames.map(name => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          description: null,
          isFeatured: false
        })));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search suggestions
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query || query.trim() === '') {
        setSearchSuggestions([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('jason_products')
          .select('title, id')
          .ilike('title', `%${query}%`)
          .limit(5);

        if (!error && data) {
          setSearchSuggestions(data);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(searchQuery);
    return () => fetchSuggestions.cancel();
  }, [searchQuery, fetchSuggestions]);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    } else {
      navigate('/search');
    }
    setIsMenuOpen(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
    setShowSuggestions(false);
    setShowSearch(false);
  };

  const confirmLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch(clearUser());
      setShowLogoutModal(false);
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      setShowLogoutModal(false);
    }
  };

  const handleDashboardNavigation = () => {
    navigate(user ? "/dashboard" : "/auth");
  };

  const toggleCategoriesDropdown = () => {
    setShowCategoriesDropdown(!showCategoriesDropdown);
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md py-2"
            : "bg-gradient-to-b from-black/20 to-transparent py-4"
        }`}
      >
        <div className="container flex items-center justify-between px-4 mx-auto">
          {/* Logo and Main Links */}
          <div className="flex items-center space-x-6 md:space-x-10">
            <Link 
              to="/" 
              className="flex items-center shrink-0"
              onClick={() => setShowCategoriesDropdown(false)}
            >
              <div className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white bg-blue-600 rounded-full">
                J
              </div>
              <span
                className={`hidden ml-2 text-xl font-bold md:block ${
                  scrolled ? "text-blue-600" : "text-white"
                }`}
              >
                JASON
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="items-center hidden space-x-6 md:flex">
              {[
                { name: "Shop", path: "/products" },
                { name: "About", path: "/about" },
                { name: "Sell on Jason", path: "/sell-with-us" }
              ].map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `font-medium ${
                      isActive
                        ? "text-blue-600"
                        : scrolled
                        ? "text-gray-700 hover:text-blue-600"
                        : "text-white hover:text-blue-300"
                    }`
                  }
                  onClick={() => setShowCategoriesDropdown(false)}
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="relative group" ref={categoriesRef}>
                <button
                  className={`flex items-center font-medium ${
                    scrolled
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white hover:text-blue-300"
                  }`}
                  onClick={toggleCategoriesDropdown}
                >
                  Categories <ChevronDown size={16} className="ml-1" />
                </button>
                <div 
                  className={`absolute z-50 w-48 p-2 mt-2 bg-white rounded-lg shadow-lg ${
                    showCategoriesDropdown ? 'block' : 'hidden'
                  }`}
                  style={{ 
                    maxHeight: '60vh', 
                    overflowY: 'auto',
                    scrollbarWidth: 'thin'
                  }}
                >
                  {isLoadingCategories ? (
                    <p className="px-3 py-2 text-sm text-gray-500">Loading categories...</p>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/categories/${cat.slug}`}
                        className="block px-3 py-2 capitalize rounded hover:bg-blue-50"
                        onClick={() => setShowCategoriesDropdown(false)}
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-gray-500">No categories found</p>
                  )}
                </div>
              </div>
            </nav>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center space-x-4">
            {showSearch ? (
              <div className="relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search products..."
                    className="px-3 py-1 pr-8 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute transform -translate-y-1/2 right-2 top-1/2"
                    aria-label="Search"
                  >
                    <Search size={18} className="text-gray-500" />
                  </button>
                </form>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {searchSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.title}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="p-1 ml-2 rounded-full hover:bg-gray-100"
                  aria-label="Close search"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowSearch(true);
                  setShowCategoriesDropdown(false);
                }}
                className={`p-2 rounded-full ${
                  scrolled ? "hover:bg-gray-100" : "hover:bg-white/20"
                }`}
              >
                <Search
                  size={20}
                  className={scrolled ? "text-gray-700" : "text-white"}
                />
              </button>
            )}

            <NavLink
              to="/cart"
              className={`relative p-2 rounded-full ${
                scrolled ? "hover:bg-gray-100" : "hover:bg-white/20"
              }`}
              onClick={() => setShowCategoriesDropdown(false)}
            >
              <ShoppingCart
                size={20}
                className={scrolled ? "text-gray-700" : "text-white"}
              />
              {cartCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {user ? (
              <div className="items-center hidden space-x-2 md:flex">
                <button
                  onClick={() => {
                    handleDashboardNavigation();
                    setShowCategoriesDropdown(false);
                  }}
                  className={`font-medium ${
                    scrolled ? "text-gray-700" : "text-white"
                  } hover:text-blue-300`}
                >
                  Hi, {user.user_metadata?.name || user.email?.split("@")[0]}
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setShowCategoriesDropdown(false);
                  }}
                  className={`p-2 rounded-full ${
                    scrolled ? "hover:bg-gray-100" : "hover:bg-white/20"
                  }`}
                  title="Sign Out"
                >
                  <LogOut
                    size={20}
                    className={scrolled ? "text-gray-700" : "text-white"}
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/auth");
                  setShowCategoriesDropdown(false);
                }}
                className={`hidden p-2 rounded-full md:block ${
                  scrolled ? "hover:bg-gray-100" : "hover:bg-white/20"
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 text-xs text-white bg-gray-600 rounded-full">
                  👤
                </div>
              </button>
            )}

            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setShowCategoriesDropdown(false);
              }}
              className="p-2 rounded-full md:hidden hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X
                  size={20}
                  className={scrolled ? "text-gray-700" : "text-white"}
                />
              ) : (
                <Menu
                  size={20}
                  className={scrolled ? "text-gray-700" : "text-white"}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 z-40 bg-white shadow-lg md:hidden top-full">
            <div className="container px-4 py-3 mx-auto">
              <nav className="flex flex-col space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "Shop", path: "/products" },
                  { name: "About", path: "/about" },
                  { name: "Sell on Jason", path: "/sell-with-us" }
                ].map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded font-medium ${
                        isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                    end={link.path === "/"}
                  >
                    {link.name}
                  </NavLink>
                ))}

                <div className="px-3 py-2">
                  <p className="mb-2 font-medium">Categories</p>
                  <div className="pl-3 space-y-2">
                    {isLoadingCategories ? (
                      <p className="px-2 py-1 text-sm text-gray-500">Loading...</p>
                    ) : categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/categories/${cat.slug}`}
                          className="block px-2 py-1 text-sm capitalize rounded hover:bg-blue-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <p className="px-2 py-1 text-sm text-gray-500">No categories found</p>
                    )}
                  </div>
                </div>

                {user ? (
                  <>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `block py-2 px-3 rounded font-medium ${
                          isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 font-medium text-left text-red-600 rounded hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/auth");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 font-medium text-left text-blue-600 rounded hover:bg-blue-50"
                  >
                    Sign In
                  </button>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-6 text-center bg-white rounded-lg shadow-md w-80">
            <p className="mb-4 text-lg font-medium">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}