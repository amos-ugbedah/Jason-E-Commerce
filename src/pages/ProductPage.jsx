import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { cld } from "../lib/cloudinary";
import {
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  ChevronDown,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const zoomedImageRef = useRef(null);

  const getPublicIdFromUrl = (url) => {
    if (!url) return "";
    try {
      const parts = url.split("/upload/");
      if (parts.length < 2) return url;
      const afterUpload = parts[1];
      const publicId = afterUpload.split("/").pop().split(".")[0];
      return publicId;
    } catch {
      return url;
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("jason_products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Product not found");

        setProduct(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) {
      toast.error("Product not loaded");
      return;
    }

    if (product.stock_quantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    const existingItem = cart.items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        toast.error(`Only ${product.stock_quantity} available in stock`);
        return;
      }
    }

    dispatch(
      addToCart({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          discount_percentage: product.discount_percentage || 0,
          image: product.cloudinary_urls?.[0] || "",
          stock_quantity: product.stock_quantity,
          currency: product.currency || "NGN",
          freeDelivery: product.free_delivery || false,
        },
        quantity: quantity,
      })
    );

    toast.success(`${quantity} ${product.name}(s) added to cart`);
  };

  const handleNextImage = () => {
    if (product?.cloudinary_urls) {
      setActiveImageIndex((prev) =>
        prev === product.cloudinary_urls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (product?.cloudinary_urls) {
      setActiveImageIndex((prev) =>
        prev === 0 ? product.cloudinary_urls.length - 1 : prev - 1
      );
    }
  };

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
  };

  const handleZoomClick = (e) => {
    if (zoomedImageRef.current && !zoomedImageRef.current.contains(e.target)) {
      setIsZoomed(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product?.currency || "USD",
      currencyDisplay: "symbol",
    }).format(amount);
  };

  const parseSpecifications = (specs) => {
    if (!specs) return [];

    if (typeof specs === "object" && !Array.isArray(specs)) {
      return [
        {
          groupName: "Specifications",
          items: Object.entries(specs).map(([key, value]) => ({
            name: key,
            value,
          })),
        },
      ];
    }

    if (typeof specs === "string") {
      try {
        const parsed = JSON.parse(specs);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return [
          {
            groupName: "Specifications",
            items: Object.entries(parsed).map(([key, value]) => ({
              name: key,
              value,
            })),
          },
        ];
      } catch {
        return [
          {
            groupName: "Specifications",
            items: [{ name: "Details", value: specs }],
          },
        ];
      }
    }

    return [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen py-8">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen py-8">
        <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen py-8">
        <div className="p-4 text-gray-600 bg-gray-100 rounded-lg">
          Product not found
        </div>
      </div>
    );
  }

  const currentPrice = product.discount_percentage
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const specificationGroups = parseSpecifications(product.specifications);

  return (
    <div className="container px-4 py-8 mx-auto mt-24">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <div className="sticky top-24">
          <div className="relative mb-4 overflow-hidden bg-white shadow-md rounded-xl aspect-square">
            {product.cloudinary_urls?.length > 0 ? (
              <>
                <AdvancedImage
                  cldImg={cld
                    .image(
                      getPublicIdFromUrl(
                        product.cloudinary_urls[activeImageIndex]
                      )
                    )
                    .resize(fill().width(800).height(800))}
                  className="object-contain w-full h-full cursor-zoom-in"
                  alt={product.name}
                  onClick={() => setIsZoomed(true)}
                />

                {product.cloudinary_urls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute z-10 p-2 -translate-y-1/2 rounded-full shadow-md left-2 top-1/2 bg-white/80 hover:bg-white backdrop-blur-sm"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute z-10 p-2 -translate-y-1/2 rounded-full shadow-md right-2 top-1/2 bg-white/80 hover:bg-white backdrop-blur-sm"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsZoomed(true)}
                  className="absolute p-2 rounded-full shadow-md bottom-4 right-4 bg-white/80 hover:bg-white backdrop-blur-sm"
                  aria-label="Zoom image"
                >
                  <ZoomIn size={20} />
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {product.cloudinary_urls?.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.cloudinary_urls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                    activeImageIndex === index
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <AdvancedImage
                    cldImg={cld
                      .image(getPublicIdFromUrl(url))
                      .resize(fill().width(150).height(150))}
                    className="object-cover w-full h-full"
                    alt={`${product.name} thumbnail ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.floor(product.rating || 0)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-500">
                ({product.review_count || 0} reviews)
              </span>
            </div>

            {product.stock_quantity > 0 ? (
              <div className="inline-block px-3 py-1 mb-4 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                In Stock ({product.stock_quantity} available)
              </div>
            ) : (
              <div className="inline-block px-3 py-1 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                Out of Stock
              </div>
            )}

            <div className="mb-6">
              {product.discount_percentage ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-3xl font-bold text-rose-600">
                    {formatCurrency(currentPrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="px-2 py-1 text-sm font-medium rounded bg-rose-100 text-rose-600">
                    {product.discount_percentage}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            {product.free_delivery && (
              <div className="p-3 mb-6 text-green-700 bg-green-100 rounded-lg">
                <span className="font-medium">✓ Free Delivery</span> available
                for this product
              </div>
            )}
          </div>

          <div className="py-4 border-t border-gray-200">
            <h3 className="mb-2 text-lg font-semibold">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="py-4 border-t border-gray-200">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Quantity
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-24 px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              disabled={product.stock_quantity <= 0}
            >
              {[...Array(Math.min(10, product.stock_quantity ?? 0)).keys()].map(
                (i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            className={`w-full px-6 py-3 font-medium text-white rounded-lg ${
              product.stock_quantity <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {product.stock_quantity <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          {specificationGroups.length > 0 && (
            <div className="space-y-4">
              {specificationGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="border rounded-lg">
                  <button
                    onClick={() => toggleSection(`specs-${groupIndex}`)}
                    className="flex items-center justify-between w-full p-4 text-left"
                  >
                    <h3 className="font-semibold">{group.groupName}</h3>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        expandedSection === `specs-${groupIndex}`
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                  {expandedSection === `specs-${groupIndex}` && (
                    <div className="p-4 pt-0 border-t">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {group.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="py-2">
                            <h4 className="text-sm font-medium text-gray-500">
                              {item.name}
                            </h4>
                            <p className="font-medium">
                              {Array.isArray(item.value)
                                ? item.value.join(", ")
                                : typeof item.value === "object"
                                ? JSON.stringify(item.value)
                                : item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isZoomed && product.cloudinary_urls?.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={handleZoomClick}
        >
          <button
            className="absolute p-2 text-white rounded-full top-4 right-4 hover:bg-white/10"
            onClick={() => setIsZoomed(false)}
            aria-label="Close zoomed view"
          >
            <X size={32} />
          </button>
          <div className="relative w-full max-w-4xl" ref={zoomedImageRef}>
            <AdvancedImage
              cldImg={cld
                .image(
                  getPublicIdFromUrl(product.cloudinary_urls[activeImageIndex])
                )
                .resize(fill().width(1200).height(1200))}
              className="w-full max-h-[90vh] object-contain"
              alt={`Zoomed ${product.name}`}
            />
            {product.cloudinary_urls.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute p-3 text-white -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute p-3 text-white -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
